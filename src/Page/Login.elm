module Page.Login exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Json.Decode.Field as Field
import Json.Encode as Encode

import Api exposing (..)
import CommonHtml exposing (viewNav, errorCard)
import Session exposing (..)
import User exposing (..)

-- data modeling --
type alias Model =
  { session : Session
  , form : Form
  , error : Maybe String
  }

type alias Form =
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
      case validateLogin model.form of
        Ok _ ->
          (model, (requestLogin model.form))

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    UserLogin result ->
      case result of
        Ok user ->
          case model.session of
            LoggedIn key _ ->
              ({ model | session = LoggedIn key user, error = Nothing }, Cmd.none)

            Anonymus key ->
              ({ model | session = LoggedIn key user, error = Nothing }, Cmd.none)

        Err error ->
          case error of
            BadUrl url ->
              ({ model | error = Just ("Url inválida: " ++ url) }, Cmd.none)

            Timeout ->
              ({ model | error = Just "Erro de timeout, tente novamente" }, Cmd.none)

            NetworkError ->
              ({ model | error = Just "Erro de rede, verifique a sua conexão e tente novamente" }, Cmd.none)

            BadStatus _ body ->
              ({ model | error = Just body }, Cmd.none)

            BadBody body ->
              ({ model | error = Just ("Falha interna: " ++ body) }, Cmd.none)

    InputEmail email ->
      updateForm (\form -> { form | email = email}) model

    InputPassword password ->
      updateForm (\form -> { form | password = password}) model

updateForm transform model =
    ( { model | form = transform model.form }, Cmd.none )

validateLogin : Form -> Result String ()
validateLogin form =
  if String.isEmpty form.email then
    Err "Preencha o Email"
  else if String.isEmpty form.password then
    Err "Preencha a Senha"
  else
    Ok ()


requestLogin : Form -> Cmd Msg
requestLogin form =
  Http.post
    { url = backendUrl ++ "/users/login"
    , body = Http.jsonBody (loginEncoder form)
    , expect = expectJson UserLogin loginDecoder
    }

loginEncoder : Form -> Encode.Value
loginEncoder form =
  Encode.object
    [ ("email", Encode.string form.email)
    , ("password", Encode.string form.password)
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

view : Model -> Browser.Document Msg
view model =
  { title = "Riichi Gang"
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , viewLoginCard

    ]
  }

viewLoginCard : Html Msg
viewLoginCard =
  div [ class "login-card" ]
    [ h1 [ class "card-heading" ] [ text "Login" ]
    , input [ type_ "email", placeholder "Email", class "login-input", onInput InputEmail ] []
    , input [ type_ "password", placeholder "Senha", class "login-input", onInput InputPassword ] []
    , button [ class "btn btn-indigo-500", onClick RequestLogin ] [ text "Login" ]
    ]

toSession : Model -> Session
toSession model =
  model.session
