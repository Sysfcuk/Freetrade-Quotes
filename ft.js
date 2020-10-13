const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
function authorize() {
  const credentials = JSON.parse(fs.readFileSync("credentials.json"));

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  let token;
  try {
    token = fs.readFileSync(TOKEN_PATH);
  } catch {
    return getNewToken(oAuth2Client);
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      return oAuth2Client;
    });
  });
}

/**
 * Fetches Freetrade Stock Universe from Google Sheets
 */
async function getFreetradeStocks() {
  const auth = authorize();

  const sheets = google.sheets({ version: "v4", auth });

  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId: "14Ep-CmoqWxrMU8HshxthRcdRW8IsXvh3n2-ZHVCzqzQ",
      range: "Freetrade Universe",
    });
  } catch (err) {
    console.log("The API returned an error: " + err);
    return err;
  }
  const rows = res.data.values;
  if (rows.length) {
    let data = [];

    let index = rows[0];

    for (let i = 1; i < rows.length; i++) {
      let entry = {};
      for (let j = 0; j < rows[i].length; j++) {
        entry[index[j]] = rows[i][j];
      }
      data.push(entry);
    }

    return data;
  } else {
    console.log("No data found.");
  }
}

module.exports = { getFreetradeStocks: getFreetradeStocks };
