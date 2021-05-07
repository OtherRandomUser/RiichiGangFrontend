module Club exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder

import UserShort exposing (UserShort, userShortDecoder)


type alias Club =
  { id : Int
  , createdAt : String
  , name : String
  , website : String
  , contact : String
  , localization : String
  , owner : UserShort
  }

clubDecoder : Decode.Decoder Club
clubDecoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "name" Decode.string <| \name ->
  Field.require "website" Decode.string <| \website ->
  Field.require "contact" Decode.string <| \contact ->
  Field.require "localization" Decode.string <| \localization ->
  Field.require "owner" userShortDecoder <| \owner ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , name = name
    , website = website
    , contact = contact
    , localization = localization
    , owner = owner
    }

getUrl : Club -> String
getUrl club =
  Url.Builder.absolute ["clubs", String.fromInt club.id] []
