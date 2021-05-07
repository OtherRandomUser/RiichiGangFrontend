module Notification exposing (..)

type alias Notification =
  { id : Int
  , createdAt : String
  , message : String
  , membershipId : Maybe Int
  }
