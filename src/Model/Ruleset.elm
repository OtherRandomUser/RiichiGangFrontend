module Model.Ruleset exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Json.Decode.Field as Field
import Url.Builder


type alias Ruleset =
  { id : Int
  , createdAt : String
  , name : String
  , mochiten : Int
  , genten : Int
  , uma : String
  , oka : Int
  , atozuke : String
  , kuitan : String
  , kuikae : String
  , uradora : String
  , kandora : String
  , kanuradora : String
  , akadora : String
  , agariyame : String
  , tenpaiyame : String
  , tobi : String
  }


decoder : Decode.Decoder Ruleset
decoder =
  Field.require "id" Decode.int <| \id ->
  Field.require "createdAt" Decode.string <| \createdAt ->
  Field.require "name" Decode.string <| \name ->
  Field.require "mochiten" Decode.int <| \mochiten ->
  Field.require "genten" Decode.int <| \genten ->
  Field.require "uma" Decode.string<| \uma ->
  Field.require "oka" Decode.int <| \oka ->
  Field.require "atozuke" Decode.string <| \atozuke ->
  Field.require "kuitan" Decode.string <| \kuitan ->
  Field.require "kuikae" Decode.string <| \kuikae ->
  Field.require "uraDora" Decode.string <| \uradora ->
  Field.require "kanDora" Decode.string <| \kandora ->
  Field.require "kanUraDora" Decode.string <| \kanuradora ->
  Field.require "akaDora" Decode.string <| \akadora ->
  Field.require "agariYame" Decode.string <| \agariyame ->
  Field.require "tenpaiYame" Decode.string <| \tenpaiyame ->
  Field.require "tobi" Decode.string <| \tobi ->

  Decode.succeed
    { id = id
    , createdAt = createdAt
    , name = name
    , mochiten = mochiten
    , genten = genten
    , uma = uma
    , oka = oka
    , atozuke = atozuke
    , kuitan = kuitan
    , kuikae = kuikae
    , uradora = uradora
    , kandora = kandora
    , kanuradora = kanuradora
    , akadora = akadora
    , agariyame = agariyame
    , tenpaiyame = tenpaiyame
    , tobi = tobi
    }

listDecoder : Decode.Decoder (List Ruleset)
listDecoder =
  Decode.list decoder

view : Ruleset -> Html msg
view ruleset =
  div [ class "m-2" ]
    [ h1 [ class "list-heading" ] [ text ("Regras - " ++ ruleset.name) ]
    , div [ class "space-y-4" ]
      [ viewRule "mochiten" (String.fromInt ruleset.mochiten) mochitenDescr
      , viewRule "genten" (String.fromInt ruleset.genten) gentenDescr
      , viewRule "uma" ruleset.uma umaDescr
      , viewRule "oka" (String.fromInt ruleset.oka) okaDescr
      , viewRule "atozuke" ruleset.atozuke atozukeDescr
      , viewRule "kuitan" ruleset.kuitan kuitanDescr
      , viewRule "kuikae" ruleset.kuikae kuikaeDescr
      , viewRule "uradora" ruleset.uradora uradoraDescr
      , viewRule "kandora" ruleset.kandora kandoraDescr
      , viewRule "kanuradora" ruleset.kanuradora kanuradoraDescr
      , viewRule "akadora" ruleset.akadora akadoraDescr
      , viewRule "agariyame" ruleset.agariyame agariyameDescr
      , viewRule "tenpaiyame" ruleset.tenpaiyame tenpaiyameDescr
      , viewRule "tobi" ruleset.tobi tobiDescr
      ]
    ]

viewRule : String -> String -> String -> Html msg
viewRule rule value description =
  div [ class "list-item" ]
    [ p [ class "py-2 has-tooltip" ]
      [ text rule
      , span [ class "tooltip rounded shadow-lg p-1 bg-black text-white -mt-8" ]
        [ text description
        ]
      ]
    , p [ class "py-2" ]
      [ text value
      ]
    ]

mochitenDescr : String
mochitenDescr = "Quantidade de pontos que cada jogador possui no in??cio da partida"

gentenDescr : String
gentenDescr = "Quantidade m??nima de pontos que o jogador em primeiro lugar precisa atingir ao fim da partida"

umaDescr : String
umaDescr = "Pontua????o adicional de cada coloca????o 1??/2??/3??/4??"

okaDescr : String
okaDescr = "Pontua????o b??nus dada ao jogador em primeiro lugar"

atozukeDescr : String
atozukeDescr = "Permite a vit??ria por ron mesmo quando uma ou mais das pe??as pelas quais o jogador est?? esperando n??o nenhum yaku"

kuitanDescr : String
kuitanDescr = "Permite tanyao em m??os abertas"

kuikaeDescr : String
kuikaeDescr = "Permite fazer uma chamada e descartar uma pe??a que complete o mesmo bloco, por exemplo: chii 678 e descartar 9, ou pon 999 e descartar 9. Quando parcialmente permitido apenas n??o permite descartar a mesma pe??a chamada"

uradoraDescr : String
uradoraDescr = "Dora adicional mostrado quando uma m??o ganha com riichi"

kandoraDescr : String
kandoraDescr = "Dora adicional mostrado quando um jogador declara kan"

kanuradoraDescr : String
kanuradoraDescr = "Dora adicional (um para cada kandora) mostrado quando uma m??o ganha com riichi"

akadoraDescr : String
akadoraDescr = "Cincos vermelhos"

agariyameDescr : String
agariyameDescr = "Permite que o dealer decida terminar o jogo ap??s ter ganho a ??ltima m??o da partida"

tenpaiyameDescr : String
tenpaiyameDescr = "Permite que o dealer decida terminar o jogo ap??s terminar em tenpai na ??ltima m??o da partida"

tobiDescr : String
tobiDescr = "Partida encerrada prematuramente caso algum jogador fique com pontos negativos"

getUrl : Int -> Ruleset -> String
getUrl clubId ruleset =
  Url.Builder.absolute ["clubs", String.fromInt clubId, "rulesets", String.fromInt ruleset.id] []
