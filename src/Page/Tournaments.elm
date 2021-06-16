module Page.Tournaments exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http

import Api
import CommonHtml
import Model.TournamentShort as TournamentShort exposing (TournamentShort)
import Session exposing (Session)


type alias Model =
  { session : Session
  , error : Maybe String
  , tournaments : List TournamentShort
  }

type Msg
  = GotTournaments (Result Api.ApiError (List TournamentShort))


init : Session -> (Model, Cmd Msg)
init session =
  (Model session Nothing [], get)

get : Cmd Msg
get =
  Http.get
    { url = Api.tournaments
    , expect = Api.expectJson GotTournaments TournamentShort.listDecoder
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotTournaments result ->
      case result of
        Ok tournaments ->
          ({ model | tournaments = tournaments, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

view : Model -> Browser.Document Msg
view model =
  { title = "Torneios"
  , body =
    [ CommonHtml.viewNav model.session

    , case model.error of
        Just error ->
          CommonHtml.errorCard error

        Nothing ->
          text ""

    , div [ class "m-2" ]
      [ h1 [ class "list-heading" ] [ text "Torneios" ]
      , if List.isEmpty model.tournaments then
          p [] [ text "Nada ainda" ]
        else
          div [ class "space-y-4" ] (List.map TournamentShort.view model.tournaments)
      ]
    ]
  }

toSession : Model -> Session
toSession model =
  model.session
