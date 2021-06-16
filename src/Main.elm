module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url

import Api exposing (..)
import CommonHtml exposing (..)
import Session exposing (..)
import Page.Club as ClubPage
import Page.Clubs as ClubsPage
import Page.Login as Login
import Page.Ruleset
import Page.SignUp as SignUp
import Page.Tournaments
import Page.User as User
import Route exposing (Route)
import Route exposing (Route(..))
import Url.Builder


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
  | Clubs ClubsPage.Model
  | Club ClubPage.Model
  | Ruleset Page.Ruleset.Model
  | Tournaments Page.Tournaments.Model
  | User User.Model

type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | GotLoginMsg Login.Msg
  | GotSignUpMsg SignUp.Msg
  | GotClubsMsg ClubsPage.Msg
  | GotClubMsg ClubPage.Msg
  | GotRulesetMsg Page.Ruleset.Msg
  | GotTournamentsMsg Page.Tournaments.Msg
  | GotUserMsg User.Msg

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

      Just Route.Logout ->
        let
          navKey = Session.navKey session
        in
        (Home (Anonymus navKey), Nav.pushUrl navKey (Url.Builder.absolute [] []))

      Just Route.SignUp ->
        SignUp.init session
          |> updateWith SignUp GotSignUpMsg

      Just Route.Clubs ->
        ClubsPage.init session
          |> updateWith Clubs GotClubsMsg

      Just (Route.Club clubId) ->
        ClubPage.init session clubId
          |> updateWith Club GotClubMsg

      Just (Route.Ruleset clubId rulesetId) ->
        Page.Ruleset.initGet session clubId rulesetId
          |> updateWith Ruleset GotRulesetMsg

      Just (Route.Tournaments) ->
        Page.Tournaments.init session
          |> updateWith Tournaments GotTournamentsMsg

      Just (Route.User userId) ->
        User.init session userId
          |> updateWith User GotUserMsg

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

    Clubs clubs ->
      ClubsPage.toSession clubs

    Club club ->
      ClubPage.toSession club

    Ruleset ruleset ->
      Page.Ruleset.toSession ruleset

    Tournaments tournaments ->
      Page.Tournaments.toSession tournaments

    User user ->
      User.toSession user

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model) of
    (LinkClicked urlRequest, _) ->
      case urlRequest of
        Browser.Internal url ->
          (model, Nav.pushUrl (Session.navKey (toSession model)) (Url.toString url))

        Browser.External href ->
          (model, Nav.load href)

    (UrlChanged url, _) ->
      changeRouteTo (Route.fromUrl url) model

    (GotLoginMsg subMsg, Login login) ->
      Login.update subMsg login
        |> updateWith Login GotLoginMsg

    (GotSignUpMsg subMsg, SignUp signUp) ->
      SignUp.update subMsg signUp
        |> updateWith SignUp GotSignUpMsg

    (GotClubsMsg subMsg, Clubs clubs) ->
      ClubsPage.update subMsg clubs
        |> updateWith Clubs GotClubsMsg

    (GotClubMsg subMsg, Club club) ->
      ClubPage.update subMsg club
        |> updateWith Club GotClubMsg

    (GotUserMsg subMsg, User user) ->
      User.update subMsg user
        |> updateWith User GotUserMsg

    (_, _) ->
      (model, Cmd.none)

updateWith : (subModel -> Model) -> (subMsg -> Msg) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg)
updateWith toModel toMsg ( subModel, subCmd ) =
  ( toModel subModel
  , Cmd.map toMsg subCmd
  )


-- view --


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

    Clubs subModel ->
      let
        page = ClubsPage.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotClubsMsg) page.body
      }

    Club subModel ->
      let
        page = ClubPage.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotClubMsg) page.body
      }

    Ruleset subModel ->
      let
        page = Page.Ruleset.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotRulesetMsg) page.body
      }

    Tournaments subModel ->
      let
        page = Page.Tournaments.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotTournamentsMsg) page.body
      }

    User subModel ->
      let
        page = User.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotUserMsg) page.body
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
