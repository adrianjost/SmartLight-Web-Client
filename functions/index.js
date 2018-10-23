const firebaseFunctions = require('firebase-functions');
const express = require('express');
const firebaseAdmin = require("firebase-admin");
const namedColors = require('./colorDictionary.js');

// INIT
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

// HELPERS
function raceToSuccess(promises) {
  let numRejected = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise
      .then(resolve)
      .catch((error) => {
        if (++numRejected === promises.length) reject(new Error()); 
      });
    });
  });
}

// FUNCTIONS
function authenticateUser(req){
  //console.log("#2");
  // Authenticate user using secret token
  return new Promise(((resolve, reject) => {
    db.ref("users/" + req.body.uid + "/secret").once("value", (secretSnap) => {
      const server_secret = secretSnap.val();
      if(server_secret === req.body.secret){
        return resolve(req);
      }
      return reject(new Error(JSON.stringify({code: 401, message: `authentication with secret failed`})));
    });
  }));
}

function extractObjectAndColor(req) {
  //console.log("#3");
  // get lampName and requestes Color from String
  return new Promise(((resolve, reject) => {
    let str = req.body.textString.replace(/bitte/g, "").replace(/mache[n]?/g, "").trim();
    str = str.replace(/\s+/g,' ');
    const querys = [
      {exp: /^([\S]+)\s([\S]+)$/g, object: 1, color: 2},
      {exp: /^(?:a|i)[nm]?\s([\S]+)\s([\S]+)$/g, object: 1, color: 2},
      {exp: /^meine[nm]?\s([\S]+)\s([\S]+)$/g, object: 1, color: 2},
      {exp: /^(?:vo(?:[nm]?))?(?:\sunser(?:e?[nm])?)?\s([\S]+)\s([\S]+)$/g, object: 1, color: 2},
      {exp: /^([\S]+)\si(?:m|[mn]\sunser(?:e?[nm])?)?\s([\S]+)$/g, object: 2, color: 1}
    ];
   
    for (var i = 0; i < querys.length; i++) {
      const query = querys[i];
      const match = query.exp.exec(str);
      if(match){
        req.body.objectName = match[query.object]
        req.body.colorName = match[query.color]
        return resolve(req)
      }
    }
    return reject(new Error(JSON.stringify({code: 404, message:"can't decode color and/or object"})));
  }));
}

function getObjectPathByName(req) {
  //console.log("#4");
  // get lampId by Name
  return new Promise((resolve, reject) => {
    const lookupPaths = [
      `users/${req.body.uid}/groups`,
      `users/${req.body.uid}/lamps`
    ];
    const lookups = lookupPaths.map(async (lookupPath) => {
      const snap = await db.ref(lookupPath)
      .orderByChild("name")
      .equalTo(req.body.objectName)
      .once("value");
      if(snap.val()){
        return {
          objectPath: lookupPath + "/" + Object.keys(snap.val())[0],
        };
      }
      throw new Error('not found');
    });
    return raceToSuccess(lookups).then((object) => {
      req.result.objectPath = object.objectPath;
      return resolve(req);
    }).catch((error) => {
      return reject(new Error(JSON.stringify({code: 404, message: `object "${req.body.objectName}" not found`})));
    });
  });
}

async function getCurrentObjectColor(req){
 req.result.currentColor = (await db.ref( req.result.objectPath + "/current/color").once("value")).val();
 return req;
}

function getColorByName(req) {
  // TODO: implement lighten/darken (keywords: "heller"/"dunkler") of currentColor
  //console.log("#5");
  // get lampId by Name
  return new Promise(((resolve, reject) => {
    // translate color (directly)
    const newColor = namedColors.list.find(color => color.name.toUpperCase() === req.body.colorName.toUpperCase());
    if (newColor) {
      req.result.newHexColor =  newColor.hex;
      return resolve(req)
    }

    return reject(new Error(JSON.stringify({code: 500, message: `${req.body.colorName} - no hex value for color found`})));
  }));
}

function applyNewColor(req) {
  //console.log("#6");
  // Apply new color to each lamp
  return new Promise((resolve, reject) => {
    // Apply new color to an lamp
    db.ref(req.result.objectPath + "/current")
    .set({
      color: req.result.newHexColor
    })
    .then(() => {
      return resolve(req);
    })
    .catch((error) => { 
      return reject(error);
    });
  });
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
  return authenticateUser(req)
  .then( extractObjectAndColor )
  .then( getObjectPathByName )
  .then( getCurrentObjectColor )
  .then( getColorByName )
  .then( applyNewColor )
  .then( (req) => {
    res.json({
      status: 200,
      lamp: req.result.objectName,
      newColor: {
        name: req.body.colorName,
        hex: req.result.newHexColor
      }
    });
    return true
  })
  .catch((error) => {
    //console.error(req.body, error);
    try {
      error = JSON.parse(error.toString().replace("Error: ",""));
      res.status(error.code);
      res.send(`error: ${error.message}`)
    }
    catch(parseError) {
      res.status(500);
      res.send(`${JSON.stringify(error)}\n${error}`);
    }
    return false;
  });
});

exports.api = firebaseFunctions.https.onRequest(app);

// EVENT HANDLER
// !!! SECURITY ROLES AREN'T APPLIED HERE !!!
const adminDB = firebaseFunctions.database
exports.copyToLast = adminDB.ref(`users/{uid}/lamps/{lampId}/current`).onUpdate(async (change, context) => {
  const before = change.before.val();
  const after = change.after.val();
  if(before === after){
    // prevent loops
    return null;
  }
  const lastSnap = await db.ref(`users/${context.params.uid}/lamps/${context.params.lampId}/last`).once("value");
  const updatedStatus = Object.assign(lastSnap.val() || {}, before);
  console.log(before, after, updatedStatus)
  let updates = {};
  updates[`users/${context.params.uid}/lamps/${context.params.lampId}/last`] = updatedStatus;
  return change.after.ref.update(updates);
});
