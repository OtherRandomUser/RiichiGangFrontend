module UserShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder


type alias UserShort =
  { id : Int
  , createdAt : String
  , username : String
  , totalTournaments : Int
  }

userShortDecoder : Decode.Decoder UserShort
userShortDecoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "username" Decode.string <| \username ->
  Field.require "totalTournaments" Decode.int <| \totalTournaments ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , username = username
    , totalTournaments = totalTournaments
    }

getUrl : UserShort -> String
getUrl user =
  Url.Builder.absolute ["users", String.fromInt user.id] []

view : UserShort -> Html msg
view user =
  div [ class "list-item" ]
    [ a [ href (getUrl user), class "flex-grow hover:underline" ] [ text user.username ]
    , span [] [ text ((String.fromInt user.totalTournaments) ++ " Torneios") ]
    , span [] [ text user.createdAt ]
    ]
