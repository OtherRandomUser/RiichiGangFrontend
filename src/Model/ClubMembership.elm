module Model.ClubMembership exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import UserShort exposing (UserShort)


type alias ClubMembership =
  { user : UserShort
  , createdAt : String
  , approved : Bool
  , denied : Bool
  }


decoder : Decode.Decoder ClubMembership
decoder =
  Field.require "user" UserShort.userShortDecoder <| \user ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "approved" Decode.bool <| \approved ->
  Field.require "denied" Decode.bool <| \denied ->

  Decode.succeed
    { user = user
    , createdAt = createdAt
    , approved = approved
    , denied = denied
    }

view : ClubMembership -> Maybe msg -> Html msg
view membership removeMsg =
  let
    user = membership.user
  in
  div [ class "list-item" ]
    [ a [ href (UserShort.getUrl user), class "flex-grow hover:underline" ] [ text user.username ]
    , if membership.approved then
        span [] []
      else if membership.denied then
        span [ class "font-bold" ] [ text "Negada" ]
      else
        span [] [ text "Pendente" ]
    , span [] [ text ((String.fromInt user.totalTournaments) ++ " Torneios") ]
    , span [] [ text user.createdAt ]
    , case removeMsg of
      Nothing ->
        div [] []

      Just msg ->
        button [ class "border-none btn btn-red-500", onClick msg ] [ text "Cancelar" ]
    ]
