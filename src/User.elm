module User exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field

import ClubShort exposing (..)
import Model.Membership exposing (Membership)
import Model.Notification exposing (Notification)
import Model.Stats exposing (Stats)
import Model.TournamentShort exposing (TournamentShort)


type alias User =
  { id : Int
  , createdAt : String
  , username : String
  , email : String
  , stats : Stats
  , ownedClubs : List ClubShort
  , memberships : List Membership
  , tournaments : List TournamentShort
  , notifications : List Notification
  }

userDecoder : Decode.Decoder User
userDecoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "username" Decode.string <| \username ->
  Field.require "email" Decode.string <| \email ->
  Field.require "stats" Model.Stats.statsDecoder <| \stats ->
  Field.require "ownedClubs" (Decode.list clubShortDecoder) <| \ownedClubs ->
  Field.require "memberships" (Decode.list Model.Membership.decoder) <| \memberships ->
  Field.require "tournaments" (Decode.list Model.TournamentShort.decoder) <| \tournaments ->
  Field.require "notifications" (Decode.list Model.Notification.decoder) <| \notifications ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , username = username
    , email = email
    , stats = stats
    , ownedClubs = ownedClubs
    , memberships = memberships
    , tournaments = tournaments
    , notifications = notifications
    }
