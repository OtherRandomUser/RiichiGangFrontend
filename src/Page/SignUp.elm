module Page.SignUp exposing (..)


-- Sign In Stuff --

-- type alias SignInModel =
--   { email : String
--   , username : String
--   , password : String
--   , passwordAgain : String
--   }

-- validateSignIn : SignInModel -> Result String ()
-- validateSignIn model =
--   if String.isEmpty model.email then
--     Err "Preencha o Email"
--   else if String.isEmpty model.username then
--     Err "Preencha o Nome de Usuário"
--   else if String.isEmpty model.password then
--     Err "Preencha a Senha"
--   else if String.isEmpty model.passwordAgain then
--     Err "Repita a Senha"
--   else if model.password /= model.passwordAgain then
--     Err "Repita a Senha"
--   else
--     Ok ()



-- viewSingInCard : Html msg
-- viewSingInCard =
--   div [ class "login-card" ]
--     [ h1 [ class "card-heading" ] [ text "Sign Up" ]
--     , input [ type_ "email", placeholder "Email", class "login-input" ] []
--     , input [ type_ "email", placeholder "Nome de Usuário", class"login-input" ] []
--     , input [ type_ "password", placeholder "Senha", class "login-input" ] []
--     , input [ type_ "password", placeholder "Confirmação da Senha", class "login-input" ] []
--     , button [ class "btn btn-indigo-500" ] [ text "Login" ]
--     ]