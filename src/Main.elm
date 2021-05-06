module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
-- import Html.Events exposing (..)
-- import Http
-- import Json.Decode as Decode
-- import Json.Decode.Field as Field
-- import Json.Encode as Encode
import Url

import Api exposing (..)
import CommonHtml exposing (..)
import Session exposing (..)
-- import User exposing (..)
import Page.Login as Login
import Route exposing (Route)


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

type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | GotLoginMsg Login.Msg
  -- | UserLogin (Result ApiError User)
  -- | LoginMsg LoginMsg

init : () -> Url.Url -> Nav.Key -> (Model, Cmd Msg)
init _ _ key =
  ( Home (Anonymus key)
  , Cmd.none
  )

changeRouteTo : Maybe Route -> Model -> (Model, Cmd msg)
changeRouteTo maybeRoute model =
  let
    session = toSession model
  in
    case maybeRoute of
      Nothing ->
        (NotFound session, Cmd.none)

      Just Route.Home ->
        (model, Route.replaceUrl (Session.navKey session) Route.Home)

      Just Route.Login ->
        (model, Route.replaceUrl (Session.navKey session) Route.Login)



toSession : Model -> Session
toSession model =
  case model of
    Home session ->
      session

    NotFound session ->
      session

    Login login ->
      Login.toSession login

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model) of
    ( LinkClicked urlRequest, _ ) ->
      case urlRequest of
        Browser.Internal url ->
          case url.fragment of
            Nothing ->
              ( model, Cmd.none)

            Just _ ->
              ( model, Nav.pushUrl (Session.navKey (toSession model)) (Url.toString url))

        Browser.External href ->
          ( model, Nav.load href )

    ( UrlChanged url, _ ) ->
      changeRouteTo (Route.fromUrl url) model

    ( GotLoginMsg subMsg, Login login) ->
      Login.update subMsg login
        |> updateWith Login GotLoginMsg

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



  -- { title = "Riichi Gang"
  -- , body =
  --   [ viewNav model

  --   , case model.error of
  --     Just error ->
  --       viewError error
  --     Nothing ->
  --       text ""

  --   , case model.route of
  --     Home ->
  --       viewWelcomeCard
  --     NotFound ->
  --       p [] [ text "Not Found"]
  --     Login _ ->
  --       Html.map LoginMsg viewLoginCard

  --   ]
  -- }

-- viewNav : Model -> Html RootMsg
-- viewNav model =
--   nav [ class "bg-indigo-700 flex flex-wrap items-center p-3" ]
--     [ div [ class "flex items-center flex-shrink-0 mr-2" ]
--       [ img [ src "img/Nan2.svg", class "h-12 w-12" ] []
--       , span [ class "text-white text-xl font-bold" ] [ text "Riichi Gang" ]
--       ]

--     , div [ class "flex-grow inline-flex justify-end mr-4"]
--       [ a [ href "/clubes", class "link-white" ] [ text "Clubes" ]
--       , a [ href "/torneios", class "link-white" ] [ text "Torneios" ]
--       ]

--     , case model.user of
--         Just _ ->
--           div [ class "inline-flex" ]
--             [ a [ href "/perfil", class "btn btn-indigo-800" ] [ text "Perfil" ]
--             ]

--         Nothing ->
--           div [ class "inline-flex" ]
--             [ a [ href "/login", class "btn btn-indigo-800" ] [ text "Login" ]
--             , a [ href "/sign-up", class "btn btn-indigo-800" ] [ text "Sign Up" ]
--             ]
--     ]

-- viewError : String -> Html RootMsg
-- viewError msg =
--   div [ class "container rounded-lg bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded my-5 max-w-lg text-center" ]
--     [ strong [ class "font-bold" ] [ text "Erro! " ]
--     , span [ class "block sm:inline" ] [ text msg ]
--     ]

viewWelcomeCard : Html Msg
viewWelcomeCard  =
  div [ class "card card-indigo-900" ]
    [ h1 [ class "card-heading" ] [ text "Bem Vindo à Riichi Gang" ]
    , p [] [ text "Introdução completa as ser elaborada posteriormente" ]
    ]

-- viewLoginCard : Html LoginMsg
-- viewLoginCard =
--   div [ class "login-card" ]
--     [ h1 [ class "card-heading" ] [ text "Login" ]
--     , input [ type_ "email", placeholder "Email", class "login-input", onInput LoginInputEmail ] []
--     , input [ type_ "password", placeholder "Senha", class "login-input", onInput LoginInputPassword ] []
--     , button [ class "btn btn-indigo-500", onClick LoginRequest ] [ text "Login" ]
--     ]

subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none
