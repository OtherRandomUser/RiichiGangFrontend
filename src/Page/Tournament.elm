module Page.Tournament exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Encode as Encode
import Url.Builder

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
import Model.Ruleset exposing (Ruleset)


type alias Model =
  { session : Session
  , error : Maybe String
  , state : State
  }

type State
  = Uninitialized
  | View ViewSwitch Tournament
  | Edit Tournament Form
  -- TODO | New Form

type ViewSwitch
  = Anonymus
  | Owner
  | Participant
  | NonParticipant

type alias Form =
  { ruleset : Ruleset
  , name : String
  , description : String
  , startDate : String
  , allowNonMembers : Bool
  , requirePermission : Bool
  , brackets : List BracketForm
  }

type alias BracketForm =
  { sequence : Int
  , name : String
  , winCondition : String
  , numberOfAdvancing : Int
  , numberOfSeries : Int
  , gamesPerSeries : Int
  , finalScoreMultiplier : Float
  }

type Msg
  = GotTournament (Result Api.ApiError Tournament)
  | GotDelete (Result Api.ApiError ())
  | RemovePlayer TournamentPlayer
  | JoinTournament
  | LeaveTournament
  | InitTournament
  | EditTournament
  | ConfirmEdit
  | CancelEdit
  | DeleteTournament
  | InputName String
  | InputDescription String
  | InputStartDate String
  | InputAllow Bool
  | InputPermission Bool
  | AddBracket
  | RemoveBracket Int
  | InputBracketName Int String
  | InputBracketWinCon Int String
  | InputBracketNAdv Int String
  | InputBracketNSeries Int String
  | InputBracketNGames Int String
  | InputBracketMul Int String

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

    (GotDelete result, View Owner _) ->
      case result of
        Ok _ ->
          (model, Nav.pushUrl (Session.navKey model.session) (Url.Builder.absolute [] []))

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (RemovePlayer player, View _ tournament) ->
      makeRequest (\viewer -> requestRemovePlayer viewer tournament player)

    (JoinTournament, View NonParticipant tournament) ->
      makeRequest (\viewer -> requestJoin viewer tournament)

    (LeaveTournament, View Participant tournament) ->
      makeRequest (\viewer -> requestLeave viewer tournament)

    (InitTournament, View Owner tournament) ->
      makeRequest (\viewer -> requestInit viewer tournament)

    (EditTournament, View Owner tournament) ->
      ({ model | state = Edit tournament (initForm tournament) }, Cmd.none)

    (ConfirmEdit, Edit tournament form) ->
      makeRequest (\viewer -> requestPatch viewer tournament form)

    (CancelEdit, Edit tournament _) ->
      ({ model | state = View Owner tournament, error = Nothing }, Cmd.none)

    (DeleteTournament, View Owner tournament) ->
      makeRequest (\viewer -> requestDelete viewer tournament)

    (InputName name, Edit tournament form) ->
      updateEditForm (\f -> { f | name = name }) tournament form model

    (InputDescription description, Edit tournament form) ->
      updateEditForm (\f -> { f | description = description }) tournament form model

    (InputStartDate startDate, Edit tournament form) ->
      updateEditForm (\f -> { f | startDate = startDate }) tournament form model

    (InputAllow allow, Edit tournament form) ->
      updateEditForm (\f -> { f | allowNonMembers = allow }) tournament form model

    (InputPermission permission, Edit tournament form) ->
      updateEditForm (\f -> { f | requirePermission = permission }) tournament form model

    (AddBracket, Edit tournament form) ->
      updateEditForm (\f -> { f | brackets = addBracket f.brackets }) tournament form model

    (RemoveBracket seq, Edit tournament form) ->
      updateEditForm (\f -> { f | brackets = removeBracket seq f.brackets }) tournament form model

    (InputBracketName seq name, Edit tournament form) ->
      updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | name = name }) f.brackets seq }) tournament form model

    (InputBracketWinCon seq winCon, Edit tournament form) ->
      updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | winCondition = winCon }) f.brackets seq }) tournament form model

    (InputBracketNAdv seq nadv, Edit tournament form) ->
      case String.toInt nadv of
        Just i ->
          updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | numberOfAdvancing = i }) f.brackets seq }) tournament form model

        Nothing ->
          ({ model | error = Just "Falha na conversão de number of advancing players para inteiro" }, Cmd.none)

    (InputBracketNSeries seq nseries, Edit tournament form) ->
      case String.toInt nseries of
        Just i ->
          updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | numberOfSeries = i }) f.brackets seq }) tournament form model

        Nothing ->
          ({ model | error = Just "Falha na conversão de número de séries para inteiro" }, Cmd.none)

    (InputBracketNGames seq ngames, Edit tournament form) ->
      case String.toInt ngames of
        Just i ->
          updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | gamesPerSeries = i }) f.brackets seq }) tournament form model

        Nothing ->
          ({ model | error = Just "Falha na conversão de número de séries para inteiro" }, Cmd.none)

    (InputBracketMul seq mul, Edit tournament form) ->
      case String.toFloat mul of
        Just fl ->
          updateEditForm (\f -> { f | brackets = updateBracket (\b -> { b | finalScoreMultiplier = fl }) f.brackets seq }) tournament form model

        Nothing ->
          ({ model | error = Just "Falha na conversão de número de séries para inteiro" }, Cmd.none)

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

-- updateNewForm : (Form -> Form) -> 
-- updateNewForm transform form model =
--   ({ model | state = New (transform form) }, Cmd.none)

updateEditForm : (Form -> Form) -> Tournament -> Form -> Model -> (Model, Cmd msg)
updateEditForm transform tournament form model =
  ({ model | state = Edit tournament (transform form), error = Nothing }, Cmd.none)

updateBracket : (BracketForm -> BracketForm) -> List BracketForm -> Int -> List BracketForm
updateBracket transform brackets seq =
  case List.Extra.find (\b -> b.sequence == seq) brackets of
    Nothing ->
      brackets

    Just bracket ->
      let
        rem = List.filter (\b -> b.sequence /= seq) brackets
      in
      List.sortBy (\b -> b.sequence)
        <| (transform bracket) :: rem

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

initForm : Tournament -> Form
initForm tournament =
  let
    mapBracket = \b -> BracketForm
      b.sequence
      b.name
      b.winCondition
      b.numberOfAdvancing
      b.numberOfSeries
      b.gamesPerSeries
      b.finalScoreMultiplier
  in
  Form tournament.ruleset "" "" "" tournament.allowNonMembers tournament.requirePermission
    <| List.map mapBracket tournament.brackets

addBracket : List BracketForm -> List BracketForm
addBracket brackets =
  let
    nextSeq = case List.maximum (List.map (\b -> b.sequence) brackets) of
      Just seq ->
        seq + 10

      Nothing ->
        0
  in
    brackets ++
      [ BracketForm nextSeq "" "None" 0 1 1 0
      ]

removeBracket : Int -> List BracketForm -> List BracketForm
removeBracket seq brackets =
  List.sortBy (\b -> b.sequence)
    <| List.filter (\b -> b.sequence /= seq) brackets

requestRemovePlayer : Viewer -> Tournament -> TournamentPlayer -> Cmd Msg
requestRemovePlayer viewer tournament player =
  Api.privateDelete
    { url = Api.tournamentPlayer tournament.id player.userId
    , expect = Api.expectJson GotTournament Tournament.decoder
    } viewer

requestJoin : Viewer -> Tournament -> Cmd Msg
requestJoin viewer tournament =
  Api.privatePost
    { url = Api.joinTournament tournament.id
    , expect = Api.expectJson GotTournament Tournament.decoder
    , body = Http.emptyBody
    } viewer

requestLeave : Viewer -> Tournament -> Cmd Msg
requestLeave viewer tournament =
  Api.privateDelete
    { url = Api.tournamentPlayers tournament.id
    , expect = Api.expectJson GotTournament Tournament.decoder
    } viewer

requestInit : Viewer -> Tournament -> Cmd Msg
requestInit viewer tournament =
  Api.privatePost
    { url = Api.tournamentInit tournament.id
    , expect = Api.expectJson GotTournament Tournament.decoder
    , body = Http.emptyBody
    } viewer

requestDelete : Viewer -> Tournament -> Cmd Msg
requestDelete viewer tournament =
  Api.privateDelete
    { url = Api.tournament tournament.id
    , expect = Api.expectWhatever GotDelete
    } viewer

requestPatch : Viewer -> Tournament -> Form -> Cmd Msg
requestPatch viewer tournament form =
  Api.privatePut
    { url = Api.tournament tournament.id
    , expect = Api.expectJson GotTournament Tournament.decoder
    , body = Http.jsonBody (patchEncoder form)
    } viewer

patchEncoder : Form -> Encode.Value
patchEncoder form =
  let
    maybeNull val = if String.isEmpty val then Encode.null else Encode.string val
  in
  Encode.object
    [ ("rulesetId", Encode.int form.ruleset.id)
    , ("name", maybeNull form.name)
    , ("description", maybeNull form.description)
    , ("startDate", maybeNull form.startDate)
    , ("allowNonMembers", Encode.bool form.allowNonMembers)
    , ("RequirePermission", Encode.bool form.requirePermission)
    , ("brackets", Encode.list bracketEncoder form.brackets)
    ]

bracketEncoder : BracketForm -> Encode.Value
bracketEncoder form =
  Encode.object
    [ ("sequence", Encode.int form.sequence)
    , ("name", Encode.string form.name)
    , ("winCondition", Encode.string form.winCondition)
    , ("numberOfAdvancing", Encode.int form.numberOfAdvancing)
    , ("numberOfSeries", Encode.int form.numberOfSeries)
    , ("gamesPerSeries", Encode.int form.gamesPerSeries)
    , ("finalScoreMultiplier", Encode.float form.finalScoreMultiplier)
    ]


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

    Edit _ form ->
      div []
        [ viewTournamentEditCard
        , viewBracketsEdit form
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

    , if tournament.status /= "Agendado" then
        text ""
      else case switch of
        Anonymus ->
          text ""

        Owner ->
          div []
            [ button [ class "btn btn-indigo-500 mt-4", onClick EditTournament ] [ text "Editar" ]
            , button [ class "border-none btn btn-green-500 mt-4", onClick InitTournament ] [ text "Iniciar" ]
            , button [ class "border-none btn btn-red-500 mt-4", onClick DeleteTournament ] [ text "Excluir" ]
            -- TODO join/leave
            ]

        Participant ->
          button [ class "border-none btn btn-red-500 mt-4", onClick LeaveTournament ]
            [ text "Sair"
            ]

        NonParticipant ->
          button [ class "btn btn-indigo-500 mt-4", onClick JoinTournament ]
            [ text "Participar"
            ]
    ]

viewTournamentEditCard : Html Msg
viewTournamentEditCard =
  div [ class "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg" ]
    [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
    , input [ type_ "text", placeholder "Nome", class "login-input", onInput InputName ] []
    , input [ type_ "text", placeholder "Descrição", class "login-input", onInput InputDescription ] []
    , input [ type_ "date", placeholder "Data de Início", class "login-input", onInput InputStartDate ] []
    , input [ type_ "checkbox", onCheck InputAllow ] []
    , label [] [ text "Permitir a participação de não integrantes do clube?" ]
    , br [] []
    , input [ type_ "checkbox", onCheck InputPermission ] []
    , label [] [ text "Exigir permissão para participar?" ]
    , button [ class "border-none btn btn-green-500", onClick ConfirmEdit ] [ text "Confirmar" ]
    , button [ class "border-none btn btn-red-500", onClick CancelEdit ] [ text "Cancelar" ]
    ]

viewBracketsEdit : Form -> Html Msg
viewBracketsEdit form =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Chaves" ]
    , div [ class "flex space-x-4 px-5" ]
      [ p [ class "font-bold w-1/12" ] [ text "Nome" ]
      , p [ class "font-bold w-2/12" ] [ text "Condição de Vitória" ]
      , p [ class "font-bold w-2/12" ] [ text "Número de Jogadores a Avançar" ]
      , p [ class "font-bold w-2/12" ] [ text "Número de Séries" ]
      , p [ class "font-bold w-2/12" ] [ text "Número de Jogos por Série" ]
      , p [ class "font-bold w-2/12" ] [ text "Multiplicador de Pontuação" ]
      ]
    , div [ class "space-y-4" ] (List.map viewBracketEdit form.brackets)
    , button [ class "border-transparent btn btn-indigo-500 mt-4", onClick AddBracket ] [ text "Nova Chave" ]
    ]

viewBracketEdit : BracketForm -> Html Msg
viewBracketEdit form =
  div [ class "list-item" ]
    [ input [ type_ "text", placeholder "Nome", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-1/12", onInput (InputBracketName form.sequence) ] []
    , select [ placeholder "Condição de vitória", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 w-2/12", onInput (InputBracketWinCon form.sequence) ]
      [ option [ value "First" ] [ text "Primeiro de cada Série" ]
      , option [ value "FirstAndSecond" ] [ text "Primeiro e Segundo de cada Série" ]
      , option [ value "TopX" ] [ text "Top X Jogadores" ]
      , option [ value "None" ] [ text "Chave Final" ]
      ]
    , input [ type_ "number", placeholder "Número de Jogadores a Avançar", Html.Attributes.min "4", step "4", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12", onInput (InputBracketNAdv form.sequence) ] []
    , input [ type_ "number", placeholder "Número de Séries", Html.Attributes.min "1", step "1", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12", onInput (InputBracketNSeries form.sequence) ] []
    , input [ type_ "number", placeholder "Número de Jogos por Série", Html.Attributes.min "1", step "1", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12", onInput (InputBracketNGames form.sequence) ] []
    , input [ type_ "number", placeholder "Multiplicador de Pontuação", Html.Attributes.min "0", step "0.1", class "border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12", onInput (InputBracketMul form.sequence) ] []
    , button [ class "border px-3 inline-btn btn-indigo-500", onClick (RemoveBracket form.sequence) ] [ text "X" ]
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

    Edit tournament _ ->
      "Tournament - " ++ tournament.name

toSession : Model -> Session
toSession model =
  model.session
