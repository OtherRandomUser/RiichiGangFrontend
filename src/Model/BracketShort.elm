module Model.BracketShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.BracketPlayerShort as BracketPlayerShort exposing (BracketPlayerShort)


type alias BracketShort =
  { id : Int
  , name : String
  , createdAt : String
  , startedAt : String
  , finishedAt : String
  , players : List BracketPlayerShort
  }


decoder : Decode.Decoder BracketShort
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "name" Decode.string <| \name ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "startedAt" Decode.string <| \startedAt ->
  Field.require "finishedAt" Decode.string <| \finishedAt ->
  Field.require "players" (Decode.list BracketPlayerShort.decoder)  <| \players ->

  Decode.succeed
    { id = id
    , name = name
    , createdAt = createdAt
    , startedAt = startedAt
    , finishedAt = finishedAt
    , players = players
    }


view : BracketShort -> Html msg
view bracket =
  let
    junc = if bracket.finishedAt /= "" then
        " - "
      else
        ""
  in
  div [ class "m-2" ]
    [ div [ class "flex space-x-2" ]
      [ h1 [ class "list-heading" ] [ text bracket.name ]
      , span [ class "text-indigo-500 pt-0.5" ]
        [ text (String.concat
          [ bracket.startedAt
          , junc
          , bracket.finishedAt
          ])
        ]
      ]
    , if List.isEmpty bracket.players then
        p [] [ text "Nada ainda" ]
      else
        div [ class "space-y-4" ] (List.map BracketPlayerShort.view bracket.players)
    ]
