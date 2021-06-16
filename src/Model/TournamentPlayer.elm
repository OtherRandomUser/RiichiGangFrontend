module Model.TournamentPlayer exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import UserShort


type alias TournamentPlayer =
  { userId : Int
  , username : String
  , status : String
  }

decoder : Decode.Decoder TournamentPlayer
decoder =
  Field.require "userId" Decode.int <| \userId ->
  Field.require "username" Decode.string <| \username ->
  Field.require "status" Decode.string <| \status ->

  Decode.succeed
    { userId = userId
    , username = username
    , status = status
    }

view : TournamentPlayer -> Bool -> msg -> Html msg
view player isOwner remove =
  div [ class "list-item" ]
    [ a [ href (UserShort.getUrlId player.userId), class "py-2 hover:underline" ]
      [ text player.username
      ]
    , span [ class "py-2" ] [ text player.status ]
    , if isOwner then
        button [ class "p-2 inline-btn btn-red-500", onClick remove ] [ text "Remover" ]
      else
        text ""
    ]
