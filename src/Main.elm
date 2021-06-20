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
import Page.Tournament
import Page.Bracket
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
  | NewClub ClubPage.Model
  | Club ClubPage.Model
  | Tournaments Page.Tournaments.Model
  | NewTournament Page.Tournament.Model
  | Tournament Page.Tournament.Model
  | Ruleset Page.Ruleset.Model
  | Bracket Page.Bracket.Model
  | User User.Model

type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | GotLoginMsg Login.Msg
  | GotSignUpMsg SignUp.Msg
  | GotClubsMsg ClubsPage.Msg
  | GotNewClubMsg ClubPage.Msg
  | GotClubMsg ClubPage.Msg
  | GotRulesetMsg Page.Ruleset.Msg
  | GotTournamentsMsg Page.Tournaments.Msg
  | GotNewTournamentMsg Page.Tournament.Msg
  | GotTournamentMsg Page.Tournament.Msg
  | GotBracketMsg Page.Bracket.Msg
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

      Just Route.NewClub ->
        ClubPage.initNew session
          |> updateWith NewClub GotNewClubMsg

      Just (Route.Club clubId) ->
        ClubPage.init session clubId
          |> updateWith Club GotClubMsg

      Just (Route.Ruleset clubId rulesetId) ->
        Page.Ruleset.initGet session clubId rulesetId
          |> updateWith Ruleset GotRulesetMsg

      Just (Route.Tournaments) ->
        Page.Tournaments.init session
          |> updateWith Tournaments GotTournamentsMsg

      Just (Route.NewTournament clubId) ->
        Page.Tournament.initNew session clubId
          |> updateWith NewTournament GotNewTournamentMsg

      Just (Route.Tournament tournamentId) ->
        Page.Tournament.init session tournamentId
          |> updateWith Tournament GotTournamentMsg

      Just (Route.Bracket tournamentId bracketId) ->
        Page.Bracket.init session tournamentId bracketId
          |> updateWith Bracket GotBracketMsg

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

    NewClub club ->
      ClubPage.toSession club

    Club club ->
      ClubPage.toSession club

    Ruleset ruleset ->
      Page.Ruleset.toSession ruleset

    Tournaments tournaments ->
      Page.Tournaments.toSession tournaments

    NewTournament tournament ->
      Page.Tournament.toSession tournament

    Tournament tournament ->
      Page.Tournament.toSession tournament

    Bracket bracket ->
      Page.Bracket.toSession bracket

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

    (GotLoginMsg _, _) ->
      (model, Cmd.none)

    (GotSignUpMsg subMsg, SignUp signUp) ->
      SignUp.update subMsg signUp
        |> updateWith SignUp GotSignUpMsg

    (GotSignUpMsg _, _) ->
      (model, Cmd.none)

    (GotClubsMsg subMsg, Clubs clubs) ->
      ClubsPage.update subMsg clubs
        |> updateWith Clubs GotClubsMsg

    (GotClubsMsg _, _) ->
      (model, Cmd.none)

    (GotNewClubMsg subMsg, NewClub club) ->
      ClubPage.update subMsg club
        |> updateWith NewClub GotNewClubMsg

    (GotNewClubMsg _, _) ->
      (model, Cmd.none)

    (GotClubMsg subMsg, Club club) ->
      ClubPage.update subMsg club
        |> updateWith Club GotClubMsg

    (GotClubMsg _, _) ->
      (model, Cmd.none)

    (GotTournamentsMsg subMsg, Tournaments tournaments) ->
      Page.Tournaments.update subMsg tournaments
        |> updateWith Tournaments GotTournamentsMsg

    (GotTournamentsMsg _, _) ->
      (model, Cmd.none)

    (GotNewTournamentMsg subMsg, NewTournament newTournament) ->
      Page.Tournament.update subMsg newTournament
        |> updateWith NewTournament GotNewTournamentMsg

    (GotNewTournamentMsg _, _) ->
      (model, Cmd.none)

    (GotTournamentMsg subMsg, Tournament tournament) ->
      Page.Tournament.update subMsg tournament
        |> updateWith NewTournament GotNewTournamentMsg

    (GotTournamentMsg _, _) ->
      (model, Cmd.none)

    (GotRulesetMsg subMsg, Ruleset ruleset) ->
      Page.Ruleset.update subMsg ruleset
        |> updateWith Ruleset GotRulesetMsg

    (GotRulesetMsg _, _) ->
      (model, Cmd.none)

    (GotBracketMsg subMsg, Bracket bracket) ->
      Page.Bracket.update subMsg bracket
        |> updateWith Bracket GotBracketMsg

    (GotBracketMsg _, _) ->
      (model, Cmd.none)

    (GotUserMsg subMsg, User user) ->
      User.update subMsg user
        |> updateWith User GotUserMsg

    (GotUserMsg _, _) ->
      (model, Cmd.none)

updateWith : (subModel -> Model) -> (subMsg -> Msg) -> (subModel, Cmd subMsg) -> (Model, Cmd Msg)
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

    NewClub subModel ->
      let
        page = ClubPage.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotClubMsg) page.body
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

    NewTournament subModel ->
      let
        page = Page.Tournament.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotTournamentMsg) page.body
      }

    Tournament subModel ->
      let
        page = Page.Tournament.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotTournamentMsg) page.body
      }

    Bracket subModel ->
      let
        page = Page.Bracket.view subModel
      in
      { title = page.title
      , body = List.map (Html.map GotBracketMsg) page.body
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
