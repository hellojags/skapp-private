import localforage from 'localforage';
import { STORAGE_USER_SESSION_KEY} from "../sn.constants";

//const IndexedDB4SkyDB = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY) ? BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)?.IndexedDB4SkyDB : null;
// var IndexedDB4SkyDB = localforage.createInstance();

localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'Skapp',
    version     : 1.0,
    storeName   : 'skydb', // Should be alphanumeric, with underscores.
    description : 'Skynet App Store'
});

let IndexedDB4SkyDB = localforage.createInstance();

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