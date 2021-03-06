module Session exposing (..)

import Browser.Navigation as Nav

import Viewer exposing (..)

type Session
  = LoggedIn Nav.Key Viewer
  | Anonymus Nav.Key

navKey : Session -> Nav.Key
navKey session =
  case session of
    LoggedIn key _ ->
      key

    Anonymus key ->
      key

toViewer : Session -> Maybe Viewer
toViewer session =
  case session of
    LoggedIn _ viewer ->
      Just viewer

    Anonymus _ ->
      Nothing