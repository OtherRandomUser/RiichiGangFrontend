module Page.Login exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Browser.Navigation as Nav

import Api exposing (..)
import CommonHtml exposing (viewNav, errorCard)
import Session exposing (..)
import Viewer exposing (..)
import Url.Builder


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
  | UserLogin (Result ApiError Viewer)
  | InputEmail String
  | InputPassword String

init : Session -> (Model, Cmd Msg)
init session =
  ( { session = session
    , form =
      { email = ""
      , password = ""
      }
    , error = Nothing
    }
  , Cmd.none
  )


-- update --

update : Msg -> Model -> (Model, Cmd Msg)
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
              ({ model | session = LoggedIn key user, error = Nothing }, redirectHome (toSession model))

            Anonymus key ->
              ({ model | session = LoggedIn key user, error = Nothing }, redirectHome (toSession model))

        Err error ->
          ({ model | error = Just (errorToString error) }, Cmd.none)

    InputEmail email ->
      updateForm (\form -> { form | email = email}) model

    InputPassword password ->
      updateForm (\form -> { form | password = password}) model

redirectHome : Session -> Cmd Msg
redirectHome session =
  Nav.pushUrl (Session.navKey session) (Url.Builder.absolute [] [])

updateForm : (Form -> Form) -> Model -> (Model, Cmd msg)
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
    , expect = expectJson UserLogin viewerDecoder
    }


-- view --

view : Model -> Browser.Document Msg
view model =
  { title = "Login"
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
