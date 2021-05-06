module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url

import Api exposing (..)
import CommonHtml exposing (..)
import Session exposing (..)
import Page.Login as Login
import Page.SignUp as SignUp
import Route exposing (Route)
import Route exposing (Route(..))


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

type Model
  = Home Session
  | NotFound Session
  | Login Login.Model
  | SignUp SignUp.Model

type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | GotLoginMsg Login.Msg
  | GotSignUpMsg SignUp.Msg

init : () -> Url.Url -> Nav.Key -> (Model, Cmd Msg)
init _ url key =
  changeRouteTo (Route.fromUrl url) (Home (Anonymus key))

changeRouteTo : Maybe Route -> Model -> (Model, Cmd Msg)
changeRouteTo maybeRoute model =
  let
    session = toSession model
  in
    case maybeRoute of
      Nothing ->
        (NotFound session, Cmd.none)

      Just Route.Home ->
        (Home session, Cmd.none)

      Just Route.Login ->
        Login.init session
          |> updateWith Login GotLoginMsg

      Just Route.SignUp ->
        SignUp.init session
          |> updateWith SignUp GotSignUpMsg

toSession : Model -> Session
toSession model =
  case model of
    Home session ->
      session

    NotFound session ->
      session

    Login login ->
      Login.toSession login

    SignUp signup ->
      SignUp.toSession signup

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model) of
    ( LinkClicked urlRequest, _ ) ->
      case urlRequest of
        Browser.Internal url ->
          (model, Nav.pushUrl (Session.navKey (toSession model)) (Url.toString url))

        Browser.External href ->
          (model, Nav.load href)

    ( UrlChanged url, _ ) ->
      changeRouteTo (Route.fromUrl url) model

    ( GotLoginMsg subMsg, Login login) ->
      Login.update subMsg login
        |> updateWith Login GotLoginMsg

    (GotSignUpMsg subMsg, SignUp signUp) ->
      SignUp.update subMsg signUp
        |> updateWith SignUp GotSignUpMsg

    ( _, _) ->
      ( model, Cmd.none )

updateWith : (subModel -> Model) -> (subMsg -> Msg) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg)
updateWith toModel toMsg ( subModel, subCmd ) =
  ( toModel subModel
  , Cmd.map toMsg subCmd
  )


-- -- view --


view : Model -> Browser.Document Msg
view model =
  case model of
    Home session ->
      viewHome session

    NotFound session ->
      viewNotFound session

    Login subModel ->
      let
        page = Login.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotLoginMsg) page.body
      }

    SignUp subModel ->
      let
        page = SignUp.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotSignUpMsg) page.body
      }


viewHome : Session -> Browser.Document Msg
viewHome session =
  { title = "Riichi Gang"
  , body =
    [ viewNav session
    , viewWelcomeCard
    ]
  }

viewNotFound : Session -> Browser.Document Msg
viewNotFound session =
  { title = "Não Encontrado"
  , body =
    [ viewNav session
    , p [] [ text "Not Found"]
    ]
  }

viewWelcomeCard : Html Msg
viewWelcomeCard  =
  div [ class "card card-indigo-900" ]
    [ h1 [ class "card-heading" ] [ text "Bem Vindo à Riichi Gang" ]
    , p [] [ text "Introdução completa as ser elaborada posteriormente" ]
    ]

subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none
