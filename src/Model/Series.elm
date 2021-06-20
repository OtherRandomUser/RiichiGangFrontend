module Model.Series exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.Game as Game exposing (Game)


type alias Series =
  { id : Int
  , player1Name : String
  , player2Name : String
  , player3Name : String
  , player4Name : String
  , playedAt : String
  , finishedAt : String
  , status : String
  , games : List Game
  , isFolded : Bool
  , gameForm : Maybe GameForm
  }

type alias GameForm =
  { logLink : String
  , player1Seat : String
  , player2Seat : String
  , player3Seat : String
  , player4Seat : String
  }


decoder : Decode.Decoder Series
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "player1Name" Decode.string <| \player1Name ->
  Field.require "player2Name" Decode.string <| \player2Name ->
  Field.require "player3Name" Decode.string <| \player3Name ->
  Field.require "player4Name" Decode.string <| \player4Name ->
  Field.require "playedAt" Decode.string <| \playedAt ->
  Field.require "finishedAt" Decode.string <| \finishedAt ->
  Field.require "status" Decode.string <| \status ->
  Field.require "games" (Decode.list Game.decoder) <| \games ->

  Decode.succeed
    { id = id
    , player1Name = player1Name
    , player2Name = player2Name
    , player3Name = player3Name
    , player4Name = player4Name
    , playedAt = playedAt
    , finishedAt = finishedAt
    , status = status
    , games = games
    , isFolded = True
    , gameForm = Nothing
    }

-- view : Maybe msg -> msg -> Series -> Html msg
-- view addGame toggleFold series =
--   let
--     visibleHeadingClass = "flex-1 font-bold text-right invisible"
--     invisibleHeadingClass = "flex-1 font-bold text-right"
--     heading = div [ class "flex px-5" ]
--       [ p [ class invisibleHeadingClass ] [ text "batata" ]
--       , p [ class invisibleHeadingClass ] [ text "batata" ]
--       , p [ class visibleHeadingClass ] [ text series.player1Name ]
--       , p [ class visibleHeadingClass ] [ text series.player2Name ]
--       , p [ class visibleHeadingClass ] [ text series.player3Name ]
--       , p [ class visibleHeadingClass ] [ text series.player4Name ]
--       , p [ class invisibleHeadingClass ] [ text "batata" ]
--       ]

--     header = div [ class "list-item" ]
--       [ button [ class "inline-btn btn-indigo-500 px-2", onClick toggleFold ]
--         [ if series.isFolded then
--             text ">"
--           else
--             text "V"
--         ]
--       , p [] [ text (String.concat
--         [ series.player1Name, " vs "
--         , series.player2Name, " vs "
--         , series.player3Name, " vs "
--         , series.player4Name
--         ])]
--       , span []
--         [ text
--           ( series.playedAt ++
--               if String.isEmpty (String.trim series.finishedAt) then
--                 " - " ++ series.finishedAt
--               else
--                 ""
--           )
--         ]
--       ]
--   in
--   div [ class "m-2" ]
--     [ div [ class "container space-y-2 w-2/4" ]
--       ( header ::
--           if series.isFolded then
--             []
--           else
--             heading :: (List.map Game.view series.games)
--       )
--     , case series.gameForm of
--       Nothing ->
--         case addGame of
--           Just addGameMsg ->
--             if series.status /= "Encerrada" then
--               button [ class "border-transparent btn btn-indigo-500 mt-4", onClick addGameMsg ]
--                 [ text "Adicionar Jogo"
--                 ]
--             else
--               text ""

--           Nothing ->
--             text ""

--       Just form ->
--         let
--           selectSeat =
--             select [ placeholder "Acento", class "flex-1 border-none rounded-sm bg-gray-100 text-gray-400" ]
--               [ option [ value "East" ] [ text "東" ]
--               , option [ value "South" ] [ text "南" ]
--               , option [ value "West" ] [ text "西" ]
--               , option [ value "North" ] [ text "北" ]
--               ]
--         in
--         div [ class "space-y-2" ]
--           [ div [ class "list-item" ]
--             [ p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
--             , p [ class "flex-1 font-bold text-right invisible" ] [ text "batata" ]
--             , selectSeat
--             , selectSeat
--             , selectSeat
--             , selectSeat
--             , input [ type_ "text", placeholder "Log Link", class "flex-1 w-36 border-none rounded-sm bg-gray-100 text-gray-400 placeholder-gray-400" ] []
--             ]
--           ]
--     ]

view : (Series -> msg) -> Series -> Html msg
view toggleFold series =
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
      [ button [ class "inline-btn btn-indigo-500 px-2", onClick (toggleFold series) ]
        [ if series.isFolded then
            text ">"
          else
            text "V"
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
  in
  div [ class "m-2" ]
    [ div [ class "container space-y-2 w-2/4" ]
      ( header ::
          if series.isFolded then
            []
          else
            heading :: (List.map Game.view series.games)
      )
    ]
