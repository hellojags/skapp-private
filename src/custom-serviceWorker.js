/* eslint-disable no-undef */
// import {getJSONfromDB} from "./db/indexedDB";
// import {SkynetClient } from "skynet-js";
if (workbox) {
    console.log(`Workbox is loaded 🎉`);
  } else {
    console.log(`Workbox didn't load `);
  }

  workbox.
  // eslint-disable-next-line
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  // eslint-disable-next-line
  self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
  // eslint-disable-next-line
  self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
  // app-shell
  workbox.routing.registerRoute("/", new workbox.strategies.NetworkFirst());

  // Cache cdn files and external links
  workbox.routing.registerRoute(
    new RegExp('https:.*\.(css|js|json|png|)'),
    new workbox.strategies.NetworkFirst({ cacheName: 'external-cache'})
  )

  // ############## OneTime Sync ##############
  self.addEventListener('sync', (event) => {
    if (event.tag === 'post-data') {
      // call method
      console.log('Before calling updateSkyDB');
      event.waitUntil(updateSkyDB());
      console.log('after calling updateSkyDB');
    }
  });
  async function updateSkyDB() {
    console.log('Inside updateSkyDB');
    // //step1: get all data from IndexedDB 
    // let idbData = await getJSONfromDB('skhub/skyspaces/skyspaceIdx.json');
    // console.log('IndexedDB data '+idbData);
    // //step2: update 
    // //let status = await setJSONFile();
    // const skynetClient = new SkynetClient("https://siasky.net");
    // let status = await skynetClient.db.setJSON(privateKey, 'skhub/skyspaces/skyspaceIdx.json', idbData, 1);
    // console.log('Skynet Update Status '+status);
  }
  // https://github.com/WICG/background-sync/blob/master/explainers/sync-explainer.md

  // ############## for periodic sync ##############
  self.addEventListener('periodicsync', (event) => {
    if (event.registration.tag == 'post-data-periodic') {
      console.log('Before calling updateSkyDBPeriodic');
      event.waitUntil(updateSkyDBPeriodic());
      onsole.log('after calling updateSkyDBPeriodic');
    }
    else {
      // unknown sync, may be old, best to unregister
      console.log('Before unregister periodicsync');
      event.registration.unregister();
      console.log('after unregister periodicsync');
    }
  });

  async function updateSkyDBPeriodic() {
    console.log('Inside updateSkyDBPeriodic');
    // //step1: get all data from IndexedDB 
    // let idbData = await getJSONfromDB('skhub/skyspaces/skyspaceIdx.json');
    // console.log('IndexedDB data '+idbData);
    // //step2: update 
    // //let status = await setJSONFile();
    // const skynetClient = new SkynetClient("https://siasky.net");
    // let status = await skynetClient.db.setJSON(privateKey, 'skhub/skyspaces/skyspaceIdx.json', idbData, 1);
    // console.log('Skynet Update Status '+status);
  }

  

  // function getDataAndSend() {
  //   let db;
  //   const request = indexedDB.open('my-db');
  //   request.onerror = (event) => {
  //     console.log('Please allow my web app to use IndexedDB');
  //   };
  //   request.onsuccess = (event) => {
  //     db = event.target.result;
  //     getData(db);
  //   };
  // }

  // function getData(db) {
  //   const transaction = db.transaction(['user-store']);
  //   const objectStore = transaction.objectStore('user-store');
  //   const request = objectStore.get('name');
  //   request.onerror = (event) => {
  //     // Handle errors!
  //   };
  //   request.onsuccess = (event) => {
  //     // Do something with the request.result!
  //     addData(request.result);
  //     console.log('Name of the user is ' + request.result);
  //   };
  // }
  
  // function addData(userName) {
  //   //indexDb
  //   let obj = {
  //     name: userName,
  //   };
  //   fetch('http://localhost:3000/data', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(obj),
  //   })
  //     .then(() => Promise.resolve())
  //     .catch(() => Promise.reject());
  // }
  
  
  
  