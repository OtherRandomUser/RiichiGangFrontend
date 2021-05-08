module User exposing (..)

import Html.Attributes exposing (id)
import Json.Decode as Decode
import Json.Decode.Field as Field

import ClubShort exposing (..)


type alias User =
  { id : Int
  , createdAt : String
  , username : String
  , email : String
  -- TODO stats
  , ownedClubs : List ClubShort
  -- TODO resto
  }

userDecoder : Decode.Decoder User
userDecoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "username" Decode.string <| \username ->
  Field.require "email" Decode.string <| \email ->
  Field.require "ownedClubs" (Decode.list clubShortDecoder) <| \ownedClubs ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , username = username
    , email = email
    , ownedClubs = ownedClubs
    }
