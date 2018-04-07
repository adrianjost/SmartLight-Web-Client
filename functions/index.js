const firebaseFunctions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase');
const firebaseAdmin = require("firebase-admin");
const jwtDecode = require('jwt-decode');
const namedColors = require('./colorDictionary.js');

const app = express();

//import {config} from '../src/helpers/firebaseConfig'; // not working, "Unexpected token import"
firebase.initializeApp({
  apiKey: "AIzaSyDJ17cuZ4P1YzSTOWtU_WqOKMloaqg7x_Q",
  authDomain: "smartlight-4861d.firebaseapp.com",
  databaseURL: "https://smartlight-4861d.firebaseio.com",
  projectId: "smartlight-4861d",
  storageBucket: "smartlight-4861d.appspot.com",
  messagingSenderId: "535232876187"
});
const serviceAccount = require('./serviceAccountKey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smartlight-4861d.firebaseio.com"
});

// test function
app.get('/api/timestamp-cached', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.send(`${Date.now()}`)
});

// get an jwt to authenticate an user
app.get('/api/get-jwt', (req, res) => {
  const uid = req.headers.uid || req.query.uid;
  if(!uid){ res.status(400); res.send(`no uid given`); return;}
  firebaseAdmin.auth().createCustomToken(uid)
  .then(function(token) {
    res.send(`${token}`)
  })
  .catch(function(error) { res.status(500); res.send(`failed to create auth token`);});
});


// set the color of an lamp
app.post('/api/set-lamp', (req, res) => {
  // error handling
  if(!req.body.jwt){ res.status(400); res.send(`no jwt given`);}
  else if(!req.body.lampId){ res.status(400); res.send(`no lampId given`);}
  else if(!req.body.colorName){ res.status(400); res.send(`no colorName given`);}
  else{
    const decodedJWT = jwtDecode(req.body.jwt);
    const uid = decodedJWT.uid;

    firebase.auth().signInWithCustomToken(req.body.jwt)
      .then(() => {
        const newColor = namedColors.list.find(color => color.name.toUpperCase() === req.body.colorName.toUpperCase());
        if(!newColor){ res.status(500); res.send(`${req.body.colorName} - no hex value for color found`);}
        else {
          const newHexColor = newColor.hex;
          firebase.database().ref("users/" + uid + "/lamps/" + req.body.lampId + "/current").set({
            color: newHexColor
          }).catch((error) => {
            res.status(401);
            res.send(`firebase database connection failed ${error}`);
          });
          res.send(`color for lamp ${req.body.lampId} set to: ${newHexColor} (${req.body.colorName})`);
        }
      })
      .catch(function(error) { res.status(401); res.send(`authentication failed ${error}`);});
  }
});


exports.app = firebaseFunctions.https.onRequest(app);
