module Page.Ruleset exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)

import Api
import CommonHtml exposing (..)
import Model.Ruleset exposing (Ruleset)
import Session exposing (Session)
import Http


type alias Model =
  { session : Session
  , error : Maybe String
  , state : State
  }

type State
  = Uninitialized
  | View Ruleset

type Msg
  = GotRuleset (Result Api.ApiError Ruleset)


init : Session -> Ruleset -> (Model, Cmd Msg)
init session ruleset =
  (Model session Nothing (View ruleset), Cmd.none)

initGet : Session -> Int -> Int -> (Model, Cmd Msg)
initGet session clubId rulesetId =
  (Model session Nothing Uninitialized, get clubId rulesetId)

get : Int -> Int -> Cmd Msg
get clubId rulesetId =
  Http.get
  { url = Api.clubRuleset clubId rulesetId
  , expect = Api.expectJson GotRuleset Model.Ruleset.decoder
  }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotRuleset result ->
      case result of
        Ok ruleset ->
          ({ model | state = (View ruleset) }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

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

    , case model.state of
      Uninitialized ->
        p [] [ text "Carregando..." ]

      View ruleset ->
        Model.Ruleset.view ruleset
    ]
  }

stateToTitle : State -> String
stateToTitle state =
  case state of
    Uninitialized ->
      "Ruleset"

    View ruleset ->
      "Ruleset - " ++ ruleset.name

toSession : Model -> Session
toSession model =
  model.session
