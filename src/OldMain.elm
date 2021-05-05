module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Json.Decode.Field as Field
import Json.Encode as Encode
import Url
import Url.Parser as UrlP

main : Program () Model RootMsg
main =
  Browser.application
    { init = init
    , update = update
    , view = view
    , subscriptions = subscriptions
    , onUrlChange = UrlChanged
    , onUrlRequest = LinkClicked
    }

type alias User =
  { id : String
  , username : String
  , email : String
  , token : String
  }

type alias Model =
  { key : Nav.Key
  , url : Url.Url
  , route : Route
  , user : Maybe User
  , error : Maybe String
  }

type Route
  = Home
  | NotFound
  | Login LoginModel

type RootMsg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | UserLogin (Result ApiError User)
  | LoginMsg LoginMsg

backendUrl : String
backendUrl = "https://localhost:5001/api"

init : () -> Url.Url -> Nav.Key -> (Model, Cmd RootMsg)
init _ url key =
  ( Model key url Home Nothing Nothing
  , Cmd.none
  )

routeParser : UrlP.Parser (Route -> c) c
routeParser =
  UrlP.oneOf
    [ UrlP.map Home UrlP.top
    , UrlP.map (Login (LoginModel "" "")) (UrlP.s "login")
    ]

toRoute : Url.Url -> Route
toRoute url =
  Maybe.withDefault NotFound (UrlP.parse routeParser url)

update : RootMsg -> Model -> (Model, Cmd msg)
update msg model =
  case msg of
    LinkClicked urlRequest ->
      case urlRequest of
        Browser.Internal url ->
          ( model, Nav.pushUrl model.key (Url.toString url) )

        Browser.External href ->
          ( model, Nav.load href )

    UrlChanged url ->
      ( { model | url = url, route = toRoute url }
      , Cmd.none
      )

    UserLogin result ->
      case result of
        Ok user ->
          ({ model | user = Just user, error = Nothing }, Cmd.none)

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

    LoginMsg loginMsg ->
      updateLoginPage loginMsg model

updateLoginPage : LoginMsg -> Model -> (Model, Cmd msg)
updateLoginPage msg model =
  case msg of
    LoginRequest ->
      (model, Cmd.none)

    LoginInputEmail val ->

      (model, Cmd.none)

    LoginInputPassword val ->
      (model, Cmd.none)

-- Login Stuff --

-- type alias LoginModel =
--   { email : String
--   , password : String
--   }

-- type LoginMsg
--   = LoginRequest
--   | LoginInputEmail String
--   | LoginInputPassword String

-- validateLogin : LoginModel -> Result String ()
-- validateLogin model =
--   if String.isEmpty model.email then
--     Err "Preencha o Email"
--   else if String.isEmpty model.password then
--     Err "Preencha a Senha"
--   else
--     Ok ()


-- loginRequest model =
--   Http.post
--     { url = backendUrl ++ "/users/login"
--     , body = Http.jsonBody (loginEncoder model)
--     , expect = expectJson UserLogin loginDecoder
--     }

-- type ApiError
--   = BadUrl String
--   | Timeout
--   | NetworkError
--   | BadStatus Int String
--   | BadBody String

-- expectJson : (Result ApiError a -> msg) -> Decode.Decoder a -> Http.Expect msg
-- expectJson toMsg decoder =
--   Http.expectStringResponse toMsg <| \response ->
--     case response of
--       Http.BadUrl_ url ->
--         Err (BadUrl url)

--       Http.Timeout_ ->
--         Err Timeout

--       Http.NetworkError_ ->
--         Err NetworkError

--       Http.BadStatus_ metadata body ->
--         Err (BadStatus metadata.statusCode body)

--       Http.GoodStatus_ _ body ->
--         case Decode.decodeString decoder body of
--           Ok value ->
--             Ok value

--           Err err ->
--             Err (BadBody (Decode.errorToString err))

-- loginEncoder : LoginModel -> Encode.Value
-- loginEncoder model =
--   Encode.object
--     [ ("email", Encode.string model.email)
--     , ("password", Encode.string model.password)
--     ]



-- loginDecoder =
--   Field.requireAt ["user", "id"] Decode.string <| \id ->
--   Field.requireAt ["user", "username"] Decode.string <| \username ->
--   Field.requireAt ["user", "email"] Decode.string <| \email ->
--   Field.require "token" Decode.string <| \token ->

--   Decode.succeed
--     { id = id
--     , username = username
--     , email = email
--     , token = token
--     }



-- Sign In Stuff --

-- type alias SignInModel =
--   { email : String
--   , username : String
--   , password : String
--   , passwordAgain : String
--   }

-- validateSignIn : SignInModel -> Result String ()
-- validateSignIn model =
--   if String.isEmpty model.email then
--     Err "Preencha o Email"
--   else if String.isEmpty model.username then
--     Err "Preencha o Nome de Usuário"
--   else if String.isEmpty model.password then
--     Err "Preencha a Senha"
--   else if String.isEmpty model.passwordAgain then
--     Err "Repita a Senha"
--   else if model.password /= model.passwordAgain then
--     Err "Repita a Senha"
--   else
--     Ok ()

-- view --

view : Model -> Browser.Document RootMsg
view model =
  { title = "Riichi Gang"
  , body =
    [ viewNav model

    , case model.error of
      Just error ->
        viewError error
      Nothing ->
        text ""

    , case model.route of
      Home ->
        viewWelcomeCard
      NotFound ->
        p [] [ text "Not Found"]
      Login _ ->
        viewLoginCard

    ]
  }

viewNav : Model -> Html RootMsg
viewNav _ =
  nav [ class "bg-indigo-700 flex flex-wrap items-center p-3" ]
    [ div [ class "flex items-center flex-shrink-0 mr-2" ]
      [ img [ src "img/Nan2.svg", class "h-12 w-12" ] []
      , span [ class "text-white text-xl font-bold" ] [ text "Riichi Gang" ]
      ]

    , div [ class "flex-grow inline-flex justify-end mr-4"]
      [ a [ href "/clubes", class "link-white" ] [ text "Clubes" ]
      , a [ href "/torneios", class "link-white" ] [ text "Torneios" ]
      ]

    , div [ class "inline-flex" ]
      [ a [ href "/login", class "btn btn-indigo-800" ] [ text "Login" ]
      , a [ href "/sign-up", class "btn btn-indigo-800" ] [ text "Sign Up" ]
      ]
    ]

viewError : String -> Html RootMsg
viewError msg =
  div [ class "container rounded-lg bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded my-5 max-w-lg text-center" ]
    [ strong [ class "font-bold" ] [ text "Error!" ]
    , span [ class "block sm:inline" ] [ text msg ]
    ]

viewWelcomeCard : Html RootMsg
viewWelcomeCard  =
  div [ class "card card-indigo-900" ]
    [ h1 [ class "card-heading" ] [ text "Bem Vindo à Riichi Gang" ]
    , p [] [ text "Introdução completa as ser elaborada posteriormente" ]
    ]

viewLoginCard : Html RootMsg
viewLoginCard =
  div [ class "login-card" ]
    [ h1 [ class "card-heading" ] [ text "Login" ]
    , input [ type_ "email", placeholder "Email", class "login-input", onInput (\v -> LoginMsg (LoginInputEmail v)) ] []
    , input [ type_ "password", placeholder "Senha", class "login-input", onInput (\v -> LoginMsg (LoginInputPassword v)) ] []
    , button [ class "btn btn-indigo-500", onClick (LoginMsg LoginRequest) ] [ text "Login" ]
    ]

-- viewSingInCard : Html msg
-- viewSingInCard =
--   div [ class "login-card" ]
--     [ h1 [ class "card-heading" ] [ text "Sign Up" ]
--     , input [ type_ "email", placeholder "Email", class "login-input" ] []
--     , input [ type_ "email", placeholder "Nome de Usuário", class"login-input" ] []
--     , input [ type_ "password", placeholder "Senha", class "login-input" ] []
--     , input [ type_ "password", placeholder "Confirmação da Senha", class "login-input" ] []
--     , button [ class "btn btn-indigo-500" ] [ text "Login" ]
--     ]


subscriptions : Model -> Sub RootMsg
subscriptions _ =
  Sub.none
