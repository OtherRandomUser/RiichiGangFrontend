module Page.Tournament exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http

import Api
import CommonHtml exposing (..)
import Model.Tournament as Tournament exposing (Tournament)
import Session exposing (Session)
import Session exposing (Session(..))
import List.Extra
import CommonHtml exposing (viewNav)
import CommonHtml exposing (errorCard)
import Model.Ruleset
import Model.TournamentPlayer exposing (TournamentPlayer)
import Viewer exposing (Viewer)
import Model.BracketShort as BracketShort
import Api exposing (tournament)


type alias Model =
  { session : Session
  , error : Maybe String
  , state : State
  }

type State
  = Uninitialized
  | View ViewSwitch Tournament
  -- TODO | Edit Tournament Form
  -- TODO | New Form

type ViewSwitch
  = Anonymus
  | Owner
  | Participant
  | NonParticipant

type Msg
  = GotTournament (Result Api.ApiError Tournament)
  | RemovePlayer TournamentPlayer

init : Session -> Int -> (Model, Cmd Msg)
init session tournamentId =
  (Model session Nothing Uninitialized, get tournamentId)

get : Int -> Cmd Msg
get id =
  Http.get
    { url = Api.tournament id
    , expect = Api.expectJson GotTournament Tournament.decoder
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
    (GotTournament result, _) ->
      case result of
        Ok tournament ->
          ({ model | state = initState tournament model.session, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (RemovePlayer player, View _ tournament) ->
      makeRequest (\viewer -> requestRemovePlayer viewer tournament player)

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

initState : Tournament -> Session -> State
initState tournament session =
  case Session.toViewer session of
    Just viewer ->
      let
        isParticipant = \p -> p.userId == viewer.id
      in
      if tournament.ownerId == viewer.id then
        View Owner tournament
      else case List.Extra.find isParticipant tournament.players of
        Just _ ->
          View Participant tournament

        Nothing ->
          View NonParticipant tournament

    Nothing ->
      View NonParticipant tournament

requestRemovePlayer : Viewer -> Tournament -> TournamentPlayer -> Cmd Msg
requestRemovePlayer viewer tournament player =
  Api.privateDelete
    { url = Api.tournamentPlayer tournament.id player.userId
    , expect = Api.expectJson GotTournament Tournament.decoder
    } viewer



view : Model -> Browser.Document Msg
view model =
  { title = stateToTitle model
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error

      Nothing ->
        text ""

    , viewTournament model
    ]
  }

viewTournament : Model -> Html Msg
viewTournament model =
  case model.state of
    Uninitialized ->
      p [] [ text "Carregando..." ]

    View switch tournament ->
      div []
        [ viewTournamentCard tournament switch
        , viewPlayers tournament (switch == Owner)
        , viewBrackets tournament
        ]

viewTournamentCard : Tournament -> ViewSwitch -> Html Msg
viewTournamentCard tournament switch =
  div [ class "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg" ]
    [ h1 [ class "font-bold text-xl" ] [ text tournament.name ]
    , p [] [ text tournament.description ]
    , cardElement "Data de Inicio" tournament.startDate

    , if tournament.allowNonMembers then
        cardElement "" "Qualquer usuário poderá participar"
      else
        cardElement "" "Somente membros do clube poderão participar"

    , if tournament.requirePermission then
        cardElement "" "Será necessária a confirmação pelo dono do clube para a participação no torneio"
      else
        text ""

    , a [ href (Model.Ruleset.getUrl tournament.clubId tournament.ruleset), class "hover:underline" ] [ text "Regras" ]

    , cardElement "Status" tournament.status

    , if tournament.playerStatus /= "" then
        cardElement "Status do Jogador" tournament.playerStatus
      else
        text ""
    ]

viewPlayers : Tournament -> Bool -> Html Msg
viewPlayers tournament isOwner =
  if tournament.status /= "Agendado" then
    text ""
  else
    let
      transform = \p -> Model.TournamentPlayer.view p isOwner (RemovePlayer p)
    in
    div [ class "m-2" ]
      [ h1 [ class "list-heading" ] [ text "Jogadores" ]
      , div [ class "space-y-4" ] (List.map transform tournament.players)
      ]

viewBrackets : Tournament -> Html Msg
viewBrackets tournament =
  div [ class "space-y-4" ]
    (List.map BracketShort.view tournament.brackets)


stateToTitle : Model -> String
stateToTitle model =
  case model.state of
    Uninitialized ->
      "Tournament"

    View _ tournament ->
      "Tournament - " ++ tournament.name

toSession : Model -> Session
toSession model =
  model.session
