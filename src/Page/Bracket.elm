module Page.Bracket exposing (..)

import Browser
import Http
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Encode as Encode

import Api
import CommonHtml exposing (..)
import Model.Game as Game
import Model.Bracket as Bracket exposing (Bracket)
import Model.Series exposing (Series, GameForm)
import Session exposing (Session)
import Viewer exposing (Viewer)


type alias Model =
  { session : Session
  , error : Maybe String
  , state : State
  }

type State
  = Uninitialized
  | View ViewSwitch Bracket

type ViewSwitch
  = Anonymus
  | Owner

type alias Form =
  { logLink : String
  , player1Seat : String
  , player2Seat : String
  , player3Seat : String
  , player4Seat : String
  }

type Msg
  = GotBracket (Result Api.ApiError Bracket)
  | ToggleFold Series
  | AddGame Series
  | PostGame Series
  | CancelAddGame Series
  | InputPlayer1Seat Series String
  | InputPlayer2Seat Series String
  | InputPlayer3Seat Series String
  | InputPlayer4Seat Series String
  | InputLogLink Series String

init : Session -> Int -> Int -> (Model, Cmd Msg)
init session tournamentId bracketId =
  (Model session Nothing Uninitialized, get tournamentId bracketId)

get : Int -> Int -> Cmd Msg
get tournamentId bracketId =
  Http.get
    { url = Api.tournamentBracket tournamentId bracketId
    , expect = Api.expectJson GotBracket Bracket.decoder
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    unwrapResult result act =
      case result of
        Ok val ->
          act val

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)
  in
  case (msg, model.state) of
    (GotBracket result, _) ->
      unwrapResult result <| \bracket ->
        let
          switch =
            case Session.toViewer model.session of
              Just viewer -> if bracket.ownerId == viewer.id then Owner else Anonymus
              Nothing -> Anonymus

          series = List.sortBy .id bracket.series
        in
        ({ model | state = View switch { bracket | series = series }, error = Nothing }, Cmd.none)

    (_, Uninitialized) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

    (ToggleFold series, View switch bracket) ->
      ({ model | state = View switch (toggleSeries bracket series) }, Cmd.none)

    (AddGame series, View switch bracket) ->
      ({ model | state = View switch (addGameForm bracket series) }, Cmd.none)

    (PostGame series, View _ bracket) ->
      case series.gameForm of
        Just form ->
          case validateGameForm form of
            Ok _ ->
              case Session.toViewer model.session of
                Just viewer ->
                  (model, requestPostGame viewer bracket series form)

                Nothing ->
                  ({ model | error = Just "De alguma forma, você não está logado" }, Cmd.none)

            Err error ->
              ({ model | error = Just error}, Cmd.none)

        Nothing ->
          ({ model | error = Just ("Série " ++ (String.fromInt series.id) ++ " não está em modo de edição") }, Cmd.none)

    (CancelAddGame series, View switch bracket) ->
      ({ model | state = View switch (removeGameForm bracket series) }, Cmd.none)

    (InputPlayer1Seat series seat, View switch bracket) ->
      let
        (b, error) = updateSeriesForm bracket series (\s -> { s | player1Seat = seat })
      in
      ({ model | state = View switch b, error = error }, Cmd.none)

    (InputPlayer2Seat series seat, View switch bracket) ->
      let
        (b, error) = updateSeriesForm bracket series (\s -> { s | player2Seat = seat })
      in
      ({ model | state = View switch b, error = error }, Cmd.none)

    (InputPlayer3Seat series seat, View switch bracket) ->
      let
        (b, error) = updateSeriesForm bracket series (\s -> { s | player3Seat = seat })
      in
      ({ model | state = View switch b, error = error }, Cmd.none)

    (InputPlayer4Seat series seat, View switch bracket) ->
      let
        (b, error) = updateSeriesForm bracket series (\s -> { s | player4Seat = seat })
      in
      ({ model | state = View switch b, error = error }, Cmd.none)

    (InputLogLink series logLink, View switch bracket) ->
      let
        (b, error) = updateSeriesForm bracket series (\s -> { s | logLink = logLink })
      in
      ({ model | state = View switch b, error = error }, Cmd.none)

toggleSeries : Bracket -> Series -> Bracket
toggleSeries bracket s =
  { bracket | series =
    bracket.series
    |> List.filter (\i -> i.id /= s.id)
    |> List.append [ { s | isFolded = not s.isFolded } ]
    |> List.sortBy .id
  }

addGameForm : Bracket -> Series -> Bracket
addGameForm bracket series =
  { bracket | series =
    bracket.series
    |> List.filter (\s -> s.id /= series.id)
    |> List.append [ { series | gameForm = Just (GameForm "" "" "" "" "") } ]
    |> List.sortBy .id
  }

removeGameForm : Bracket -> Series -> Bracket
removeGameForm bracket series =
  { bracket | series =
    bracket.series
    |> List.filter (\s -> s.id /= series.id)
    |> List.append [ { series | gameForm = Nothing } ]
    |> List.sortBy .id
  }

updateSeriesForm : Bracket -> Series -> (GameForm -> GameForm) -> (Bracket, Maybe String)
updateSeriesForm bracket series transform =
  case series.gameForm of
    Just form ->
      ( { bracket | series =
          bracket.series
            |> List.filter (\s -> s.id /= series.id)
            |> List.append [ { series | gameForm = Just (transform form) } ]
            |> List.sortBy .id
        }
      , Nothing
      )

    Nothing ->
      ( bracket
      , Just
        ( "Tentativa de atualizar um form inexistente, série " ++
          (String.fromInt series.id)
        )
      )

validateGameForm : GameForm -> Result String ()
validateGameForm form =
  let
    seats = [ "East", "South", "West", "North" ]
    formSeats = [ form.player1Seat, form.player2Seat, form.player3Seat, form.player4Seat ]

  in if String.isEmpty form.logLink then
    Err "Preencha o link para o log do jogo"

  else if List.member form.player1Seat seats then
    Err "Preencha o acento do jogador 1"

  else if List.member form.player2Seat seats then
    Err "Preencha o acento do jogador 2"

  else if List.member form.player3Seat seats then
    Err "Preencha o acento do jogador 3"

  else if List.member form.player4Seat seats then
    Err "Preencha o acento do jogador 4"

  else if List.member "East" formSeats then
    Err "Um jogador precisa ser o acento leste"

  else if List.member "South" formSeats then
    Err "Um jogador precisa ser o acento sul"

  else if List.member "West" formSeats then
    Err "Um jogador precisa ser o acento oeste"

  else if List.member "North" formSeats then
    Err "Um jogador precisa ser o acento norte"

  else
    Ok ()

requestPostGame : Viewer -> Bracket -> Series -> GameForm -> Cmd Msg
requestPostGame viewer bracket series form =
  Api.privatePost
    { url = Api.series bracket.tournamentId bracket.id series.id
    , expect = Api.expectJson GotBracket Bracket.decoder
    , body = Http.jsonBody (gameFormEncoder form)
    } viewer

gameFormEncoder : GameForm -> Encode.Value
gameFormEncoder form =
  Encode.object
    [ ("logLink", Encode.string form.logLink)
    , ("player1Seat", Encode.string form.player1Seat)
    , ("player2Seat", Encode.string form.player2Seat)
    , ("player3Seat", Encode.string form.player3Seat)
    , ("player4Seat", Encode.string form.player4Seat)
    ]

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

    , viewBracket model
    ]
  }

viewBracket : Model -> Html Msg
viewBracket model =
  case model.state of
    Uninitialized ->
      p [] [ text "Carregando..." ]

    View switch bracket ->
      div []
        [ viewBracketCard bracket
        , viewSeries bracket switch
        ]

viewBracketCard : Bracket -> Html Msg
viewBracketCard bracket =
  let
    cardElement title value =
      if String.isEmpty value then
        text ""
      else
        div [ class "block" ]
          [ strong [ class "inline-block font-bold" ] [ text title ]
          , span [ class "inline-block" ] [ text value ]
          ]
  in
  div [ class "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg" ]
    [ h1 [ class "font-bold text-xl" ] [ text bracket.name ]
    , p [] [ text bracket.description]
    , cardElement "Data de Início" bracket.startedAt
    , cardElement "Data de Término" bracket.finishedAt
    ]

-- viewSeries : Bracket -> ViewSwitch -> Html Msg
-- viewSeries bracket switch =
--   -- let
--   --   addGameMsg = if switch == Owner then Just AddGame else Nothing
--   -- in
--   div [ class "m-2" ]
--     [ h1 [ class "list-heading" ] [ text "Séries" ]
--     , div [ class "space-y-4" ]
--       (List.map (Series.view ToggleFold) bracket.series)
--     ]

-- viewSeriesForm series =
--   case series.gameForm of
--     Nothing ->
--       if series.status /= "Encerrada" then
--         button [ class "border-transparent btn btn-indigo-500 mt-4", onClick AddGame ]
--           [ text "Adicionar Jogo"
--           ]
--       else
--         text ""

--     Just _ ->
--       let
--         selectSeat =
--           select [ placeholder "Acento", class "flex-1 border-none rounded-sm bg-gray-100 text-gray-400" ]
--             [ option [ value "East" ] [ text "東" ]
--             , option [ value "South" ] [ text "南" ]
--             , option [ value "West" ] [ text "西" ]
--             , option [ value "North" ] [ text "北" ]
--             ]
--       in
--       div [ class "space-y-2" ]
--         [ div [ class "list-item" ]
--           [ p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
--           , p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
--           , selectSeat
--           , selectSeat
--           , selectSeat
--           , selectSeat
--           , input [ type_ "text", placeholder "Log Link", class "flex-1 w-36 border-none rounded-sm bg-gray-100 text-gray-400 placeholder-gray-400" ] []
--           ]
--         ]

viewSeries : Bracket -> ViewSwitch -> Html Msg
viewSeries bracket switch =
  -- let
  --   addGameMsg = if switch == Owner then Just AddGame else Nothing
  -- in
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Séries" ]
    , div [ class "space-y-4" ]
      (List.map (viewSingleSeries switch) bracket.series)
    ]

viewSingleSeries : ViewSwitch -> Series -> Html Msg
viewSingleSeries switch series =
  let
    visibleHeadingClass = "flex-1 font-bold text-right invisible"
    invisibleHeadingClass = "flex-1 font-bold text-right"
    heading = div [ class "flex px-5" ]
      [ p [ class invisibleHeadingClass ] [ text "batata" ]
      , p [ class invisibleHeadingClass ] [ text "batata" ]
      , p [ class visibleHeadingClass ] [ text series.player1Name ]
      , p [ class visibleHeadingClass ] [ text series.player2Name ]
      , p [ class visibleHeadingClass ] [ text series.player3Name ]
      , p [ class visibleHeadingClass ] [ text series.player4Name ]
      , p [ class invisibleHeadingClass ] [ text "batata" ]
      ]

    header = div [ class "list-item" ]
      [ button [ class "inline-btn btn-indigo-500 px-2", onClick (ToggleFold series) ]
        [ if series.isFolded then
            text ">"
          else
            text "v"
        ]
      , p [] [ text (String.concat
        [ series.player1Name, " vs "
        , series.player2Name, " vs "
        , series.player3Name, " vs "
        , series.player4Name
        ])]
      , span []
        [ text
          ( series.playedAt ++
              if String.isEmpty (String.trim series.finishedAt) then
                " - " ++ series.finishedAt
              else
                ""
          )
        ]
      ]

    seriesHtml =
      ( header ::
          if series.isFolded then
            []
          else
            heading :: (List.map Game.view series.games)
      )

    formHtml =
      if switch == Owner then
        case series.gameForm of
          Nothing ->
            if series.status /= "Encerrada" then
              [ button [ class "border-transparent btn btn-indigo-500 mt-4", onClick (AddGame series) ]
                [ text "Adicionar Jogo"
                ]
              ]
            else
              []

          Just _ ->
            let
              selectSeat onInputMsg =
                select [ placeholder "Acento", class "flex-1 border-none rounded-sm bg-gray-100 text-gray-400", onInput onInputMsg ]
                  [ option [ value "East" ] [ text "東" ]
                  , option [ value "South" ] [ text "南" ]
                  , option [ value "West" ] [ text "西" ]
                  , option [ value "North" ] [ text "北" ]
                  ]
            in
              [ div [ class "space-y-2" ]
                [ div [ class "list-item" ]
                  [ p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
                  , p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
                  , selectSeat (InputPlayer1Seat series)
                  , selectSeat (InputPlayer2Seat series)
                  , selectSeat (InputPlayer3Seat series)
                  , selectSeat (InputPlayer4Seat series)
                  , input [ type_ "text", placeholder "Log Link", class "flex-1 w-36 border-none rounded-sm bg-gray-100 text-gray-400 placeholder-gray-400", onInput (InputLogLink series) ] []
                  ]
                ]
              , div []
                [ button [ class "border-none btn btn-green-500", onClick (PostGame series) ] [ text "Confirmar" ]
                , button [ class "border-none btn btn-red-500", onClick (CancelAddGame series) ] [ text "Cancelar" ]
                ]
              ]
      else
        []
  in
  div [ class "m-2" ]
    [ div [ class "container space-y-2 w-2/4" ]
      (List.append seriesHtml formHtml)
    ]

stateToTitle : State -> String
stateToTitle state =
  case state of
    Uninitialized ->
      "Chave"

    View _ bracket ->
      "Chave - " ++ bracket.name

toSession : Model -> Session
toSession model = model.session
