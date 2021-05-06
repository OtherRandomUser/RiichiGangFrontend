module User exposing (User)

type alias User =
  { id : String
  , username : String
  , email : String
  , token : String
  }
