const firebaseFunctions = require('firebase-functions');
const express = require('express');
const firebaseAdmin = require("firebase-admin");
const randtoken = require('rand-token');
const namedColors = require('./colorDictionary.js');

const app = express();

const serviceAccount = require('./serviceAccountKey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smartlight-4861d.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "assistant-api"
  }
});
const db = firebaseAdmin.database();

// generate an secret token
// TODO: move to client app
app.get('/api/create-token', (req, res) => {
  token = randtoken.generate(Math.pow(2,14));
  return res.send(`${token}`);
});

/* // unsecure!!! TODO: remove !!!
// get the secret of the user
app.get('/api/get-token', (req, res) => {
  const uid = req.headers.uid || req.query.uid;
  if(!uid){ res.status(400); res.send(`no uid given`); return;}
  db.ref("users/" + uid + "/secret").once("value", (snap) => {
    const secret = snap.val();
    res.send(`secret: ${secret}`)
  })
  .catch(function(error) { res.status(500); res.send(`failed to get auth token`);});
});
*/

// set the color of an lamp
/* example request payload:
{
  "uid": "[uid]",
  "secret": "[userSecret]",
  "lampId": "[lampId]",
  "colorName": "[colorName]"
}
*/
app.post('/api/set-lamp-color', (req, res) => {
  // error handling
       if(!req.body.uid){       res.status(400); res.send(`no jwt given`);}
  else if(!req.body.secret){    res.status(400); res.send(`no secret given`);}
  else if(!req.body.lampId){    res.status(400); res.send(`no lampId given`);}
  else if(!req.body.colorName){ res.status(400); res.send(`no colorName given`);}
  else{
    db.ref("users/" + req.body.uid + "/secret").once("value", (snap) => {
      const secret = snap.val();
      if(secret !== req.body.secret){ res.status(401); res.send(`authentication with secret failed`); }
      else {
        const newColor = namedColors.list.find(color => color.name.toUpperCase() === req.body.colorName.toUpperCase());
        if (!newColor) { res.status(500); res.send(`${req.body.colorName} - no hex value for color found`); }
        else {
          const newHexColor = newColor.hex;
          db.ref("users/" + req.body.uid + "/lamps/" + req.body.lampId + "/current").set({
            color: newHexColor
          }).catch((error) => {
            res.status(401);
            res.send(`firebase database connection failed ${error}`);
          });
          res.send(`color for lamp ${req.body.lampId} set to: ${newHexColor} (${req.body.colorName})`);
        }
      }
    }).catch((error) => { res.status(401); res.send(`authentication with secret failed - no token generated`); });
  }
});


exports.app = firebaseFunctions.https.onRequest(app);
