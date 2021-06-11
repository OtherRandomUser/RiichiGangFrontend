module Model.Notification exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder

import UserShort exposing (UserShort)


type alias Notification =
  { id : Int
  , createdAt : String
  , creator : UserShort
  , message : String
  }

decoder : Decode.Decoder Notification
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "creator" UserShort.userShortDecoder <| \creator ->
  Field.require "message" Decode.string <| \message ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , creator = creator
    , message = message
    }

listDecoder : Decode.Decoder (List Notification)
listDecoder =
  Decode.list decoder

getConfirmUrl : Notification -> String
getConfirmUrl notification =
  Url.Builder.absolute ["users", "notifications", String.fromInt notification.id, "confirm"] []

getDenyUrl : Notification -> String
getDenyUrl notification =
  Url.Builder.absolute ["users", "notifications", String.fromInt notification.id, "deny"] []

view : Notification -> msg -> msg -> Html msg
view notification confirm deny =
  div [ class "list-item" ]
    [ a [ href (UserShort.getUrl notification.creator), class "py-2 hover:underline" ]
      [ text notification.creator.username
      ]
    , span [ class "py-2" ] [ text notification.message ]
    , button [ class "p-2 inline-btn btn-green-500", onClick confirm ] [ text "Confirmar" ]
    , button [ class "p-2 inline-btn btn-red-500", onClick deny ] [ text "Recusar" ]
    ]
