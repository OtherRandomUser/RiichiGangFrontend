module Model.Series exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field

import Model.Game as Game exposing (Game)


type alias Series =
  { player1Name : String
  , player2Name : String
  , player3Name : String
  , player4Name : String
  , playedAt : String
  , finishedAt : String
  , status : String
  , games : List Game
  , isFolded : Bool
  }


decoder : Decode.Decoder Series
decoder =
  Field.require "player1Name" Decode.string <| \player1Name ->
  Field.require "player2Name" Decode.string <| \player2Name ->
  Field.require "player3Name" Decode.string <| \player3Name ->
  Field.require "player4Name" Decode.string <| \player4Name ->
  Field.require "playedAt" Decode.string <| \playedAt ->
  Field.require "finishedAt" Decode.string <| \finishedAt ->
  Field.require "status" Decode.string <| \status ->
  Field.require "games" (Decode.list Game.decoder) <| \games ->

  Decode.succeed
    { player1Name = player1Name
    , player2Name = player2Name
    , player3Name = player3Name
    , player4Name = player4Name
    , playedAt = playedAt
    , finishedAt = finishedAt
    , status = status
    , games = games
    , isFolded = True
    }

view : Series -> msg -> Html msg
view series toggleFold =
  let
    visibleHeadingClass = "flex-1 font-bold text-right invisible"
    invisibleHeadingClass = "flex-1 font-bold text-right"
    heading = div [ class "flex px-5" ]
      [ p [ class invisibleHeadingClass ] [ text "batata" ]
      , p [ class invisibleHeadingClass ] [ text "batata" ]
      , p [ class visibleHeadingClass ] [ text series.player1Name ]
      , p [ class visibleHeadingClass ] [ text series.player2Name ]
      , p [ class visibleHeadingClass ] [ text series.player3Name ]
      , p [ class visibleHeadingClass ] [ text series.player4Name ]
      , p [ class invisibleHeadingClass ] [ text "batata" ]
      ]

    header = div [ class "list-item" ]
      [ button [ class "inline-btn btn-indigo-500 px-2", onClick toggleFold ]
        [ if series.isFolded then
            text ">"
          else
            text "V"
        ]
      , p [] [ text (String.concat
        [ series.player1Name, " vs "
        , series.player2Name, " vs "
        , series.player3Name, " vs "
        , series.player4Name
        ])]
      , span []
        [ text
          ( series.playedAt ++
              if String.isEmpty (String.trim series.finishedAt) then
                " - " ++ series.finishedAt
              else
                ""
          )
        ]
      ]
  in
  div [ class "m-2" ]
    [ div [ class "container space-y-2 w-2/4" ]
      ( header ::
          if series.isFolded then
            []
          else
            heading :: (List.map Game.view series.games)
      )
    ]
