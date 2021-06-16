module Model.Game exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.Player as Player exposing (Player)


type alias Game =
  { player1 : Player
  , player2 : Player
  , player3 : Player
  , player4 : Player
  , playedAt : String
  , logLink : String
  }


decoder : Decode.Decoder Game
decoder =
  Field.require "player1" Player.decoder <| \player1 ->
  Field.require "player2" Player.decoder <| \player2 ->
  Field.require "player3" Player.decoder <| \player3 ->
  Field.require "player4" Player.decoder <| \player4 ->
  Field.require "playedAt" Decode.string <| \playedAt ->
  Field.require "logLink" Decode.string <| \logLink ->

  Decode.succeed
    { player1 = player1
    , player2 = player2
    , player3 = player3
    , player4 = player4
    , playedAt = playedAt
    , logLink = logLink
    }

view : Game -> Html msg
view game =
  let
    playerClass = "flex-1"
    labelClass = "font-semibold"
  in
  div [ class "flex bg-indigo-500 text-white rounded-xl px-5 py-2" ]
    [ div [ class "flex-1 align-middle pt-6" ] [ text "#1" ] -- TODO add sequence
    , div [ class playerClass ]
      [ p [ class labelClass ] [ text "Acento" ]
      , p [ class labelClass ] [ text "Pontuação Final" ]
      , p [ class labelClass ] [ text "Total" ]
      ]
    , viewPlayer game.player1 playerClass
    , viewPlayer game.player2 playerClass
    , viewPlayer game.player3 playerClass
    , viewPlayer game.player4 playerClass
    , div [ class "flex-1 pt-6" ]
      [ a [ class "pl-8 hover:underline" ] [ text "Log" ]
      ]
    ]

viewPlayer : Player -> String -> Html msg
viewPlayer player playerClass =
  let
    seatClass = "font-semibold text-right pr-1"
    valueClass = "text-right"
  in
  div [ class playerClass ]
    [ p [ class seatClass ] [ text player.seat ]
    , p [ class valueClass ] [ text (String.fromFloat player.gameScore) ]
    , p [ class valueClass ] [ text (String.fromFloat player.runningTotal) ]
    ]

