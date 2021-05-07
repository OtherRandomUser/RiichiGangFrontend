module CommonHtml exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Api
import Session exposing (Session)


viewNav : Session -> Html msg
viewNav session =
  nav [ class "bg-indigo-700 flex flex-wrap items-center p-3" ]
    [ div [ class "flex items-center flex-shrink-0 mr-2" ]
      [ img [ src "img/Nan2.svg", class "h-12 w-12" ] []
      , span [ class "text-white text-xl font-bold" ] [ text "Riichi Gang" ]
      ]

    , div [ class "flex-grow inline-flex justify-end mr-4"]
      [ a [ href "/clubs", class "link-white" ] [ text "Clubes" ]
      , a [ href "/torneios", class "link-white" ] [ text "Torneios" ]
      ]

    , case session of
        Session.LoggedIn _ _ ->
          div [ class "inline-flex" ]
            [ a [ href "/perfil", class "btn btn-indigo-800" ] [ text "Perfil" ]
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