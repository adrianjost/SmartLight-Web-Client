const firebaseFunctions = require('firebase-functions');
const express = require('express');
const firebaseAdmin = require("firebase-admin");
const namedColors = require('./colorDictionary.js');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/time', (req, res) => {
  //console.log("send time");
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
  //console.log("#2");
  // Authenticate user using secret token
  return new Promise(((resolve, reject) => {
    db.ref("users/" + req.body.uid + "/secret").once("value", (secretSnap) => {
      const server_secret = secretSnap.val();
      if(server_secret !== req.body.secret){
        return reject(new Error(JSON.stringify({code: 401, message: `authentication with secret failed`})));
      }
      else{
        return resolve(req);
      }
    });
  }));
}

function extractLampAndColor(req) {
  //console.log("#3");
  // get lampName and requestes Color from String
  return new Promise(((resolve, reject) => {
    let str = req.body.textString.replace(/bitte/g, "").replace(/mache[n]?/g, "").trim();
    str = str.replace(/\s+/g,' ');
    const querys = [
      {exp: /^([\S]+)\s([\S]+)$/g, lamp: 1, color: 2},
      {exp: /^i[nm]?\s([\S]+)\s([\S]+)$/g, lamp: 1, color: 2},
      {exp: /^meine[nm]?\s([\S]+)\s([\S]+)$/g, lamp: 1, color: 2},
      {exp: /^(?:vo(?:[nm]?))?(?:\sunser(?:e?[nm])?)?\s([\S]+)\s([\S]+)$/g, lamp: 1, color: 2},
      {exp: /^([\S]+)\si(?:m|[mn]\sunser(?:e?[nm])?)?\s([\S]+)$/g, lamp: 2, color: 1}
    ];
    let matched = false;
    querys.some(query => {
      const match = query.exp.exec(str);
      if(match){
        //console.log("MATCH", query.exp, query.lamp, query.color);
        req.body.lampName = match[query.lamp];
        req.body.colorName = match[query.color];
        matched = true;
      }
    });
    return matched?resolve(req):reject(new Error(JSON.stringify({code: 404, message:"can't decode color and or lamp"})));
  }));
}

function getLampIdByName(req) {
  //console.log("#4");
  // get lampId by Name
  return new Promise(((resolve, reject) => {
    db.ref("users/" + req.body.uid + "/lamps").orderByChild("name").equalTo(req.body.lampName)
      .once("value", (lampSnap) => {
        if(!lampSnap.val()) {
          return reject(new Error(JSON.stringify({code: 404, message: `lamp "${req.body.lampName}" not found`})));
        } else{
          req.result.lampSnap = lampSnap;
          return resolve(req);
        }
      });
  }));
}

function getColorByName(req) {
  //console.log("#5");
  // get lampId by Name
  return new Promise(((resolve, reject) => {
    // translate color
    const newColor = namedColors.list.find(color => color.name.toUpperCase() === req.body.colorName.toUpperCase());
    if (!newColor) {
      return reject(new Error(JSON.stringify({code: 500, message: `${req.body.colorName} - no hex value for color found`})));
    } else {
      req.result.newHexColor =  newColor.hex;
      return resolve(req)
    }
  }));
}

function applyNewColor(req) {
  //console.log("#6");
  // Apply new color to each lamp
  return new Promise(((resolve, reject) => {
    const lampSnaps = req.result.lampSnap;
    const newHexColor = req.result.newHexColor;
    let fail = false;
    lampSnaps.forEach((lampSnap) => {
      const lampId = lampSnap.key;
      // Apply new color to an lamp
      db.ref("users/" + req.body.uid + "/lamps/" + lampId + "/current").set({
        color: newHexColor
      }).catch((error) => { fail = true; res.status(500); res.send(`firebase database connection failed ${error}`); });
    });
    return fail?
       reject(new Error(JSON.stringify({code: 500, message: `applyNewColor: firebase database connection failed`})))
      :resolve(req);
  }));
}


const db = firebaseAdmin.database();
// set the color of an lamp
app.post('/set-lamp-color', (req, res) => {
  // error handling
  if(!req.body.uid){       res.status(400); res.send(`no jwt given`);        return false;}
  if(!req.body.secret){    res.status(400); res.send(`no secret given`);     return false;}
  if(!req.body.textString){res.status(400); res.send(`no textString given`); return false;}

  req.result = {}; // storage for promise results
  //console.log("#1");
  authenticateUser(req)
  .then( extractLampAndColor )
  .then( getLampIdByName )
  .then( getColorByName )
  .then( applyNewColor )
  .then( (req) => {
    res.send(`color for lamp(s) ${req.body.lampName} set to: ${req.result.newHexColor} (${req.body.colorName})`);
    return Promise.resolve();
  })
  .catch((error) => {
    console.error(req.body, error);
    try {
      error = JSON.parse(error.toString().replace("Error: ",""));
      res.status(error.code);
      res.send(`error: ${error.message}`)
    }
    catch(parseError) {
      res.status(500);
      res.send(`${JSON.stringify(error)}\n${error}`);
    }
  });
  return true;
});

exports.api = firebaseFunctions.https.onRequest(app);
