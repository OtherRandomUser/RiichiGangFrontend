module Api exposing (..)

import Http
import Json.Decode as Decode

type ApiError
  = BadUrl String
  | Timeout
  | NetworkError
  | BadStatus Int String
  | BadBody String

backendUrl : String
backendUrl = "https://localhost:5001/api"

expectJson : (Result ApiError a -> msg) -> Decode.Decoder a -> Http.Expect msg
expectJson toMsg decoder =
  Http.expectStringResponse toMsg <| \response ->
    case response of
      Http.BadUrl_ url ->
        Err (BadUrl url)

      Http.Timeout_ ->
        Err Timeout

      Http.NetworkError_ ->
        Err NetworkError

      Http.BadStatus_ metadata body ->
        Err (BadStatus metadata.statusCode body)

      Http.GoodStatus_ _ body ->
        case Decode.decodeString decoder body of
          Ok value ->
            Ok value

          Err err ->
            Err (BadBody (Decode.errorToString err))