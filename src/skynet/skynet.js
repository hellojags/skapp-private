import { ajax } from "rxjs/ajax"
import { map, catchError } from "rxjs/operators"
import { genKeyPairFromSeed, parseSkylink, SkynetClient } from "skynet-js"
import { of } from "rxjs"
import prettyBytes from "pretty-bytes"
import { DEFAULT_PORTAL } from "../sn.constants"
import { IDB_IS_OUT_OF_SYNC } from "../blockstack/constants"
import { getAllPublicApps } from "../sn.util"
import store from "../reducers"
import {
  getJSONfromDB,
  setJSONinDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKYDB_CACHE,
} from "../db/indexedDB"
import { setIsDataOutOfSync } from "../reducers/actions/sn.isDataOutOfSync.action"
import { encryptData, decryptData } from "./encryption"

export const getFile = async (publicKey, dataKey, options) => {
  try {
    // Fetch from local First and then SkyDB
    if (options?.skydb === undefined || options?.skydb === false) {
      try {
        // Below condition means, we are fetching other user's data
        if (options?.publicKey) {
          let tempKey = publicKey + "#" + dataKey
          // Fetch value for key - [PubKey#DataKey] from IndexedDB
          let result = await getJSONfromDB(tempKey, { store: IDB_STORE_SKYDB_CACHE })
          // get revision number using dataKey - getEntry method
          let registryEntry = await getRegistry(options.publicKey, dataKey)
          const skyDBRevisionNo =
            registryEntry && registryEntry != "undefined"
              ? registryEntry.revision
              : 0
          //check if [PubKey#DataKey ] exist in skydb_cache and revision numbers are same.
          if (
            result &&
            result.length === 2 &&
            parseInt(result[0]) === parseInt(skyDBRevisionNo)
          ) {
            //if revision numbers are same, return Skylink content from IndexedDB
            return result[1]
          } else {
            // If revision numbers are different, return Skylink content from SkyDB/Skynet
            // Fetch content fromSkynet
            let content = getSkylink(registryEntry.data)
            await setJSONinDB(tempKey, [skyDBRevisionNo, content], {
              store: IDB_STORE_SKYDB_CACHE,
            })
            // TODO: decrypt method
            return content
          }
        } else {
          // Loggedin User Fetch request

          //step1: check if [DataKey] exist in app_metadata
          //step2: if Found, fetch content
          //step3: get revision number using dataKey - getEntry method
          //step4: if both revision numbers are same return value obtained in step#2
          //Step3: if both values are different OR dataKey does NOT exist in skydb_cache, fetch content using SkyDB method getJSON
          //Step4: Update, "app_metadata"
          //Step5: return;

          // Fetch value for key - [PubKey#DataKey] from IndexedDB
          let result = await getJSONfromDB(dataKey, { store: IDB_STORE_SKAPP })
          // get revision number using dataKey - getEntry method
          let registryEntry = await getRegistry(options.publicKey, dataKey)
          const skyDBRevisionNo =
            registryEntry && registryEntry != "undefined"
              ? registryEntry.revision
              : 0
          //check if [PubKey#DataKey ] exist in skydb_cache and revision numbers are same.
          if (
            result &&
            result.length === 2 &&
            parseInt(result[0]) === parseInt(skyDBRevisionNo)
          ) {
            //if revision numbers are same, return Skylink content from IndexedDB
            return result[1]
          } else {
            // If revision numbers are different, return Skylink content from SkyDB/Skynet
            // Fetch content fromSkynet
            let content = getSkylink(registryEntry.data)
            await setJSONinDB(tempKey, [skyDBRevisionNo, content], {
              store: IDB_STORE_SKYDB_CACHE,
            })
            // TODO: decrypt method
            return content
          }
        }
      } catch (error) {
        // setErrorMessage(error.message);
        console.log(`error.message ${error.message}`)
        return null
      }
    } else {
      //If we need to fetch directly from SKyDB

      //step1: check if [PubKey#DataKey OR DataKey] exist in skydb_cache
      //step2: if Found, fetch content
      //step3: get revision number using dataKey - getEntry method
      //step4: if both revision numbers are same return value obtained in step#2
      //Step3: if both values are different OR dataKey does NOT exist in skydb_cache, fetch content using SkyDB method getJSON
      //Step4: Update, "skydb_cache"
      //Step5: return;

      const skynetClient = new SkynetClient(getPortal())
      // Get User Public Key
      if (publicKey == null) {
        throw new Error("Invalid Keys")
      }
      const entry = await skynetClient.db.getJSON(publicKey, fileKey)
      if (entry) {
        if (options.getEntry) {
          return entry
        }
        // decrypt it
        if (privateKey && options?.decrypt == true) {
          // decrypt it
          const fileData = await decryptData(privateKey, publicKey, entry.data)
          // return entry.data;
          return fileData
        }

        return entry.data
      }
    }
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return null
  }
  return null
}

export const initializeLocalDatabaseFromBackup = async () => {
  try {
  } catch (e) {}
}
export const backupLocalDatabaseOnSkyDB = async () => {
  try {
  } catch (e) {}
}
export const getSkylinkMetadata = async () => {
  try {
  } catch (e) {}
}
export const getSkylink = (skylink) =>
  ajax({
    url: getPortal() + `${skylink}?format=concat`,
    method: "GET",
    responseType: "",
  }).pipe(
    map((res) => {
      return res
    }),
    catchError((error) => {
      console.log("getSkylinkHeader::error: ", error)
      return of(error)
    })
  )

export const createSkylink = async () => {
  try {
  } catch (e) {}
}

export const setFile = async () => {
  try {
  } catch (e) {}
}

export const getRegistry = async (publicKey, dataKey, options) => {
  try {
    const skynetClient = new SkynetClient(getPortal())
    // Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys")
    }
    const { entry } = await skynetClient.registry.getEntry(publicKey, dataKey)
    return entry
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return null
  }
  return null
}

export const setRegistry = async () => {
  try {
  } catch (e) {}
}

export const getJSONFile = async () => {}
