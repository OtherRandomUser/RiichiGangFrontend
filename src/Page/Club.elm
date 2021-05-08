module Page.Club exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Encode as Encode
import Url.Builder

import Api
import Club exposing (Club)
import CommonHtml exposing (..)
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
  | ViewAnonymus Club
  | ViewOwner Club
  | Edit Club Form
  | New Form

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
  | PatchClub (Result Api.ApiError Club)
  -- new club
  -- confirm new club
  -- cancel new club
  -- post club
  | ConfirmDelete
  | DeleteClub (Result Api.ApiError ())
  | InputName String
  | InputWebsite String
  | InputContact String
  | InputLocalization String

init : Session -> Int -> (Model, Cmd Msg)
init session clubId =
  (Model session Nothing Uninitialized, get clubId)

get : Int -> Cmd Msg
get id =
  Http.get
  { url = Api.club id
  , expect = Api.expectJson GotClub Club.clubDecoder
  }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model.state) of
    (GotClub result, _) ->
      case result of
        Ok club ->
          ({ model | state = initState club model.session, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (EditClub, ViewOwner club) ->
      ({ model | state = Edit club (Form "" "" "" ""), error = Nothing }, Cmd.none)

    (CancelEdit, Edit club _) ->
      ({ model | state = ViewOwner club, error = Nothing }, Cmd.none)

    (ConfirmEdit, Edit club form) ->
      case validatePatch form of
        Ok _ ->
          case model.session of
            Session.LoggedIn _ viewer ->
              (model, (requestPatch club form viewer))

            Session.Anonymus _ ->
              ({ model | error = Just "De alguma forma, você não está logado" }, Cmd.none)

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    (PatchClub result, Edit _ _) ->
      case result of
        Ok user ->
          ({ model | state = ViewOwner user, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (ConfirmDelete, ViewOwner club) ->
      case Session.toViewer model.session of
        Just viewer ->
          (model, requestDelete club viewer)

        Nothing ->
          ({ model | error = Just "You shouldn't be able to do this " }, Cmd.none)

    (DeleteClub result, ViewOwner _) ->
      case result of
        Ok _ ->
          (model, Nav.pushUrl (Session.navKey model.session) (Url.Builder.absolute [] []))

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (InputName name, Edit club form) ->
      updateForm (\f -> { f | name = name }) club form model

    (InputWebsite website, Edit club form) ->
      updateForm (\f -> { f | website = website }) club form model

    (InputContact contact, Edit club form) ->
      updateForm (\f -> { f | contact = contact }) club form model

    (InputLocalization localization, Edit club form) ->
      updateForm (\f -> { f | localization = localization }) club form model

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

updateForm : (Form -> Form) -> Club -> Form -> Model -> (Model, Cmd msg)
updateForm transform user form model =
  ({ model | state = Edit user (transform form) }, Cmd.none)

validatePatch : Form -> Result String ()
validatePatch form =
  if String.isEmpty form.contact
  && String.isEmpty form.localization
  && String.isEmpty form.name
  && String.isEmpty form.website then
    Err "Preencha ao menos um campo para ser atualizado"
  else
    Ok ()

requestPatch : Club -> Form -> Viewer -> Cmd Msg
requestPatch club form viewer =
  Api.privatePut
    { url = Api.club club.id
    , body = Http.jsonBody (patchEncoder form)
    , expect = Api.expectJson PatchClub Club.clubDecoder
    } viewer

requestDelete : Club -> Viewer -> Cmd Msg
requestDelete club viewer =
  Api.privateDelete
    { url = Api.club club.id
    , expect = Api.expectWhatever DeleteClub
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

initState : Club -> Session -> State
initState club session =
  case Session.toViewer session of
    Just viewer ->
      if club.owner.id == viewer.id then
        ViewOwner club
      else
        ViewAnonymus club

    Nothing ->
      ViewAnonymus club

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

    ViewAnonymus club ->
      div []
        [ viewClubCard club
        , viewOwner club
        , viewTournaments club
        , viewMembers club
        ]

    ViewOwner club ->
      div []
        [ viewClubCardOwner club
        , viewOwner club
        , viewTournaments club
        , viewMembers club
        , button [ class "border-none btn btn-red-500", onClick ConfirmDelete ] [ text "Excluir" ]
        ]

    Edit club _ ->
      div []
        [ viewClubCardEdit
        , viewOwner club
        , viewTournaments club
        , viewMembers club
        ]

    New _ ->
      div []
        [ viewClubCardEdit
        ]

viewMembers : Club -> Html Msg
viewMembers _ =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Membros" ]
    , div [ class "space-y-4" ]
      [ p [] [ text "TODO" ]
      ]
    ]

viewTournaments : Club -> Html Msg
viewTournaments _ =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Torneios" ]
    , div [ class "space-y-4" ]
      [ p [] [ text "TODO" ]
      ]
    ]

viewOwner : Club -> Html Msg
viewOwner club =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Dono do Clube" ]
    , div [ class "space-y-4" ]
      [ UserShort.view club.owner
      ]
    ]

viewClubCard : Club -> Html Msg
viewClubCard club =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
    div [ class divClass ]
      [ h1 [ class "font-bold text-xl" ] [ text club.name ]
      , clubCardElement "Localização" club.localization
      , clubCardElement "Fundação" club.createdAt
      , clubCardElement "Site" club.website
      , clubCardElement "Contato" club.contact
      ]

viewClubCardOwner : Club -> Html Msg
viewClubCardOwner club =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
    div [ class divClass ]
      [ h1 [ class "font-bold text-xl" ] [ text club.name ]
      , clubCardElement "Localização" club.localization
      , clubCardElement "Fundação" club.createdAt
      , clubCardElement "Site" club.website
      , clubCardElement "Contato" club.contact
      , button [ class "btn btn-indigo-500 mt-4", onClick EditClub ] [ text "Editar" ]
      ]

viewClubCardEdit : Html Msg
viewClubCardEdit =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg space-y-4"
  in
    div [ class divClass ]
      [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
      , input [ type_ "text", placeholder "Nome", class "login-input", onInput InputName ] []
      , input [ type_ "text", placeholder "Localização", class "login-input", onInput InputLocalization ] []
      , input [ type_ "text", placeholder "Site", class "login-input", onInput InputWebsite ] []
      , input [ type_ "text", placeholder "Contato", class "login-input", onInput InputContact ] []
      , button [ class "border-none btn btn-green-500", onClick ConfirmEdit ] [ text "Confirmar" ]
      , button [ class "border-none btn btn-red-500", onClick CancelEdit ] [ text "Cancelar" ]
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

    ViewAnonymus club ->
      "Clube - " ++ club.name

    ViewOwner club ->
      "Clube - " ++ club.name

    Edit club _ ->
      "Clube - " ++ club.name

    New _ ->
      "Clube - Novo"

toSession : Model -> Session
toSession model =
  model.session
