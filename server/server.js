const express = require('express');
const multer = require('multer');
const cors = require('cors');
const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const ThirdParty = require("supertokens-node/recipe/thirdparty");
const { middleware, errorHandler } = require("supertokens-node/framework/express");
const Dashboard = require("supertokens-node/recipe/dashboard");
const UserRoles = require ("supertokens-node/recipe/userroles");

const SUPERTOKENS_CONNECTION_URI = process.env.SUPERTOKENS_CONNECTION_URI || 'https://st-dev-7972eee0-32cb-11ef-a570-fdac6021a8ff.aws.supertokens.io';
const SUPERTOKENS_API_KEY = process.env.SUPERTOKENS_API_KEY || '9GgcFJXzBQxZUiQZh9-vnUViMS';

console.log('SuperTokens Connection URI:', SUPERTOKENS_CONNECTION_URI);
console.log('SuperTokens API Key:', SUPERTOKENS_API_KEY);

supertokens.init({
    framework: "express",
    supertokens: {
        connectionURI: SUPERTOKENS_CONNECTION_URI,
        apiKey: SUPERTOKENS_API_KEY,
    },
    appInfo: {
        appName: "CivicPulse",
        apiDomain: "http://localhost:8000",
        websiteDomain: "http://localhost:5173",
        // apiBasePath: "/auth",
        // websiteBasePath: "/login"
    },
    recipeList: [
        EmailPassword.init(),
        Dashboard.init(),
        UserRoles.init(),
        ThirdParty.init({
          signInAndUpFeature: {
            providers: [{
                config: {
                    thirdPartyId: "google",
                    clients: [{
                        clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                        clientSecret: "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"
                    }]
                }
            }, {
                config: {
                    thirdPartyId: "github",
                    clients: [{
                        clientId: "467101b197249757c71f",
                        clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                    }]
                }
            }, {
                config: {
                    thirdPartyId: "apple",
                    clients: [{
                        clientId: "4398792-io.supertokens.example.service",
                        additionalConfig: {
                            keyId: "7M48Y4RYDL",
                            privateKey: "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                            teamId: "YWQCXGJRJL",
                        }
                    }]
                }
              }],
          }
        }),
        Session.init() // initializes session features
    ]
});

const geminiRouter = require('./routes/geminiRouter.js');
const user = require('./routes/user.js');
const userNew = require('./routes/userRole.js');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}));

app.use(middleware());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Middleware to handle uploads
app.use('/api/gemini', upload.single('photo'));

app.use('/api/gemini', geminiRouter);
app.use('/dont/use/user',user);
app.use('/api/user', userNew);

app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
