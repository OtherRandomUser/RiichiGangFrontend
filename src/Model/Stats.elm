module Model.Stats exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Round


type alias Stats =
  { totalGames : Int
  , totalRounds : Int
  , firstRate : Float
  , secondRate : Float
  , thirdRate : Float
  , fourthRate : Float
  , bustingRate : Float
  , winRate : Float
  , tsumoRate : Float
  , callRate : Float
  , riichiRate : Float
  , dealInRate : Float
  }

statsDecoder : Decode.Decoder Stats
statsDecoder =
  Field.require "totalGames" Decode.int <| \totalGames ->
  Field.require "totalRounds" Decode.int <| \totalRounds ->
  Field.require "firstRate" Decode.float <| \firstRate ->
  Field.require "secondRate" Decode.float <| \secondRate ->
  Field.require "thirdRate" Decode.float <| \thirdRate ->
  Field.require "fourthRate" Decode.float <| \fourthRate ->
  Field.require "bustingRate" Decode.float <| \bustingRate ->
  Field.require "winRate" Decode.float <| \winRate ->
  Field.require "tsumoRate" Decode.float <| \tsumoRate ->
  Field.require "callRate" Decode.float <| \callRate ->
  Field.require "riichiRate" Decode.float <| \riichiRate ->
  Field.require "dealInRate" Decode.float <| \dealInRate ->

  Decode.succeed
    { totalGames = totalGames
    , totalRounds = totalRounds
    , firstRate = firstRate
    , secondRate = secondRate
    , thirdRate = thirdRate
    , fourthRate = fourthRate
    , bustingRate = bustingRate
    , winRate = winRate
    , tsumoRate = tsumoRate
    , callRate = callRate
    , riichiRate = riichiRate
    , dealInRate = dealInRate
    }

view : Stats -> Html msg
view stats =
  let
    headClass = "text-right border-r-8 border-transparent font-bold"
    dataClass = "text-right border-r-8 border-transparent font-normal"
    formatRatio = \ratio -> (Round.round 2 ratio) ++ "%"
  in
  div [ class "card bg-indigo-500 text-white" ]
    [ table [ class "table-fixed border-separate" ]
      [ tr []
        [ th [ class headClass ] [ text "Número de Jogos" ]
        , th [ class dataClass ] [ text (String.fromInt stats.totalGames) ]

        , th [ class headClass ] [ text "Taxa de 1º" ]
        , th [ class dataClass ] [ text (formatRatio stats.firstRate) ]

        , th [ class headClass ] [ text "Taxa de Vitória" ]
        , th [ class dataClass ] [ text (formatRatio stats.winRate) ]
        ]
      , tr []
        [ td [ class headClass ] [ text "Número de Rounds" ]
        , td [ class dataClass ] [ text (String.fromInt stats.totalRounds) ]

        , td [ class headClass ] [ text "Taxa de 2º" ]
        , td [ class dataClass ] [ text (formatRatio stats.secondRate) ]

        , td [ class headClass ] [ text "Taxa de Tsumo" ]
        , td [ class dataClass ] [ text (formatRatio stats.tsumoRate) ]
        ]
      , tr []
        [ td [] []
        , td [] []

        , td [ class headClass ] [ text "Taxa de 3º" ]
        , td [ class dataClass ] [ text (formatRatio stats.thirdRate) ]

        , td [ class headClass ] [ text "Taxa de Chamada" ]
        , td [ class dataClass ] [ text (formatRatio stats.callRate) ]
        ]
      , tr []
        [ td [] []
        , td [] []

        , td [ class headClass ] [ text "Taxa de 4º" ]
        , td [ class dataClass ] [ text (formatRatio stats.fourthRate) ]

        , td [ class headClass ] [ text "Taxa de Riichi" ]
        , td [ class dataClass ] [ text (formatRatio stats.riichiRate) ]
        ]
      , tr []
        [ td [] []
        , td [] []

        , td [ class headClass ] [ text "Taxa de Falência" ]
        , td [ class dataClass ] [ text (formatRatio stats.bustingRate) ]

        , td [ class headClass ] [ text "Taxa de Deal In" ]
        , td [ class dataClass ] [ text (formatRatio stats.dealInRate) ]
        ]
      ]
    ]
