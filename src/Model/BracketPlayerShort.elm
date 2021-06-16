module Model.BracketPlayerShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import UserShort


type alias BracketPlayerShort =
  { userId : Int
  , name : String
  , placement : Int
  , score : Float
  }


decoder : Decode.Decoder BracketPlayerShort
decoder =
  Field.require "userId" Decode.int <| \userId ->
  Field.require "name" Decode.string <| \name ->
  Field.require "placement" Decode.int <| \placement ->
  Field.require "score" Decode.float <| \score ->

  Decode.succeed
    { userId = userId
    , name = name
    , placement = placement
    , score = score
    }


view : BracketPlayerShort -> Html msg
view player =
  let
    scoreTextPrefix = if player.score > 0 then "+" else ""
  in
  div [ class "list-item" ]
    [ span [] [text ("#" ++ (String.fromInt player.placement)) ]
    , a [ href (UserShort.getUrlId player.userId), class "flex-grow hover:underline" ] [ text player.name ]
    , span [] [ text (scoreTextPrefix ++ (String.fromFloat player.score)) ]
    ]
