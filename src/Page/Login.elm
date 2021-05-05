module Page.Login exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Json.Decode.Field as Field
import Json.Encode as Encode


-- TODO move --
backendUrl : String
backendUrl = "https://localhost:5001/api"


-- TODO move --
type alias User =
  { id : String
  , username : String
  , email : String
  , token : String
  }




-- data modeling --
type alias Model =
  { email : String
  , password : String
  }

type Msg
  = RequestLogin
  | UserLogin (Result ApiError User)
  | InputEmail String
  | InputPassword String


-- update --
update msg model =
  case msg of
    RequestLogin ->
      case validateLogin model of
        Ok _ ->
          Ok (model, requestlogin)

        Err err ->
          Err err

    UserLogin res ->
      case res of
        Ok user ->
          Ok (user, Cmd.none)

        Err err ->
          case err of
            BadUrl url ->
              Err ("Url inválida: " ++ url)

            Timeout ->
              Err "Erro de timeout, tente novamente"

            NetworkError ->
              Err "Erro de rede, verifique a sua conexão e tente novamente"

            BadStatus _ body ->
              Err body

            BadBody body ->
              Err ("Falha interna: " ++ body)

    InputEmail String ->
      Ok ({ model | })

    InputPassword String ->


--     UserLogin result ->
--       case result of
--         Ok user ->
--           ({ model | user = Just user, error = Nothing }, Cmd.none)

--         Err error ->
--           case error of
--             BadUrl url ->
--               ({ model | error = Just ("Url inválida: " ++ url) }, Cmd.none)

--             Timeout ->
--               ({ model | error = Just "Erro de timeout, tente novamente" }, Cmd.none)

--             NetworkError ->
--               ({ model | error = Just "Erro de rede, verifique a sua conexão e tente novamente" }, Cmd.none)

--             BadStatus _ body ->
--               ({ model | error = Just body }, Cmd.none)

--             BadBody body ->
--               ({ model | error = Just ("Falha interna: " ++ body) }, Cmd.none)

--     LoginMsg loginMsg ->
--       updateLoginPage loginMsg model

-- updateLoginPage : LoginMsg -> Model -> (Model, Cmd msg)
-- updateLoginPage msg model =
--   case msg of
--     LoginRequest ->
--       (model, Cmd.none)

--     LoginInputEmail val ->

--       (model, Cmd.none)

--     LoginInputPassword val ->
--       (model, Cmd.none)









validateLogin : Model -> Result String ()
validateLogin model =
  if String.isEmpty model.email then
    Err "Preencha o Email"
  else if String.isEmpty model.password then
    Err "Preencha a Senha"
  else
    Ok ()


requestlogin : Model -> Cmd Msg
requestlogin model =
  Http.post
    { url = backendUrl ++ "/users/login"
    , body = Http.jsonBody (loginEncoder model)
    , expect = expectJson UserLogin loginDecoder
    }





-- TODO move --
type ApiError
  = BadUrl String
  | Timeout
  | NetworkError
  | BadStatus Int String
  | BadBody String




-- TODO move --
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





loginEncoder : Model -> Encode.Value
loginEncoder model =
  Encode.object
    [ ("email", Encode.string model.email)
    , ("password", Encode.string model.password)
    ]

loginDecoder : Decode.Decoder User
loginDecoder =
  Field.requireAt ["user", "id"] Decode.string <| \id ->
  Field.requireAt ["user", "username"] Decode.string <| \username ->
  Field.requireAt ["user", "email"] Decode.string <| \email ->
  Field.require "token" Decode.string <| \token ->

  Decode.succeed
    { id = id
    , username = username
    , email = email
    , token = token
    }


-- view --

viewLoginCard : Html Msg
viewLoginCard =
  div [ class "login-card" ]
    [ h1 [ class "card-heading" ] [ text "Login" ]
    , input [ type_ "email", placeholder "Email", class "login-input", onInput InputEmail ] []
    , input [ type_ "password", placeholder "Senha", class "login-input", onInput InputPassword ] []
    , button [ class "btn btn-indigo-500", onClick RequestLogin ] [ text "Login" ]
    ]
