module ClubShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder
import Url exposing (Protocol(..))



type alias ClubShort =
  { id : Int
  , createdAt : String
  , name : String
  , website : String
  , contact : String
  , localization : String
  , totalPlayers : Int
  , totalTournaments : Int
  }

clubShortDecoder : Decode.Decoder ClubShort
clubShortDecoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "name" Decode.string <| \name ->
  Field.require "website" Decode.string <| \website ->
  Field.require "contact" Decode.string <| \contact ->
  Field.require "localization" Decode.string <| \localization ->
  Field.require "totalPlayers" Decode.int <| \totalPlayers ->
  Field.require "totalTournaments" Decode.int <| \totalTournaments ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , name = name
    , website = website
    , contact = contact
    , localization = localization
    , totalPlayers = totalPlayers
    , totalTournaments = totalTournaments
    }

clubShortListDecoder : Decode.Decoder (List ClubShort)
clubShortListDecoder =
  Decode.list clubShortDecoder

getUrl : ClubShort -> String
getUrl club =
  Url.Builder.absolute ["clubs", String.fromInt club.id] []

-- view : ClubShort -> Html msg
-- view club =
--   div [ class "list-item" ]
--     [ a [ href (getUrl club), class "flex-grow hover:underline" ] [ text club.name ]
--     , span [] [ text club.createdAt ]
--     ]

view : ClubShort -> Html msg
view club =
  div [ class "list-item" ]
    [ a [ href (getUrl club), class "flex-grow hover:underline" ] [ text club.name ]
    , span [] [ text club.localization ]
    , span [] [ text ((String.fromInt club.totalTournaments) ++ " Torneios") ]
    , span [] [ text ((String.fromInt club.totalPlayers) ++ " Jogadores") ]
    , span [] [ text club.createdAt ]
    ]
