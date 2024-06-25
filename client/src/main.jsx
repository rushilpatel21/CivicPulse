import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import ThirdParty, { Github, Google, Apple } from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "CivicPulse",
        apiDomain: "http://localhost:8000",
        websiteDomain: "http://localhost:5173",
        // apiBasePath: "/auth",
        // websiteBasePath: "/login"
    },
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    Github.init(),
                    Google.init(),
                    // Facebook.init(),
                    Apple.init(),
                ]
            }
        }),
        Session.init({
            exposeAccessTokenToFrontendInCookieBasedAuth: true,
        }),
        EmailPassword.init(),
        // Session.init()
    ]
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <SuperTokensWrapper>
    <App />
  </SuperTokensWrapper>
);
