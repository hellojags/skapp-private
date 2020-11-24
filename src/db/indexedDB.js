import localforage from 'localforage';
import { STORAGE_USER_SESSION_KEY} from "../sn.constants";

//const IndexedDB4SkyDB = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY) ? BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)?.IndexedDB4SkyDB : null;
// var IndexedDB4SkyDB = localforage.createInstance();

localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'Skapp',
    version     : 1.0,
    storeName   : 'skyDB', // Should be alphanumeric, with underscores.
    description : 'Skynet App Store'
});

let IndexedDB4SkyDB = localforage.createInstance({name : 'Skapp', storeName : 'skyDB'});

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
            result.push({key :value})
            keys.push(key)
            recordCount = iterationNumber;
            console.log([key, value]);
        }).then(function() {
            console.log('Iteration has completed');
        }).catch(function(err) {
            // This code runs if there were any errors
            result = [];
            keys = [];
            recordCount = 0;
            console.log(err);
        });
        console.log('result'+result);
    } catch (err) {
        // This code runs if there were any errors.
        console.log(err);
        result = [];
        keys = [];
        recordCount = 0;
        
    }
    return {recordCount, keys, result};
}

export const clearAllfromDB = async () => {
    let value = null;
    try {
        await IndexedDB4SkyDB.clear();
    }catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
    return value;
}