module Model.Bracket exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.Series as Series exposing (Series)


type alias Bracket =
  { id : Int
  , createdAt : String
  , startedAt : String
  , finishedAt : String
  , sequence : Int
  , description : String
  , series : List Series
  }

decoder : Decode.Decoder Bracket
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "startedAt" Decode.string <| \startedAt ->
  Field.require "finishedAt" Decode.string <| \finishedAt ->
  Field.require "sequence" Decode.int <| \sequence ->
  Field.require "description" Decode.string <| \description ->
  Field.require "series" (Decode.list Series.decoder) <| \series ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , startedAt = startedAt
    , finishedAt = finishedAt
    , sequence = sequence
    , description = description
    , series = series
    }
