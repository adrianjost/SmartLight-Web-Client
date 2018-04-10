const firebaseFunctions = require('firebase-functions');
const express = require('express');
const firebaseAdmin = require("firebase-admin");
const namedColors = require('./colorDictionary.js');

const app = express();

app.get('/time', (req, res) => {
  res.send(`server timestamp: ${Date.now()}`);
});

const serviceAccount = require('./serviceAccountKey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smartlight-4861d.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "assistant-api"
  }
});

function authenticateUser(req){
// Authenticate user using secret token
  return new Promise(((resolve, reject) => {
    db.ref("users/" + req.body.uid + "/secret").once("value", (secretSnap) => {
      const server_secret = secretSnap.val();
      if(server_secret !== req.body.secret){
        return reject(new Error({code: 401, message: `authentication with secret failed`}));
      }
      else{
        return resolve(req);
      }
    });
  }));
}

function extractLampAndColor(req) {
  // get lampName and requestes Color from String
  return new Promise(((resolve, reject) => {
    let str = req.body.textString;
    const querys = [
      {exp: /([\S]+)\s([\S]+)/g, lamp: 1, color: 2},
      {exp: /die\s([\S]+)\s([\S]+)/g, lamp: 1, color: 2},
      {exp: /das\s([\S]+)\s([\S]+)/g, lamp: 1, color: 2},
      {exp: /den\s([\S]+)\s([\S]+)/g, lamp: 1, color: 2},
      {exp: /meinen\s([\S]+)\s([\S]+)/g, lamp: 1, color: 2},
      {exp: /unser(?:en)*\s([\S]+)\s([\S]+)/g, lamp: 1, color: 2}
    ];
    let matched = false;
    querys.forEach(query => {
      const match = query.exp.exec(str);
      if(match){
        req.body.lampName = match[query.lamp];
        req.body.colorName = match[query.color];
        matched = true;
      }
    });
    return matched?resolve(req):reject(new Error({code: 404, message:"can't decode color and or lamp"}));
  }));
}

function getLampIdByName(req) {
  // get lampId by Name
  return new Promise(((resolve, reject) => {
    db.ref("users/" + req.body.uid + "/lamps").orderByChild("name").equalTo(req.body.lampName)
      .once("value", (lampSnap) => {
        if(!lampSnap.val()) {
          return reject(new Error({code: 404, message: `lamp "${rey.body.lampName}" not found`}));
        } else{
          req.result.lampSnap = lampSnap;
          return resolve(req);
        }
      });
  }));
}

function getColorByName(req) {
  // get lampId by Name
  return new Promise(((resolve, reject) => {
    // translate color
    const newColor = namedColors.list.find(color => color.name.toUpperCase() === req.body.colorName.toUpperCase());
    if (!newColor) {
      return reject(new Error({code: 500, message: `${req.body.colorName} - no hex value for color found`}));
    } else {
      req.result.newHexColor =  newColor.hex;
      return resolve(req)
    }
  }));
}

function applyNewColor(req) {
  // Apply new color to each lamp
  return new Promise(((resolve, reject) => {
    const lampSnaps = req.result.lampSnap;
    const newHexColor = req.result.newHexColor;
    lampSnaps.forEach((lampSnap) => {
      const lampId = lampSnap.key;

      // Apply new color to an lamp
      db.ref("users/" + req.body.uid + "/lamps/" + lampId + "/current").set({
        color: newHexColor
      }).catch((error) => { res.status(500); res.send(`firebase database connection failed ${error}`); });
      return resolve(req);
    });
  }));
}


const db = firebaseAdmin.database();
// set the color of an lamp
app.post('/set-lamp-color', (req, res) => {
  // error handling
  if(!req.body.uid){       res.status(400); res.send(`no jwt given`);         return false;}
  if(!req.body.secret){    res.status(400); res.send(`no secret given`);      return false;}
  if(!req.body.textString){res.status(400); res.send(`no textString given`);  return false;}

  req.result = {}; // storage for promise results
  authenticateUser(req)
  .then( extractLampAndColor )
  .then( getLampIdByName )
  .then( getColorByName )
  .then( applyNewColor )
  .then( (req) => {
    res.send(`color for lamp(s) ${req.body.lampName} set to: ${req.result.newHexColor} (${req.body.colorName})`);
    return Promise.resolve();
  })
  .catch((error) => { res.status(error.code); res.send(error.message); });
  return true;
});

exports.api = firebaseFunctions.https.onRequest(app);
