module Page.User exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Encode as Encode
-- import Browser.Navigation as Nav

import Api exposing (..)
import ClubShort
import CommonHtml exposing (viewNav, errorCard)
import Model.Membership
import Model.Notification exposing (Notification)
import Model.Stats
import Model.TournamentShort
import Session exposing (..)
import User exposing (User)
import Viewer exposing (..)


-- data modeling --

type alias Model =
  { session : Session
  , state : State
  , error : Maybe String
  }

type State
  = Uninitialized
  | ViewAnonymus User
  | ViewProfile User
  | EditProfile User UpdateForm

type alias UpdateForm =
  { username : String
  , email : String
  , password : String
  , passwordAgain : String
  }

type Msg
  = GotUser (Result Api.ApiError User)
  | GotNotifications (Result Api.ApiError (List Notification))
  | EditUser
  | CancelEdit
  | ConfirmEdit
  | PatchUser (Result ApiError User)
  | InputUsername String
  | InputEmail String
  | InputPassword String
  | InputPasswordAgain String
  | NotificationAction String

init : Session -> Int -> (Model, Cmd Msg)
init session id =
  (Model session Uninitialized Nothing, get id)

get : Int -> Cmd Msg
get id =
  Http.get
    { url = Api.user id
    , expect = Api.expectJson GotUser User.userDecoder
    }

initState : Session -> User -> State
initState session user =
  case session of
    LoggedIn _ viewer ->
      if user.id == viewer.id then
        ViewProfile user
      else
        ViewAnonymus user

    Anonymus _ ->
      ViewAnonymus user


-- -- update --

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model.state) of
    (GotUser result, _) ->
      case result of
        Ok user ->
          ({ model | state = initState model.session user, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (GotNotifications result, ViewProfile user) ->
      case result of
        Ok notifications ->
          ({ model | state = ViewProfile { user | notifications = notifications } }, Cmd.none)

        Err error ->
          ({ model | error = Just (Api.errorToString error) }, Cmd.none)

    (EditUser, ViewProfile user) ->
      ({ model | state = EditProfile user (UpdateForm "" "" "" ""), error = Nothing }, Cmd.none)

    (CancelEdit, EditProfile user _) ->
      ({ model | state = ViewProfile user, error = Nothing }, Cmd.none)

    (ConfirmEdit, EditProfile user form) ->
      case validatePatch form of
        Ok _ ->
          case model.session of
            LoggedIn _ viewer ->
              (model, (requestPatch user form viewer))

            Anonymus _ ->
              ({ model | error = Just "De alguma forma, você não está logado" }, Cmd.none)

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    (PatchUser result, EditProfile _ _) ->
      case result of
        Ok user ->
          ({ model | state = ViewProfile user, error = Nothing }, Cmd.none)

        Err error ->
          ({ model | error = Just (errorToString error) }, Cmd.none)

    (InputUsername username, EditProfile user form) ->
      updateForm (\f -> { f | username = username }) user form model

    (InputEmail email, EditProfile user form) ->
      updateForm (\f -> { f | email = email }) user form model

    (InputPassword password, EditProfile user form) ->
      updateForm (\f -> { f | password = password }) user form model

    (InputPasswordAgain passwordAgain, EditProfile user form) ->
      updateForm (\f -> { f | passwordAgain = passwordAgain }) user form model

    (NotificationAction url, ViewProfile _) ->
      case Session.toViewer model.session of
        Just viewer ->
          ( model
          , Api.privatePost
            { url = url
            , body = Http.emptyBody
            , expect = Api.expectJson GotNotifications Model.Notification.listDecoder
            } viewer
          )

        Nothing ->
          ({ model | error = Just "You shouldn't be able to do this " }, Cmd.none)

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

updateForm : (UpdateForm -> UpdateForm) -> User -> UpdateForm -> Model -> (Model, Cmd msg)
updateForm transform user form model =
  ({ model | state = EditProfile user (transform form) }, Cmd.none)

validatePatch : UpdateForm -> Result String ()
validatePatch form =
  if String.isEmpty form.email && String.isEmpty form.username && String.isEmpty form.password then
    Err "Preencha ao menos um campo para ser atualizado"
  else if not (String.isEmpty form.password) && String.isEmpty form.passwordAgain then
    Err "Preencha a confirmação da senha"
  else if form.password /= form.passwordAgain then
    Err "As senhas não são iguais"
  else
    Ok ()

requestPatch : User -> UpdateForm -> Viewer -> Cmd Msg
requestPatch _ form viewer =
  Api.privatePut
    { url = Api.users
    , body = Http.jsonBody (patchEncoder form)
    , expect = expectJson PatchUser User.userDecoder
    } viewer

patchEncoder : UpdateForm -> Encode.Value
patchEncoder form =
  Encode.object
    [ ("username", if String.isEmpty form.username then Encode.null else Encode.string form.username)
    , ("email", if String.isEmpty form.email then Encode.null else Encode.string form.email)
    , ("password", if String.isEmpty form.password then Encode.null else Encode.string form.password)
    , ("passwordconfirmation", if String.isEmpty form.passwordAgain then Encode.null else Encode.string form.passwordAgain) -- might be wrong
    ]


-- view --

view : Model -> Browser.Document Msg
view model =
  let
    maybeUser = stateToUser model.state
  in
  { title = case maybeUser of
    Just user ->
      "Usuário - " ++ user.username

    Nothing ->
      "Usuário"

  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , viewUserCard model.state
    , viewOwnedClubs maybeUser
    , viewMemberships maybeUser
    , viewTournaments maybeUser
    , viewNotifications maybeUser
    , viewStats maybeUser
    ]
  }

viewUserCard : State -> Html Msg
viewUserCard state =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
  div []
    [ case state of
      Uninitialized ->
        p [] [ text "Carregando..." ]

      ViewAnonymus user ->
        div [ class divClass ]
          [ userCardElement "Usuário" user.username
          , userCardElement "Email" user.email
          ]

      ViewProfile user ->
        div [ class divClass ]
          [ userCardElement "Usuário" user.username
          , userCardElement "Email" user.email
          , button [ class "btn btn-indigo-500 mt-4", onClick EditUser ] [ text "Editar" ]
          ]

      EditProfile _ _ ->
        div [ class (divClass ++ " space-y-4") ]
          [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
          , input [ type_ "email", placeholder "Email", class "login-input", onInput InputEmail] []
          , input [ type_ "text", placeholder "Nome de Usuário", class "login-input", onInput InputUsername] []
          , input [ type_ "password", placeholder "Senha", class "login-input", onInput InputPassword] []
          , input [ type_ "password", placeholder "Confirmação da Senha", class "login-input", onInput InputPasswordAgain] []
          , button [ class "border-none btn btn-green-500", onClick ConfirmEdit ] [ text "Confirmar" ]
          , button [ class "border-none btn btn-red-500", onClick CancelEdit ] [ text "Cancelar" ]
          ]
    ]

userCardElement : String -> String -> Html msg
userCardElement title value = 
  div [ class "block" ]
    [ strong [ class "inline-block font-bold space-x-2" ] [ text title ]
    , span [ class "inline-block" ] [ text value ]
    ]

viewOwnedClubs : Maybe User -> Html Msg
viewOwnedClubs maybeUser =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Clubes do Usuário" ]

    , case maybeUser of
      Nothing ->
        p [] [ text "Nada ainda" ]

      Just user ->
        div [ class "space-y-4" ] (List.map ClubShort.view user.ownedClubs)

    , button [ class "border-transparent btn btn-indigo-500 mt-4" ] [ text "Novo" ] -- TODO implement after implementing the page

    ]

viewMemberships : Maybe User -> Html Msg
viewMemberships maybeUser =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Filiações" ]

    , case maybeUser of
      Nothing ->
        p [] [ text "Nada ainda" ]

      Just user ->
        div [ class "space-y-4" ] (List.map Model.Membership.view user.memberships)
    ]

viewTournaments : Maybe User -> Html Msg
viewTournaments maybeUser =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Torneios" ]

    , case maybeUser of
      Nothing ->
        p [] [ text "Nada ainda" ]

      Just user ->
        div [ class "space-y-4" ] (List.map Model.TournamentShort.view user.tournaments)

    ]

viewNotifications : Maybe User -> Html Msg
viewNotifications maybeUser =
  let
    transform = \n -> Model.Notification.view n
      (NotificationAction (Model.Notification.getConfirmUrl n))
      (NotificationAction (Model.Notification.getDenyUrl n))
  in
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Notificações" ]

    , case maybeUser of
      Nothing ->
        p [] [ text "Nada ainda" ]

      Just user ->
        div [ class "space-y-4" ] (List.map transform user.notifications)

    ]

viewStats : Maybe User -> Html Msg
viewStats maybeUser =
  case maybeUser of
    Nothing ->
      div [] []

    Just user ->
      Model.Stats.view user.stats

stateToUser : State -> Maybe User
stateToUser state =
  case state of
    Uninitialized ->
      Nothing

    ViewAnonymus user ->
      Just user

    ViewProfile user ->
      Just user

    EditProfile user _ ->
      Just user

toSession : Model -> Session
toSession model =
  model.session
