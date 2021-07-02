module CommonHtml exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Session exposing (Session)
import Viewer
import Url.Builder


viewNav : Session -> Html msg
viewNav session =
  nav [ class "bg-indigo-700 flex flex-wrap items-center p-3" ]
    [ div [ class "flex items-center flex-shrink-0 mr-2" ]
      [ img [ src "img/Nan2.svg", class "h-12 w-12" ] []
      , span [ class "text-white text-xl font-bold" ] [ text "Riichi Gang" ]
      ]

    , div [ class "flex-grow inline-flex justify-end mr-4"]
      [ a [ href "/clubs", class "link-white" ] [ text "Clubes" ]
      , a [ href "/tournaments", class "link-white" ] [ text "Torneios" ]
      ]

    , case session of
        Session.LoggedIn _ viewer ->
          let
            userUrl = Viewer.getUrl viewer
            logoutUrl = Url.Builder.absolute [ "logout" ] []
          in
          div [ class "inline-flex" ]
            [ a [ href userUrl, class "btn btn-indigo-800" ] [ text "Perfil" ]
            , a [ href logoutUrl, class "btn btn-indigo-800" ] [ text "Logout" ]
            ]

        Session.Anonymus _ ->
          div [ class "inline-flex" ]
            [ a [ href "/login", class "btn btn-indigo-800" ] [ text "Login" ]
            , a [ href "/signup", class "btn btn-indigo-800" ] [ text "Sign Up" ]
            ]
    ]

errorCard : String -> Html msg
errorCard msg =
  div [ class "container rounded-lg bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded my-5 max-w-lg text-center" ]
    [ strong [ class "font-bold" ] [ text "Erro! " ]
    , span [ class "block sm:inline" ] [ text msg ]
    ]

cardElement : String -> String -> Html msg
cardElement title value =
  div [ class "block" ]
    [ strong [ class "inline-block font-bold" ] [ text title ]
    , span [ class "inline-block pl-2" ] [ text value ]
    ]
