module Page.User exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Encode as Encode
-- import Browser.Navigation as Nav

import Api exposing (..)
import CommonHtml exposing (viewNav, errorCard)
import Session exposing (..)
import User exposing (User)
import Viewer exposing (..)
import ClubShort exposing (ClubShort)


-- data modeling --

type alias Model =
  { session : Session
  , user : User
  , state : State
  , error : Maybe String
  }

type State
  = ViewAnonymus
  | ViewProfile
  | EditProfile UpdateForm

type alias UpdateForm =
  { username : String
  , email : String
  , password : String
  , passwordAgain : String
  }

type Msg
  = EditUser
  | CancelEdit
  | ConfirmEdit
  | PatchUser (Result ApiError User)
  | InputUsername String
  | InputEmail String
  | InputPassword String
  | InputPasswordAgain String

init : Session -> User -> (Model, Cmd Msg)
init session user =
  ( { session = session
    , user = user
    , state = initState session user
    , error = Nothing
    }
  , Cmd.none
  )

initState : Session -> User -> State
initState session user =
  case session of
    LoggedIn _ viewer ->
      if user.id == viewer.id then
        ViewProfile
      else
        ViewAnonymus

    Anonymus _ ->
      ViewAnonymus

-- -- update --

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case (msg, model.state) of
    (EditUser, _) ->
      ({ model | state = EditProfile (UpdateForm "" "" "" ""), error = Nothing }, Cmd.none)

    (CancelEdit, EditProfile _) ->
      ({ model | state = ViewProfile, error = Nothing }, Cmd.none)

    (ConfirmEdit, EditProfile form) ->
      case validatePatch form of
        Ok _ ->
          case model.session of
            LoggedIn _ viewer ->
              (model, (requestPatch model.user form viewer))

            Anonymus _ ->
              ({ model | error = Just "De alguma forma, você não está logado" }, Cmd.none)

        Err err ->
          ({ model | error = Just err}, Cmd.none)

    (PatchUser result, EditProfile _) ->
      case result of
        Ok user ->
          ({ model | user = user, error = Nothing, state = ViewProfile }, Cmd.none)

        Err error ->
          ({ model | error = Just (errorToString error) }, Cmd.none)

    (InputUsername username, EditProfile form) ->
      updateForm (\f -> { f | username = username }) form model

    (InputEmail email, EditProfile form) ->
      updateForm (\f -> { f | email = email }) form model

    (InputPassword password, EditProfile form) ->
      updateForm (\f -> { f | password = password }) form model

    (InputPasswordAgain passwordAgain, EditProfile form) ->
      updateForm (\f -> { f | passwordAgain = passwordAgain }) form model

    (_, _) ->
      ({ model | error = Just "Estado inválido" }, Cmd.none)

updateForm : (UpdateForm -> UpdateForm) -> UpdateForm -> Model -> (Model, Cmd msg)
updateForm transform form model =
  ({ model | state = EditProfile (transform form) }, Cmd.none)

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
requestPatch user form viewer =
  Api.privatePatch
    { url = Api.user user.id
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
  { title = "Login"
  , body =
    [ viewNav model.session

    , case model.error of
      Just error ->
        errorCard error
      Nothing ->
        text ""

    , viewUserCard model.user model.state
    , viewOwnedClubs model.user.ownedClubs
    , p [] [ text "TODO filiacoes" ]
    , p [] [ text "TODO torneios" ]
    , p [] [ text "TODO notificações" ]
    ]
  }

viewUserCard : User -> State -> Html Msg
viewUserCard user state =
  let
    divClass = "container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg"
  in
  case state of
    ViewAnonymus ->
      div [ class divClass ]
        [ userCardElement "Usuário" user.username
        , userCardElement "Email" user.email
        ]

    ViewProfile ->
      div [ class divClass ]
        [ userCardElement "Usuário" user.username
        , userCardElement "Email" user.email
        , button [ class "btn btn-indigo-500 mt-4", onClick EditUser ] [ text "Editar" ]
        ]

    EditProfile _ ->
      div [ class divClass ]
        [ p [] [ text "Preencha os campos que deseja atualizar e pressione confirmar" ]
        , input [ type_ "email", placeholder "Email", class "login-input", onInput InputEmail] []
        , input [ type_ "text", placeholder "Nome de Usuário", class "login-input", onInput InputUsername] []
        , input [ type_ "password", placeholder "Senha", class "login-input", onInput InputPassword] []
        , input [ type_ "password", placeholder "Confirmação da Senha", class "login-input", onInput InputPasswordAgain] []
        , button [ class "border-none btn btn-green-500", onClick ConfirmEdit ] [ text "Confirmar" ]
        , button [ class "border-none btn btn-red-500", onClick CancelEdit ] [ text "Cancelar" ]
        ]

userCardElement : String -> String -> Html msg
userCardElement title value = 
  div [ class "block" ]
    [ strong [ class "inline-block font-bold" ] [ text title ]
    , span [ class "inline-block" ] [ text value ]
    ]

viewOwnedClubs : List ClubShort -> Html Msg
viewOwnedClubs clubs =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text "Clubes do Usuário" ]
    , div [ class "space-y-4" ] (List.map ClubShort.view clubs)
    , button [ class "border-transparent btn btn-indigo-500 mt-4" ] [ text "Novo" ] -- TODO implement after implementing the page
    ]

toSession : Model -> Session
toSession model =
  model.session
