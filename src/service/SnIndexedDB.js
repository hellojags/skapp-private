import localforage from "localforage"
import { extendPrototype } from "localforage-setitems"

// Database design
// Database Name: SkyDB
// Store Names
// skapp : this store will be used to store loggedin users data
// skydb_cache: This store will be used to store other users data

// IndexedDB specific fields
export const IDB_NAME = "SkyDB"
export const IDB_STORE_SKAPP = "skapp"
export const IDB_STORE_SKYDB_CACHE = "skydb_cache" // this store containers other users data "pubkey#datakey -> [revision, content]"
export const IDB_STORE_SKAPP_AGGREGATED_DATA = "skapp_aggregated_data"

extendPrototype(localforage)

localforage.config({
  driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: IDB_NAME,
  version: 1.0,
  description: "Skynet App Store and App Hosting",
})

const IndexedDB4SkyDB = localforage.createInstance({
  name: IDB_NAME,
  storeName: IDB_STORE_SKAPP,
})

const skydbCacheDataStoreIDB = localforage.createInstance({
  name: IDB_NAME,
  storeName: IDB_STORE_SKYDB_CACHE,
})

const AggregatedDataIDB = localforage.createInstance({
  name: IDB_NAME,
  storeName: IDB_STORE_SKAPP_AGGREGATED_DATA,
})

export const setJSONinIDB = async (key, value, opts) => {
  const result = null
  try {
    if (opts.store === IDB_STORE_SKYDB_CACHE) {
      await skydbCacheDataStoreIDB.setItem(key, value)
    } else if (opts.store === IDB_STORE_SKAPP_AGGREGATED_DATA) {
      await AggregatedDataIDB.setItem(key, value)
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
    await arrayOfJson.forEach((item) => {
      const key = Object.keys(item)[0]
      const value = item[key]
      console.log(`${key}:${value}`)
      setJSONinIDB(key, value, opts)
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
    } else if (opts.store === IDB_STORE_SKAPP_AGGREGATED_DATA) {
      value = await AggregatedDataIDB.getItem(key)
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
    } else if (opts.store === IDB_STORE_SKAPP_AGGREGATED_DATA) {
      await AggregatedDataIDB.removeItem(key)
    } else {
      await IndexedDB4SkyDB.removeItem(key)
      //await setJSONinIDB(IDB_IS_OUT_OF_SYNC, true, opts)
      //store.dispatch(setIsDataOutOfSync(true)) // yes data is out of sync
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
  } else if (opts.store === IDB_STORE_SKAPP_AGGREGATED_DATA) {
    try {
      // The same code, but using ES6 Promises.
      await AggregatedDataIDB
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
  }
  else if (opts.store === IDB_STORE_SKAPP_AGGREGATED_DATA) {
    await AggregatedDataIDB
      .dropInstance({
        name: IDB_NAME,
        storeName: IDB_STORE_SKAPP_AGGREGATED_DATA,
      })
      .then(() => {
        console.log("Dropped otherStore")
      })
  }
  else {
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