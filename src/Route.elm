module Route exposing (..)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, int)

type Route
  = Home
  | Login
  | Logout
  | SignUp
  | Clubs
  | NewClub
  | Club Int
  | Ruleset Int Int
  | Tournaments
  | NewTournament Int
  | Tournament Int
  | Bracket Int Int
  | User Int

parser : Parser (Route -> c) c
parser =
  oneOf
    [ Parser.map Home Parser.top
    , Parser.map Login (s "login")
    , Parser.map Logout (s "logout")
    , Parser.map SignUp (s "signup")
    , Parser.map Clubs (s "clubs")
    , Parser.map NewClub (s "clubs" </> s "new")
    , Parser.map Club (s "clubs" </> int)
    , Parser.map Ruleset (s "clubs" </> int </> s "rulesets" </> int)
    , Parser.map Tournaments (s "tournaments")
    , Parser.map Tournament (s "tournaments" </> s "new" </> int)
    , Parser.map Tournament (s "tournaments" </> int)
    , Parser.map Bracket (s "tournaments" </> int </> s "brackets" </> int)
    , Parser.map User (s "users" </> int)
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

    Logout ->
      [ "logout" ]

    SignUp ->
      [ "signup" ]

    Clubs ->
      [ "clubs" ]

    NewClub ->
      [ "clubs", "new" ]

    Club id ->
      [ "clubs", String.fromInt id ]

    Ruleset clubId rulesetId ->
      [ "clubs", (String.fromInt clubId), "rulesets", (String.fromInt rulesetId) ]

    Tournaments ->
      [ "tournaments" ]

    NewTournament clubId ->
      [ "tournaments", "new", (String.fromInt clubId) ]

    Tournament tournamentId ->
      [ "tournaments", (String.fromInt tournamentId) ]

    Bracket tournamentId bracketId ->
      [ "tournaments", (String.fromInt tournamentId), "brackets", (String.fromInt bracketId) ]

    User id ->
      [ "users", String.fromInt id ]
