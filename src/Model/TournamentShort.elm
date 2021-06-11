module Model.TournamentShort exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder


type alias TournamentShort =
  { id : Int
  , createdAt : String
  , name : String
  , totalPlayers : Int
  , startDate : String
  , status : String
  }

decoder : Decode.Decoder TournamentShort
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "name" Decode.string <| \name ->
  Field.require "totalPlayers" Decode.int <| \totalPlayers ->
  Field.require "startDate" Decode.string <| \startDate ->
  Field.require "status" Decode.string <| \status ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , name = name
    , totalPlayers = totalPlayers
    , startDate = startDate
    , status = status
    }

getUrl : TournamentShort -> String
getUrl tournament =
  Url.Builder.absolute ["tournaments", String.fromInt tournament.id] []

view : TournamentShort -> Html msg
view tournament =
  div [ class "list-item" ]
    [ a [ href (getUrl tournament), class "flex-grow hover:underline" ] [ text tournament.name ]
    , span [] [ text ((String.fromInt tournament.totalPlayers) ++ " Jogadores") ]
    , span [] [ text ("Inicio em " ++ tournament.startDate) ]
    , span [] [ text tournament.status ]
    ]
