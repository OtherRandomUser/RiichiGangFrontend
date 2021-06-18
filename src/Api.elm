module Api exposing (..)

import Http
import Json.Decode as Decode
import Viewer exposing (Viewer)

type ApiError
  = BadUrl String
  | Timeout
  | NetworkError
  | BadStatus Int String
  | BadBody String


-- Api Routes --

backendUrl : String
backendUrl = "https://localhost:5001/api"

users : String
users = backendUrl ++ "/users"

user : Int -> String
user id = backendUrl ++ "/users/" ++ (String.fromInt id)

clubs : String
clubs = backendUrl ++ "/clubs"

club : Int -> String
club id = backendUrl ++ "/clubs/" ++ (String.fromInt id)

clubMembers : Int -> String
clubMembers id = (club id) ++ "/members"

clubInvite : Int -> String
clubInvite id = (clubMembers id) ++ "/invite"

clubMember : Int -> Int -> String
clubMember clubId userId = (clubMembers clubId) ++ "/" ++ (String.fromInt userId)

clubRulesets : Int -> String
clubRulesets clubId = String.concat [club clubId, "/rulesets"]

clubRuleset : Int -> Int -> String
clubRuleset clubId rulesetId = String.concat [clubRulesets clubId, "/", String.fromInt rulesetId]

tournaments : String
tournaments = backendUrl ++ "/tournaments"

tournament : Int -> String
tournament id = String.concat [tournaments, "/", String.fromInt id]

tournamentInit : Int -> String
tournamentInit id = String.concat [tournament id, "/init"]

tournamentPlayers : Int -> String
tournamentPlayers tournamentId = String.concat [tournament tournamentId, "/players"]

tournamentPlayer : Int -> Int -> String
tournamentPlayer tournamentId playerId = String.concat [tournamentPlayers tournamentId, "/", String.fromInt playerId]

joinTournament : Int -> String
joinTournament tournamentId = String.concat [tournamentPlayers tournamentId, "/invite"]


-- Request Utils --

expectJson : (Result ApiError a -> msg) -> Decode.Decoder a -> Http.Expect msg
expectJson toMsg decoder =
  Http.expectStringResponse toMsg <| \response ->
    case response of
      Http.BadUrl_ url ->
        Err (BadUrl url)

      Http.Timeout_ ->
        Err Timeout

      Http.NetworkError_ ->
        Err NetworkError

      Http.BadStatus_ metadata body ->
        Err (BadStatus metadata.statusCode body)

      Http.GoodStatus_ _ body ->
        case Decode.decodeString decoder body of
          Ok value ->
            Ok value

          Err err ->
            Err (BadBody (Decode.errorToString err))

expectWhatever : (Result ApiError () -> msg) -> Http.Expect msg
expectWhatever toMsg =
  Http.expectStringResponse toMsg <| \response ->
    case response of
      Http.BadUrl_ url ->
        Err (BadUrl url)

      Http.Timeout_ ->
        Err Timeout

      Http.NetworkError_ ->
        Err NetworkError

      Http.BadStatus_ metadata body ->
        Err (BadStatus metadata.statusCode body)

      Http.GoodStatus_ _ _ ->
        Ok ()

errorToString : ApiError -> String
errorToString error =
  case error of
    BadUrl url ->
      "Url inválida: " ++ url

    Timeout ->
      "Erro de timeout, tente novamente"

    NetworkError ->
      "Erro de rede, verifique a sua conexão e tente novamente"

    BadStatus _ body ->
      body

    BadBody body ->
      "Falha interna: " ++ body

privatePost : { url : String, body : Http.Body, expect : Http.Expect msg } -> Viewer -> Cmd msg
privatePost r viewer =
  Http.request
    { method = "POST"
    , headers = [ Http.header "bearer" viewer.token ]
    , url = r.url
    , body = r.body
    , expect = r.expect
    , timeout = Nothing
    , tracker = Nothing
    }

privatePut : { url : String, body : Http.Body, expect : Http.Expect msg } -> Viewer -> Cmd msg
privatePut r viewer =
  Http.request
    { method = "PUT"
    , headers = [ Http.header "Authorization" ("bearer " ++ viewer.token) ]
    , url = r.url
    , body = r.body
    , expect = r.expect
    , timeout = Nothing
    , tracker = Nothing
    }

privateGet : { url : String, expect : Http.Expect msg } -> Viewer -> Cmd msg
privateGet r viewer =
  Http.request
    { method = "GET"
    , headers = [ Http.header "Authorization" ("bearer " ++ viewer.token) ]
    , url = r.url
    , body = Http.emptyBody
    , expect = r.expect
    , timeout = Nothing
    , tracker = Nothing
    }

privateDelete : { url : String, expect : Http.Expect msg } -> Viewer -> Cmd msg
privateDelete r viewer =
  Http.request
    { method = "DELETE"
    , headers = [ Http.header "Authorization" ("bearer " ++ viewer.token) ]
    , url = r.url
    , body = Http.emptyBody
    , expect = r.expect
    , timeout = Nothing
    , tracker = Nothing
    }
