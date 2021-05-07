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
  , club : Maybe Club
  }

type Msg
  = GotClubs (Result Api.ApiError Club)

init : Session -> Int -> (Model, Cmd Msg)
init session clubId =
  (Model session Nothing Nothing, get clubId)

get : Int -> Cmd Msg
get id =
  Http.get
  { url = Api.club id
  , expect = Api.expectJson GotClubs Club.clubDecoder
  }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotClubs result ->
      case result of
        Ok club ->
          ({ model | club = Just club, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

view : Model -> Browser.Document Msg
view model =
  let
    title = case model.club of
      Just club ->
        "Clube - " ++ club.name

      Nothing ->
        "Clube"
  in
  { title = title
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , case model.club of
      Just club ->
        viewClubCard club

      Nothing ->
        p [] [ text "Nada ainda" ]

    , viewOwner model.club

    , viewTournaments model.club

    , viewMembers model.club
    ]
  }

viewMembers : Maybe Club -> Html Msg
viewMembers maybeClub =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Membros" ]
    , div [ class "space-y-4" ]
      [ case maybeClub of
        Just _ ->
          p [] [ text "TODO" ]

        Nothing ->
          p [] [ text "Nada ainda" ]
      ]
    ]

viewTournaments : Maybe Club -> Html Msg
viewTournaments maybeClub =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Torneios" ]
    , div [ class "space-y-4" ]
      [ case maybeClub of
        Just _ ->
          p [] [ text "TODO" ]

        Nothing ->
          p [] [ text "Nada ainda" ]
      ]
    ]

viewOwner : Maybe Club -> Html Msg
viewOwner maybeClub =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Dono do Clube" ]
    , div [ class "space-y-4" ]
      [ case maybeClub of
        Just club ->
          UserShort.view club.owner

        Nothing ->
          p [] [ text "Nada ainda" ]
      ]
    ]

viewClubCard : Club -> Html Msg
viewClubCard club =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
    div [ class divClass ]
      [ h1 [] [ text club.name ]
      , clubCardElement "Localização" club.localization
      , clubCardElement "Fundação" club.createdAt
      , clubCardElement "Site" club.website
      , clubCardElement "Contato" club.contact
      ]

clubCardElement : String -> String -> Html msg
clubCardElement title value = 
  div [ class "block" ]
    [ strong [ class "inline-block font-bold" ] [ text title ]
    , span [ class "inline-block" ] [ text value ]
    ]

toSession : Model -> Session
toSession model =
  model.session
