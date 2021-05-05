module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Url
import Url.Parser as UrlP

import Page.Login as Login

main : Program () Model Msg
main =
  Browser.application
    { init = init
    , update = update
    , view = view
    , subscriptions = subscriptions
    , onUrlChange = UrlChanged
    , onUrlRequest = LinkClicked
    }

type alias Model =
  { key : Nav.Key
  , url : Url.Url
  , route : Route
  , user : Maybe Login.User
  , error : Maybe String
  }

type Route
  = Home
  | NotFound
  | Login

type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | LoginMsg Login.Msg

init : () -> Url.Url -> Nav.Key -> (Model, Cmd Msg)
init _ url key =
  ( Model key url Home Nothing Nothing
  , Cmd.none
  )

routeParser : UrlP.Parser (Route -> c) c
routeParser =
  UrlP.oneOf
    [ UrlP.map Home UrlP.top
    , UrlP.map Login (UrlP.s "login")
    ]

toRoute : Url.Url -> Route
toRoute url =
  Maybe.withDefault NotFound (UrlP.parse routeParser url)

update : Msg -> Model -> (Model, Cmd msg)
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


-- view --

view : Model -> Browser.Document Msg
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
      Login ->
        Login.viewLoginCard

    ]
  }

viewNav : Model -> Html Msg
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

viewError : String -> Html Msg
viewError msg =
  div [ class "container rounded-lg bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded my-5 max-w-lg text-center" ]
    [ strong [ class "font-bold" ] [ text "Error!" ]
    , span [ class "block sm:inline" ] [ text msg ]
    ]

viewWelcomeCard : Html Msg
viewWelcomeCard  =
  div [ class "card card-indigo-900" ]
    [ h1 [ class "card-heading" ] [ text "Bem Vindo à Riichi Gang" ]
    , p [] [ text "Introdução completa as ser elaborada posteriormente" ]
    ]


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none
