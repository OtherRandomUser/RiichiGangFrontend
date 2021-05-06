module Viewer exposing (..)

import Json.Decode as Decode
import Json.Decode.Field as Field
import Json.Encode as Encode

type alias Viewer =
  { id : Int
  , username : String
  , email : String
  , token : String
  }

loginEncoder : { a | email : String, password : String } -> Encode.Value
loginEncoder form =
  Encode.object
    [ ("email", Encode.string form.email)
    , ("password", Encode.string form.password)
    ]

signUpEncoder : { a | username : String, email : String, password : String, passwordAgain : String } -> Encode.Value
signUpEncoder form =
  Encode.object
    [ ("username", Encode.string form.username)
    , ("email", Encode.string form.email)
    , ("password", Encode.string form.password)
    , ("passwordconfirmation", Encode.string form.passwordAgain) -- might be wrong
    ]

viewerDecoder : Decode.Decoder Viewer
viewerDecoder =
  Field.requireAt ["user", "id"] Decode.int <| \id ->
  Field.requireAt ["user", "username"] Decode.string <| \username ->
  Field.requireAt ["user", "email"] Decode.string <| \email ->
  Field.require "token" Decode.string <| \token ->

  Decode.succeed
    { id = id
    , username = username
    , email = email
    , token = token
    }
