module Model.BracketShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder

import Model.BracketPlayerShort as BracketPlayerShort exposing (BracketPlayerShort)
import Route


type alias BracketShort =
  { id : Int
  , tournamentId : Int
  , sequence : Int
  , name : String
  , description : String
  , createdAt : String
  , startedAt : String
  , finishedAt : String
  , winCondition : String
  , numberOfAdvancing : Int
  , numberOfSeries : Int
  , gamesPerSeries : Int
  , finalScoreMultiplier : Float
  , players : List BracketPlayerShort
  }


decoder : Decode.Decoder BracketShort
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "tournamentId" Decode.int <| \tournamentId ->
  Field.require "sequence" Decode.int <| \sequence ->
  Field.require "name" Decode.string <| \name ->
  Field.require "description" Decode.string <| \description ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "startedAt" Decode.string <| \startedAt ->
  Field.require "finishedAt" Decode.string <| \finishedAt ->
  Field.require "winCondition" Decode.string <| \winCondition ->
  Field.require "numberOfAdvancing" Decode.int <| \numberOfAdvancing ->
  Field.require "numberOfSeries" Decode.int <| \numberOfSeries ->
  Field.require "gamesPerSeries" Decode.int <| \gamesPerSeries ->
  Field.require "finalScoreMultiplier" Decode.float <| \finalScoreMultiplier ->
  Field.require "players" (Decode.list BracketPlayerShort.decoder)  <| \players ->

  Decode.succeed
    { id = id
    , tournamentId = tournamentId
    , sequence = sequence
    , name = name
    , description = description
    , createdAt = createdAt
    , startedAt = startedAt
    , finishedAt = finishedAt
    , winCondition = winCondition
    , numberOfAdvancing = numberOfAdvancing
    , numberOfSeries = numberOfSeries
    , gamesPerSeries = gamesPerSeries
    , finalScoreMultiplier = finalScoreMultiplier
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
      [ a [ href (Url.Builder.absolute (Route.routeToPieces (Route.Bracket bracket.tournamentId bracket.id)) []), class "list-heading" ] [ text bracket.name ]
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
