import localforage from 'localforage';
import { extendPrototype } from 'localforage-setitems';
import { STORAGE_USER_SESSION_KEY} from "../sn.constants";
import {IDB_NAME,IDB_STORE_NAME,IDB_IS_OUT_OF_SYNC } from "../blockstack/constants";
import store from "../reducers";
import {setIsDataOutOfSync} from "../reducers/actions/sn.isDataOutOfSync.action";
//const IndexedDB4SkyDB = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY) ? BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)?.IndexedDB4SkyDB : null;
// var IndexedDB4SkyDB = localforage.createInstance();

// database design
// Database Name: Skapp
// Store Names
// Store1 --> SkyDB: This is database that will be synched with SkyDB. maintains application metadata
// Store2 --> AppCache: this stores apps cache and can be deleted safely. Not required to maintain in SkyDB. Think of it as Local Storage 
// Store3 --> SkynetCache: This cache will be used to store Skynet File for caching. Variable in Size per user disk space. 

extendPrototype(localforage);

localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : IDB_NAME,
    version     : 1.0,
    description : 'Skynet App Store'
});

let IndexedDB4SkyDB = localforage.createInstance({storeName : IDB_STORE_NAME});

export const setJSONinDB = async (key,value) => {
    let result = null;
    try {
        await IndexedDB4SkyDB.setItem(key, value);
    }catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
    return result;
}

export const setAllinDB = async (arrayOfJson) => {
    let result = null;
    try {
        //await IndexedDB4SkyDB.setItems(arrayOfJson);
       
        await arrayOfJson.forEach((item) => {
        let key =  Object.keys(item)[0];
        let value = item[key];
        console.log(key+":"+value);
        setJSONinDB(key,value);
        });

    }catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
    return result;
}

export const getJSONfromDB = async (key) => {
    let value = null;
    try {
         value = await IndexedDB4SkyDB.getItem(key);
        // This code runs once the value has been loaded
        // from the offline store.
        console.log(value);
    } catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
    return value;
}

export const removeJSONfromDB = async (key) => {
    let value = null;
    try {
        await IndexedDB4SkyDB.removeItem(key);
        await setJSONinDB(IDB_IS_OUT_OF_SYNC, true);
        store.dispatch(setIsDataOutOfSync(true));// yes data is out of sync
    }catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
    return value;
}

export const getAllItemsFromIDB = async (storeName) => {
    let result = [];
    let keys = [];
    let recordCount = 0;
    try {
        // The same code, but using ES6 Promises.
        await IndexedDB4SkyDB.iterate(function(value, key, iterationNumber) {
            result.push({[key] :value})
            keys.push(key)
            recordCount = iterationNumber;
            //console.log([key, value]);
        }).then(function() {
            //console.log('Iteration has completed');
        }).catch(function(err) {
            // This code runs if there were any errors
            result = [];
            keys = [];
            recordCount = 0;
            console.log(err);
        });
        //console.log('result'+result);
    } catch (err) {
        // This code runs if there were any errors.
        //console.log(err);
        result = [];
        keys = [];
        recordCount = 0;
    }
    return {recordCount, keys, result};
}

export const clearAllfromDB = () => {
    IndexedDB4SkyDB.clear().then(function() {
        // Run this code once the database has been entirely deleted.
        console.log('Database is now empty.');
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });
   
}