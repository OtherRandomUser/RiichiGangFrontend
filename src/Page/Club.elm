module Page.Club exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import List.Extra
import Json.Encode as Encode
import Url.Builder

import Api
import Club exposing (Club)
import CommonHtml exposing (..)
import Model.TournamentShort
import Model.ClubMembership exposing (ClubMembership)
import Session exposing (Session)
import UserShort
import Viewer exposing (Viewer)


type alias Model =
  { session : Session
  , error : Maybe String
  , state : State
  }

type State
  = Uninitialized
  | View Club ViewSwitch
  | Edit Club Form
  | New Form

type ViewSwitch
  = Anonymus
  | Owner
  | Member ClubMembership
  | NonMember

type alias Form =
  { name : String
  , website : String
  , contact : String
  , localization : String
  }

type Msg
  = GotClub (Result Api.ApiError Club)
  | EditClub
  | ConfirmEdit
  | CancelEdit
  -- | PatchClub (Result Api.ApiError Club)
  | CancelNew
  | ConfirmNew
  | ConfirmDelete
  | DeleteClub (Result Api.ApiError ())
  | AskInvite
  | Leave
  | RemoveMember ClubMembership
  | InputName String
  | InputWebsite String
  | InputContact String
  | InputLocalization String

init : Session -> Int -> (Model, Cmd Msg)
init session clubId =
  (Model session Nothing Uninitialized, get clubId)

initNew : Session -> (Model, Cmd Msg)
initNew session =
  (Model session Nothing (New (Form "" "" "" "")), Cmd.none)

get : Int -> Cmd Msg
get id =
  Http.get
  { url = Api.club id
  , expect = Api.expectJson GotClub Club.clubDecoder
  }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    makeRequest = \request -> case Session.toViewer model.session of
      Just viewer ->
        (model, request viewer)

      Nothing ->
        ({ model | error = Just "De alguma forma, você não está logado" }, Cmd.none)
  in
  case (msg, model.state) of
    (GotClub result, _) ->
      case result of
        Ok club ->
          ({ model | state = initState club model.session, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (EditClub, View club Owner) ->
      ({ model | state = Edit club (Form "" "" "" ""), error = Nothing }, Cmd.none)

    (CancelEdit, Edit club _) ->
      ({ model | state = View club Owner, error = Nothing }, Cmd.none)

    (ConfirmEdit, Edit club form) ->
      case validatePatch form of
        Ok _ ->
          makeRequest (\viewer -> requestPatch club form viewer)

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    -- (PatchClub result, Edit _ _) ->
    --   case result of
    --     Ok user ->
    --       ({ model | state = View user Owner, error = Nothing }, Cmd.none)

    --     Err error ->
    --       ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (CancelNew, New _) ->
      (model, Nav.back (Session.navKey model.session) 1)

    (ConfirmNew, New form) ->
      case validateNew form of
        Ok _ ->
          makeRequest (\viewer -> requestPost form viewer)

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    (ConfirmDelete, View club Owner) ->
      makeRequest (\viewer -> requestDelete club viewer)

    (DeleteClub result, View _ Owner) ->
      case result of
        Ok _ ->
          (model, Nav.pushUrl (Session.navKey model.session) (Url.Builder.absolute [] []))

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (AskInvite, View club NonMember) ->
      makeRequest (\viewer -> requestInvite club viewer)

    (Leave, View club (Member _)) ->
      makeRequest (\viewer -> requestLeave club viewer)

    (RemoveMember membership, View club Owner) ->
      makeRequest (\viewer -> requestRemoveMember club membership viewer)

    (InputName name, New form) ->
      updateNewForm (\f -> { f | name = name }) form model

    (InputName name, Edit club form) ->
      updateEditForm (\f -> { f | name = name }) club form model

    (InputWebsite website, New form) ->
      updateNewForm (\f -> { f | website = website }) form model

    (InputWebsite website, Edit club form) ->
      updateEditForm (\f -> { f | website = website }) club form model

    (InputContact contact, New form) ->
      updateNewForm (\f -> { f | contact = contact }) form model

    (InputContact contact, Edit club form) ->
      updateEditForm (\f -> { f | contact = contact }) club form model

    (InputLocalization localization, New form) ->
      updateNewForm (\f -> { f | localization = localization }) form model

    (InputLocalization localization, Edit club form) ->
      updateEditForm (\f -> { f | localization = localization }) club form model

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

updateEditForm : (Form -> Form) -> Club -> Form -> Model -> (Model, Cmd msg)
updateEditForm transform club form model =
  ({ model | state = Edit club (transform form) }, Cmd.none)

updateNewForm : (Form -> Form) -> Form -> Model -> (Model, Cmd msg)
updateNewForm transform form model =
  ({ model | state = New (transform form) }, Cmd.none)

validatePatch : Form -> Result String ()
validatePatch form =
  if String.isEmpty form.contact
  && String.isEmpty form.localization
  && String.isEmpty form.name
  && String.isEmpty form.website then
    Err "Preencha ao menos um campo para ser atualizado"
  else
    Ok ()

validateNew : Form -> Result String ()
validateNew form =
  if String.isEmpty form.contact then
    Err "Preencha o contato"
  else if String.isEmpty form.localization then
    Err "Preencha a localização"
  else if String.isEmpty form.name then
    Err "Preencha o nome do clube"
  else if String.isEmpty form.website then
    Err "Preencha o site do clube"
  else
    Ok ()

requestPatch : Club -> Form -> Viewer -> Cmd Msg
requestPatch club form viewer =
  Api.privatePut
    { url = Api.club club.id
    , body = Http.jsonBody (patchEncoder form)
    , expect = Api.expectJson GotClub Club.clubDecoder
    } viewer

requestPost : Form -> Viewer -> Cmd Msg
requestPost form viewer =
  Api.privatePost
    { url = Api.clubs
    , body = Http.jsonBody (postEncoder form)
    , expect = Api.expectJson GotClub Club.clubDecoder
    } viewer

requestDelete : Club -> Viewer -> Cmd Msg
requestDelete club viewer =
  Api.privateDelete
    { url = Api.club club.id
    , expect = Api.expectWhatever DeleteClub
    } viewer

requestInvite : Club -> Viewer -> Cmd Msg
requestInvite club viewer =
  Api.privatePost
    { url = Api.clubInvite club.id
    , body = Http.emptyBody
    , expect = Api.expectJson GotClub Club.clubDecoder
    } viewer

requestLeave : Club -> Viewer -> Cmd Msg
requestLeave club viewer =
  Api.privateDelete
    { url = Api.clubMembers club.id
    , expect = Api.expectJson GotClub Club.clubDecoder
    } viewer

requestRemoveMember : Club -> ClubMembership -> Viewer -> Cmd Msg
requestRemoveMember club membership viewer =
  Api.privateDelete
    { url = Api.clubMember club.id membership.user.id
    , expect = Api.expectJson GotClub Club.clubDecoder
    } viewer

patchEncoder : Form -> Encode.Value
patchEncoder form =
  let
    maybeNull val = if String.isEmpty val then Encode.null else Encode.string val
  in
  Encode.object
    [ ("name", maybeNull form.name)
    , ("website", maybeNull form.website)
    , ("contact", maybeNull form.contact)
    , ("localization", maybeNull form.localization)
    ]

postEncoder : Form -> Encode.Value
postEncoder form =
  Encode.object
    [ ("name", Encode.string form.name)
    , ("website", Encode.string form.website)
    , ("contact", Encode.string form.contact)
    , ("localization", Encode.string form.localization)
    ]

initState : Club -> Session -> State
initState club session =
  case Session.toViewer session of
    Just viewer ->
      let
        isMember = \m -> m.user.id == viewer.id
      in
      if club.owner.id == viewer.id then
        View club Owner
      else case List.Extra.find isMember club.members of
        Just membership ->
          View club (Member membership)

        Nothing ->
          View club NonMember

    Nothing ->
      View club Anonymus

view : Model -> Browser.Document Msg
view model =
  { title = stateToTitle model.state
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , viewClub model

    ]
  }

viewClub : Model -> Html Msg
viewClub model =
  case model.state of
    Uninitialized ->
      p [] [ text "Carregando..." ]

    View club switch ->
      div []
        [ viewClubCard club switch
        , viewOwner club
        , viewTournaments club
        , viewMembers club (switch == Owner)
        ]

    Edit club _ ->
      div []
        [ viewClubCardEdit False
        , viewOwner club
        , viewTournaments club
        , viewMembers club True
        ]

    New _ ->
      div []
        [ viewClubCardEdit True
        ]

viewMembers : Club -> Bool -> Html Msg
viewMembers club isOwner =
  let
    transform =
      if isOwner then
        \m -> Model.ClubMembership.view m (Just (RemoveMember m))
      else
        \m -> Model.ClubMembership.view m Nothing

    filter =
      if isOwner then
        \_ -> True
      else
        \m -> m.approved && not m.denied
  in
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Membros" ]
    , div [ class "space-y-4" ] (List.map transform (List.filter filter club.members))
    ]

viewTournaments : Club -> Html Msg
viewTournaments club =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Torneios" ]
    , div [ class "space-y-4" ] (List.map Model.TournamentShort.view club.tournaments)
    ]

viewOwner : Club -> Html Msg
viewOwner club =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Dono do Clube" ]
    , div [ class "space-y-4" ]
      [ UserShort.view club.owner
      ]
    ]

viewClubCard : Club -> ViewSwitch -> Html Msg
viewClubCard club switch =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
    div [ class divClass ]
      [ h1 [ class "font-bold text-xl" ] [ text club.name ]
      , clubCardElement "Localização" club.localization
      , clubCardElement "Fundação" club.createdAt
      , clubCardElement "Site" club.website
      , clubCardElement "Contato" club.contact

      , case switch of
        Anonymus ->
          div [] []

        Owner ->
          div []
            [ button [ class "btn btn-indigo-500 mt-4", onClick EditClub ] [ text "Editar" ]
            , button [ class "border-none btn btn-red-500 mt-4", onClick ConfirmDelete ] [ text "Excluir" ]
            ]

        Member membership ->
          div []
            [ clubCardElement "Status da Filiação" (Model.ClubMembership.statusText membership)
            , button [ class "btn btn-indigo-500 mt-4", onClick Leave ] [ text "Sair" ]
            ]

        NonMember ->
          button [ class "btn btn-indigo-500 mt-4", onClick AskInvite ] [ text "Pedir Convite" ]
      ]

viewClubCardEdit : Bool -> Html Msg
viewClubCardEdit newClub =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg space-y-4"
    confirmMsg =
      if newClub then
        ConfirmNew
      else
        ConfirmEdit
    cancelMsg =
      if newClub then
        CancelNew
      else
        CancelEdit
  in
    div [ class divClass ]
      [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
      , input [ type_ "text", placeholder "Nome", class "login-input", onInput InputName ] []
      , input [ type_ "text", placeholder "Localização", class "login-input", onInput InputLocalization ] []
      , input [ type_ "text", placeholder "Site", class "login-input", onInput InputWebsite ] []
      , input [ type_ "text", placeholder "Contato", class "login-input", onInput InputContact ] []
      , button [ class "border-none btn btn-green-500", onClick confirmMsg ] [ text "Confirmar" ]
      , button [ class "border-none btn btn-red-500", onClick cancelMsg ] [ text "Cancelar" ]
      ]

clubCardElement : String -> String -> Html msg
clubCardElement title value = 
  div [ class "block" ]
    [ strong [ class "inline-block font-bold" ] [ text title ]
    , span [ class "inline-block" ] [ text value ]
    ]

stateToTitle : State -> String
stateToTitle state =
  case state of
    Uninitialized ->
      "Clube"

    View club _ ->
      "Clube - " ++ club.name

    Edit club _ ->
      "Clube - " ++ club.name

    New _ ->
      "Clube - Novo"

toSession : Model -> Session
toSession model =
  model.session
