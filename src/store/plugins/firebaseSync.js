/*
example syncMap with default values

syncMapping = [
  {
    dbPath: "", // firebase db path
    commit: "", // store commit mutation
    type: "update" // type to use to react to changes
  }
]
*/

import { firebase } from '@firebase/app';
import '@firebase/database';

import {config} from '@/helpers/firebaseConfig'

firebase.initializeApp(config);
const fireDB = firebase.database();

function log(){
  console.log.apply( this, ['🔥', ...arguments] );
}

function extractRef(connection, store){
  let ref;
  if(typeof connection.ref === "String"){
    ref = fireDB.ref(connection.ref);
  }else{
    ref = connection.ref(fireDB, store)
  }
  return ref;
}

function setupDownstream(connection, store){
  const ref = extractRef(connection, store);
  ref.on('value', (snap) => {
    const snapVal = snap.val();
    if(!snapVal){return false;}
    log(`got data from firebase: ${JSON.stringify(snapVal)}`);
    store.commit(connection.mutation, {
      meta: {
        sender: "firebase"
      },
      data: snapVal
    });
  });
}

function setupUpstream(connection, store){
  const ref = extractRef(connection, store);
  store.subscribe(({type, payload}, state) => {
    if((payload.meta|| {}).sender === "firebase"){return}
    if (type === mapObject.commit) {
      if(syncMapping.type === "set"){
        ref.update(payload.data);
      }
      log(`${syncMapping.type || "update"}ing firebase (${mapObject.dbPath}: ${payload.data})`);
    }
  });
}

export default function firebaseSync(syncMapping) {
  return (store) => {

    syncMapping.forEach(connection => {
      // Firebase --> Vuex
      if(connection.direction !== "up"){
        setupDownstream(connection, store);
      }
      // Vuex --> Firebase
      if(connection.direction !== "down"){
        setupUpstream(connection, store);
      }
    });

  }
}