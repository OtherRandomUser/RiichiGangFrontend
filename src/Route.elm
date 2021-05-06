module Route exposing (..)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string)

type Route
  = Home
  | Login
  | SignUp

parser : Parser (Route -> c) c
parser =
  oneOf
    [ Parser.map Home Parser.top
    , Parser.map Login (s "login")
    , Parser.map SignUp (s "signup")
    ]

href : Route -> Attribute msg
href targetRoute =
  Attr.href (routeToString targetRoute)

replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
  Nav.replaceUrl key (routeToString route)

fromUrl : Url -> Maybe Route
fromUrl url =
  -- { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
  --   |> Parser.parse parser
  Parser.parse parser url

-- Internal --


routeToString : Route -> String
routeToString route =
  String.join "/" (routeToPieces route)

routeToPieces : Route -> List String
routeToPieces route =
  case route of
    Home ->
      []

    Login ->
      [ "login" ]

    SignUp ->
      [ "signup" ]
