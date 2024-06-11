// Load environment variables from a .env file into process.env
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Route to refresh the Spotify access token
app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Initialize the Spotify API client with environment variables
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken
  });

  // Request a new access token using the refresh token
  spotifyApi.refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    }).catch((err) => {
      console.log('Could not refresh access token', err);
      res.sendStatus(400);
    });
});

// Route to log in and get the initial Spotify access and refresh tokens
app.post('/login', (req, res) => {
  const code = req.body.code;

  // Initialize the Spotify API client with environment variables
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  // Request access and refresh tokens using the authorization code
  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    }).catch((err) => {
      console.log("LOGIN ERROR:", err);
      res.sendStatus(400);
    });
});

// Start the server on port 3001
// app.listen(3001);
const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});
