module Page.Club exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Http

import Api
import Club exposing (Club)
import CommonHtml exposing (..)
import Session exposing (Session)
import UserShort


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
  case msg of
    GotClub result ->
      case result of
        Ok club ->
          ({ model | state = initState club model.session, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

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
        , button [ class "border-none btn btn-red-500" ] [ text "Excluir" ]
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
      , button [ class "btn btn-indigo-500 mt-4" ] [ text "Editar" ]
      ]

viewClubCardEdit : Html Msg
viewClubCardEdit =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg space-y-4"
  in
    div [ class divClass ]
      [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
      , input [ type_ "text", placeholder "Localização", class "login-input" ] []
      , input [ type_ "text", placeholder "Fundação", class "login-input" ] []
      , input [ type_ "text", placeholder "Site", class "login-input" ] []
      , input [ type_ "text", placeholder "Contato", class "login-input" ] []
      , button [ class "border-none btn btn-green-500" ] [ text "Confirmar" ]
      , button [ class "border-none btn btn-red-500" ] [ text "Cancelar" ]
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
