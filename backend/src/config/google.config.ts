import { google, type Auth } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_REDIRECT_URI ||
  !GOOGLE_REFRESH_TOKEN
)
  throw new Error(
    "Google client_id or client_secret not found id envirnment variable",
  );

const oauth2client: Auth.OAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage",
);

// const oauth2client: Auth.OAuth2Client = new google.auth.OAuth2(
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GOOGLE_REDIRECT_URI,
// );

oauth2client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

export {
  oauth2client,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
};
