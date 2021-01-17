import localforage from "localforage"
import { extendPrototype } from "localforage-setitems"
import store from "../reducers"
import { setIsDataOutOfSync } from "../reducers/actions/sn.isDataOutOfSync.action"
import { IDB_IS_OUT_OF_SYNC } from "../utils/SnConstants"
// const IndexedDB4SkyDB = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY) ? BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)?.IndexedDB4SkyDB : null;
// var IndexedDB4SkyDB = localforage.createInstance();

// database design
// Database Name: Skapp
// Store Names
// Store1 --> SkyDB: This is database that will be synched with SkyDB. maintains application metadata
// Store2 --> AppCache: this stores apps cache and can be deleted safely. Not required to maintain in SkyDB. Think of it as Local Storage
// Store3 --> SkynetCache: This cache will be used to store Skynet File for caching. Variable in Size per user disk space.

// IndexedDB specific fields
export const IDB_NAME = "SkyDB"
export const IDB_STORE_SKAPP = "skapp"
export const IDB_STORE_SKYDB_CACHE = "revisions"
export const IDB_STORE_SKYDB_CACHE = "skydb_cache" // this store containers other users data "pubkey#datakey -> [revision, content]"

extendPrototype(localforage)

localforage.config({
  driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: IDB_NAME,
  version: 1.0,
  description: "Skynet App Store",
})

const IndexedDB4SkyDB = localforage.createInstance({
  name: IDB_NAME,
  storeName: IDB_STORE_SKAPP,
})

// const skydbCacheDataStoreIDB = localforage.createInstance({
//   name: IDB_NAME,
//   storeName: IDB_STORE_SKYDB_CACHE,
// })

const skydbCacheDataStoreIDB = localforage.createInstance({
  name: IDB_NAME,
  storeName: IDB_STORE_SKYDB_CACHE,
})

export const setJSONinIDB = async (key, value, opts) => {
  const result = null
  try {
    if (opts.store === IDB_STORE_SKYDB_CACHE) {
      await skydbCacheDataStoreIDB.setItem(key, value)
    } else {
      await IndexedDB4SkyDB.setItem(key, value)
    }
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err)
  }
  return result
}

export const setAllinIDB = async (arrayOfJson, opts) => {
  const result = null
  try {
    // await IndexedDB4SkyDB.setItems(arrayOfJson);

    await arrayOfJson.forEach((item) => {
      const key = Object.keys(item)[0]
      const value = item[key]
      console.log(`${key}:${value}`)
      setJSONinDB(key, value, opts)
    })
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err)
  }
  return result
}

export const getJSONfromIDB = async (key, opts) => {
  let value = null
  try {
    if (opts.store === IDB_STORE_SKYDB_CACHE) {
      value = await skydbCacheDataStoreIDB.getItem(key)
    } else {
      value = await IndexedDB4SkyDB.getItem(key)
    }
    // This code runs once the value has been loaded
    // from the offline store.
    console.log(value)
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err)
  }
  return value
}

export const removeJSONfromIDB = async (key, opts) => {
  const value = null
  try {
    if (opts.store === IDB_STORE_SKYDB_CACHE) {
      await skydbCacheDataStoreIDB.removeItem(key)
    } else {
      await IndexedDB4SkyDB.removeItem(key)
      await setJSONinDB(IDB_IS_OUT_OF_SYNC, true, opts)
      store.dispatch(setIsDataOutOfSync(true)) // yes data is out of sync
    }
  } catch (err) {
    // This code runs if there were any errors.
    console.log(err)
  }
  return value
}

export const getAllItemsFromIDB = async (opts) => {
  let result = []
  let keys = []
  let recordCount = 0
  if (opts.store === IDB_STORE_SKYDB_CACHE) {
    try {
      // The same code, but using ES6 Promises.
      await skydbCacheDataStoreIDB
        .iterate((value, key, iterationNumber) => {
          result.push({ [key]: value })
          keys.push(key)
          recordCount = iterationNumber
          // console.log([key, value]);
        })
        .then(() => {
          // console.log('Iteration has completed');
        })
        .catch((err) => {
          // This code runs if there were any errors
          result = []
          keys = []
          recordCount = 0
          console.log(err)
        })
      // console.log('result'+result);
    } catch (err) {
      // This code runs if there were any errors.
      // console.log(err);
      result = []
      keys = []
      recordCount = 0
    }
  } else {
    try {
      // The same code, but using ES6 Promises.
      await IndexedDB4SkyDB.iterate((value, key, iterationNumber) => {
        result.push({ [key]: value })
        keys.push(key)
        recordCount = iterationNumber
        // console.log([key, value]);
      })
        .then(() => {
          // console.log('Iteration has completed');
        })
        .catch((err) => {
          // This code runs if there were any errors
          result = []
          keys = []
          recordCount = 0
          console.log(err)
        })
      // console.log('result'+result);
    } catch (err) {
      // This code runs if there were any errors.
      // console.log(err);
      result = []
      keys = []
      recordCount = 0
    }
  }
  return { recordCount, keys, result }
}

export const clearAllfromIDB = async (opts) => {
  if (opts.store === IDB_STORE_SKYDB_CACHE) {
    await skydbCacheDataStoreIDB
      .dropInstance({
        name: IDB_NAME,
        storeName: IDB_STORE_SKYDB_CACHE,
      })
      .then(() => {
        console.log("Dropped otherStore")
      })
  } else {
    await IndexedDB4SkyDB.dropInstance({
      name: IDB_NAME,
      storeName: IDB_STORE_SKAPP,
    }).then(() => {
      console.log("Dropped otherStore")
    })
  }
  // await IndexedDB4SkyDB.clear().then(function() {
  //     // Run this code once the database has been entirely deleted.
  //     console.log('Database is now empty.');
  // }).catch(function(err) {
  //     // This code runs if there were any errors
  //     console.log(err);
  // });
}
k