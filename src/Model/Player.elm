module Model.Player exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field


type alias Player =
  { seat : String
  , gameScore : Float
  , runningTotal : Float
  }


decoder : Decode.Decoder Player
decoder =
  Field.require "seat" Decode.string <| \seat ->
  Field.require "gameScore" Decode.float <| \gameScore ->
  Field.require "runningTotal" Decode.float <| \runningTotal ->

  Decode.succeed
    { seat = seat
    , gameScore = gameScore
    , runningTotal = runningTotal
    }

