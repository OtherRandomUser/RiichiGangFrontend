module Model.Membership exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import ClubShort exposing (ClubShort)


type alias Membership =
  { club : ClubShort
  , createdAt : String
  , approved : Bool
  , denied : Bool
  }

decoder : Decode.Decoder Membership
decoder =
  Field.require "club" ClubShort.clubShortDecoder <| \club ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "approved" Decode.bool <| \approved ->
  Field.require "denied" Decode.bool <| \denied ->

  Decode.succeed
    { club = club
    , createdAt = createdAt
    , approved = approved
    , denied = denied
    }

view : Membership -> Html msg
view membership =
  let
    club = membership.club
  in
  div [ class "list-item" ]
    [ a [ href (ClubShort.getUrl club), class "flex-grow hover:underline" ] [ text club.name ]
    , if membership.approved then
        span [] []
      else if membership.denied then
        span [ class "font-bold" ] [ text "Negada" ]
      else
        span [] [ text "Pendente" ]
    , span [] [ text club.localization ]
    , span [] [ text ((String.fromInt club.totalTournaments) ++ " Torneios") ]
    , span [] [ text ((String.fromInt club.totalPlayers) ++ " Jogadores") ]
    , span [] [ text club.createdAt ]
    ]
