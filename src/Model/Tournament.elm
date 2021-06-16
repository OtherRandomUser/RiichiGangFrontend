module Model.Tournament exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.BracketShort as BracketShort exposing (BracketShort)
import Model.Ruleset as Ruleset exposing (Ruleset)
import Model.TournamentPlayer as TournamentPlayer exposing (TournamentPlayer)


type alias Tournament =
  { id : Int
  , clubId : Int
  , createdAt : String
  , ownerId : Int
  , name : String
  , description : String
  , startDate : String
  , status : String
  , allowNonMembers : Bool
  , requirePermission : Bool
  , playerStatus : String
  , ruleset : Ruleset
  , players : List TournamentPlayer
  , brackets : List BracketShort
  }


decoder : Decode.Decoder Tournament
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "clubId" Decode.int <| \clubId ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "ownerId" Decode.int <| \ownerId ->
  Field.require "name" Decode.string <| \name ->
  Field.require "description" Decode.string <| \description ->
  Field.require "startDate" Decode.string <| \startDate ->
  Field.require "status" Decode.string <| \status ->
  Field.require "allowNonMembers" Decode.bool <| \allowNonMembers ->
  Field.require "requirePermission" Decode.bool <| \requirePermission ->
  Field.require "playerStatus" Decode.string <| \playerStatus ->
  Field.require "ruleset" Ruleset.decoder <| \ruleset ->
  Field.require "players" (Decode.list TournamentPlayer.decoder) <| \players ->
  Field.require "brackets" (Decode.list BracketShort.decoder) <| \brackets ->

  Decode.succeed
    { id = id
    , clubId = clubId
    , createdAt = createdAt
    , ownerId = ownerId
    , name = name
    , description = description
    , startDate = startDate
    , status = status
    , allowNonMembers = allowNonMembers
    , requirePermission = requirePermission
    , playerStatus = playerStatus
    , ruleset = ruleset
    , players = players
    , brackets = brackets
    }
