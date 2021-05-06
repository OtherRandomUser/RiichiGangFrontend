module Page.SignUp exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Url.Builder

import Api exposing (..)
import CommonHtml exposing (viewNav, errorCard)
import Session exposing (..)
import User exposing (..)


-- Data Modeling --

type alias Model =
  { session : Session
  , form : Form
  , error : Maybe String
  }

type alias Form =
  { username : String
  , email : String
  , password : String
  , passwordAgain : String
  }

type Msg
  = RequestSignUp
  | UserSignUp (Result ApiError User)
  | InputUsername String
  | InputEmail String
  | InputPassword String
  | InputPasswordAgain String

init : Session -> (Model, Cmd Msg)
init session =
  ( { session = session
    , form =
      { username = ""
      , email = ""
      , password = ""
      , passwordAgain = ""
      }
    , error = Nothing
    }
  , Cmd.none
  )


-- Update --

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    RequestSignUp ->
      case validateSignUp model.form of
        Ok _ ->
          (model, requestSignUp model.form)

        Err err ->
          ({ model | error = Just err }, Cmd.none)

    UserSignUp result ->
      case result of 
        Ok user ->
          case model.session of
            LoggedIn key _ ->
              ({ model | session = LoggedIn key user, error = Nothing }, redirectHome (toSession model))

            Anonymus key ->
              ({ model | session = LoggedIn key user, error = Nothing }, redirectHome (toSession model))

        Err error ->
          ({ model | error = Just (errorToString error) }, Cmd.none)

    InputUsername username ->
      updateForm (\form -> { form | username = username }) model

    InputEmail email ->
      updateForm (\form -> { form | email = email }) model

    InputPassword password ->
      updateForm (\form -> { form | password = password }) model

    InputPasswordAgain passwordAgain ->
      updateForm (\form -> { form | passwordAgain = passwordAgain }) model

redirectHome : Session -> Cmd Msg
redirectHome session =
  Nav.pushUrl (Session.navKey session) (Url.Builder.absolute [] [])

updateForm : (Form -> Form) -> Model -> (Model, Cmd msg)
updateForm transform model =
  ({ model | form = transform model.form }, Cmd.none)

validateSignUp : Form -> Result String ()
validateSignUp form =
  if String.isEmpty form.email then
    Err "Preencha o Email"
  else if String.isEmpty form.username then
    Err "Preencha o Nome de Usuário"
  else if String.isEmpty form.password then
    Err "Preencha a Senha"
  else if String.isEmpty form.passwordAgain then
    Err "Repita a Senha"
  else if form.password /= form.passwordAgain then
    Err "Repita a Senha"
  else
    Ok ()

requestSignUp : Form -> Cmd Msg
requestSignUp form =
  Http.post
    { url = backendUrl ++ "/users/signup"
    , body = Http.jsonBody (signUpEncoder form)
    , expect = expectJson UserSignUp userDecoder
    }


-- view --

view : Model -> Browser.Document Msg
view model =
  { title = "Sign Up"
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , viewSingInCard

    ]
  }

viewSingInCard : Html Msg
viewSingInCard =
  div [ class "login-card" ]
    [ h1 [ class "card-heading" ] [ text "Sign Up" ]
    , input [ type_ "email", placeholder "Email", class "login-input", onInput InputEmail ] []
    , input [ type_ "text", placeholder "Nome de Usuário", class "login-input", onInput InputUsername ] []
    , input [ type_ "password", placeholder "Senha", class "login-input", onInput InputPassword ] []
    , input [ type_ "password", placeholder "Confirmação da Senha", class "login-input", onInput InputPasswordAgain ] []
    , button [ class "btn btn-indigo-500", onClick RequestSignUp ] [ text "Sign Up" ]
    ]

toSession : Model -> Session
toSession model =
  model.session
