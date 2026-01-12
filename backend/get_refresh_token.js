require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = process.env.DRIVE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.DRIVE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.DRIVE_OAUTH_REDIRECT_URI || "http://localhost";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("ENV belum kebaca!");
  console.error("Cek DRIVE_OAUTH_CLIENT_ID dan DRIVE_OAUTH_CLIENT_SECRET di backend/.env");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const url = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\nBuka URL ini:\n", url, "\n");
console.log("Setelah allow, copy parameter `code=` dari URL.\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Paste code di sini: ", async (code) => {
  const { tokens } = await oAuth2Client.getToken(code.trim());
  console.log("\nREFRESH_TOKEN =", tokens.refresh_token);
  rl.close();
});
