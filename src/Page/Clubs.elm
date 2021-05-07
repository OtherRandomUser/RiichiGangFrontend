module Page.Clubs exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http

import Api
import ClubShort exposing (ClubShort)
import CommonHtml
import Session exposing (Session)
import Api exposing (clubs)


-- Data Modeling --

type alias Model =
  { session : Session
  , error : Maybe String
  , clubs : List ClubShort
  }

type Msg
  = GotClubs (Result Api.ApiError (List ClubShort))

init : Session -> (Model, Cmd Msg)
init session =
  (Model session Nothing [], get)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotClubs result ->
      case result of
        Ok clubs ->
          ({ model | clubs = clubs, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

get : Cmd Msg
get =
  Http.get
  { url = Api.clubs
  , expect = Api.expectJson GotClubs ClubShort.clubShortListDecoder
  }

view : Model -> Browser.Document Msg
view model =
  { title = "Clubes"
  , body =
    [ CommonHtml.viewNav model.session

    , case model.error of
      Just error ->
        CommonHtml.errorCard error
      Nothing ->
        text ""

    , div [ class "m-2" ]
      [ h1 [ class "list-heading" ] [ text "Clubes do Usuário" ]
      , if List.isEmpty model.clubs then
          p [] [ text "Nada ainda" ]
        else
          div [ class "space-y-4" ] (List.map ClubShort.view model.clubs)
      ]

    ]
  }

toSession : Model -> Session
toSession model =
  model.session
