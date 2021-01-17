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
  getJSONfromIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKYDB_CACHE,
} from "./SnIndexedDB"
import { setIsDataOutOfSync } from "../reducers/actions/sn.isDataOutOfSync.action"
import { encryptData, decryptData } from "./SnEncryption"
import { getPortal } from '../utils/SnUtility'

// "Options"
// skydb = true | false | undefined. Fetch from IndexedDB first and then SkyDB
// publicKey = null | "PubKey Value". If it has PubKey value, that means we need to fetch data of another user. 
// encrypt = true|false
// decrypt = true|false
// contentOnly = true|false  // If true will return onlu content from SkyDB (not revision number)
// store = IDB_STORE_SKAPP | IDB_STORE_SKYDB_CACHE , IDB_STORE_SKAPP =  loggedin users Key/value. IDB_STORE_SKYDB_CACHE = otehr users key/Value

// gets JSON file from SkyDB
export const getFile = async (publicKey, dataKey, options) => {
  // Get User Public Key
  if (publicKey == null || options?.publicKey == null) {
    throw new Error("Invalid Keys")
  }
  try {
    // Fetch from local First and then SkyDB
    if (options?.skydb === undefined || options?.skydb === false) {
      // Below condition means, we are fetching other user's data
      if (options?.publicKey) {
        let tempKey = options.publicKey + "#" + dataKey
        // Fetch value for key - [PubKey#DataKey] from IndexedDB
        let result = await getJSONfromIDB(tempKey, { store: IDB_STORE_SKYDB_CACHE })
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
          let content = getSkylinkContent(registryEntry.data)
          //setcontent in IndexedDB - "SkyDB Cache"
          await setJSONinIDB(tempKey, [skyDBRevisionNo, content], {
            store: IDB_STORE_SKYDB_CACHE,
          })
          // TODO: decrypt method
          return content
        }
      } else { // ### Loggedin User - Fetch request ###
        //step1: check if [DataKey] exist in app_metadata
        //step2: if Found, fetch content
        //step3: get revision number using dataKey - getEntry method
        //step4: if both revision numbers are same return value obtained in step#2
        //Step3: if both values are different OR dataKey does NOT exist in skydb_cache, fetch content using SkyDB method getJSON
        //Step4: Update, "IDB_STORE_SKAPP"
        //Step5: return;
        // Fetch value for [DataKey] from IndexedDB
        let result = await getJSONfromIDB(dataKey, { store: IDB_STORE_SKAPP })
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
          let content = getSkylinkContent(registryEntry.data)
          await setJSONinIDB(dataKey, [skyDBRevisionNo, content], {
            store: IDB_STORE_SKAPP,
          })
          // TODO: decrypt method
          return content
        }
      }
    } else { //If we need to fetch directly from SKyDB
      let result = null;
      // Below condition means, we are fetching other user's data
      if (options?.publicKey) {
        let tempKey = publicKey + "#" + dataKey
        // fetch content from SkyDB
        entryObj = getJSON(options?.publicKey, dataKey, { ...options, contentOnly: false });
        // update IndexedDB cache
        await setJSONinIDB(tempKey, result, { store: IDB_STORE_SKYDB_CACHE, })
      }
      else {
        // fetching loggedin users data from SkyDB
        entryObj = getJSON(publicKey, dataKey, { ...options, contentOnly: false });
        // update IndexedDB cache
        await setJSONinIDB(dataKey, result, { store: IDB_STORE_SKAPP, })
      }
      // Return data
      return entryObj.data;
    }
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return null
  }
}

export const getJSON = (publicKey, dataKey, options) => {
  try {
    //TODO - get privateKey from localstorage
    const privateKey = "";
    const skynetClient = new SkynetClient(getPortal())
    // Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys")
    }
    const entryObj = await skynetClient.db.getJSON(publicKey, dataKey)
    if (entryObj) {
      if (options.contentOnly) {
        // decrypt it
        if (privateKey && options?.decrypt == true) {
          // decrypt it
          const fileData = await decryptData(privateKey, publicKey, entryObj.data)
          // return data;
          return fileData
        }
        return entryObj.data
      }
      else {
        // return results;
        return entryObj
      }
    }
    else {
      return null;
    }
  }
  catch (error) {
    console.log(`error.message ${error.message}`)
    return null
  }
}

// sets JSON file in SkyDB
export const setFile = async (publicKey, dataKey, content, options) => {
  try {
    // TODO: we shall keep skynet client in localstorage
    const skynetClient = new SkynetClient(getPortal())
    // fetch private key from localstorage
    const privateKey = "";
    // get previous skylink 
    // create linked list to track history
    if (options.historyflag == true) {
      const registryEntry = await getRegistry(publicKey, dataKey)
      //const revision = (registryEntry ? registryEntry.revision : 0) + 1
      const skylink = registryEntry ? registryEntry.data : null
      content.prevSkylink = skylink
    }
    // set new data in SkyDB with
    let status = false
    // encrypt it
    if (options?.encrypt == true) {
      const cypherContent = await encryptData(privateKey,publicKey,JSON.stringify(content))
      status = await skynetClient.db.setJSON(privateKey, dataKey, cypherContent)
    } else {
      status = await skynetClient.db.setJSON(privateKey, dataKey, content)
    }
    await setJSONinIDB(dataKey, content, { store: IDB_STORE_SKAPP })
    return true
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return false
  }
}

// gets Skylink Content
export const getSkylinkContent = (skylink) =>
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

export const getSkylinkHeader = (skylink) => {

  //TODO: create URL from Skylink
  try {
    ajax({
      url: `${skylinkUrl}?format=concat`,
      method: "HEAD",
      responseType: "",
    }).pipe(
      map((res) => {
        const headerMap = {}
        const contentType = res.xhr.getResponseHeader("content-type")
        headerMap.contentType = contentType
        console.log(`contentType:${contentType}`)
        const contentLength = res.xhr.getResponseHeader("content-length")
        headerMap.contentLength = contentLength
          ? prettyBytes(Number(contentLength))
          : ""
        console.log(`contentLength:${contentLength}`)
        const skynetFileMetadata = res.xhr.getResponseHeader("Skynet-File-Metadata")
        headerMap.skynetFileMetadata = skynetFileMetadata
        // console.log("skynetFileMetadata:"+skynetFileMetadata);
        // let headerParams = res.xhr.getAllResponseHeaders();
        // console.log("headerParams"+headerParams);
        // console.log("headerMap: "+headerMap);
        return headerMap
      }),
      catchError((error) => {
        console.log("getSkylinkHeader::error: ", error)
        return of(error)
      })
    )
  } catch (e) { }
}


// this method will upload content and return skylink
export const uploadContent = async (content) => {
  try {
  } catch (e) { }
}

export const getRegistry = async (publicKey, fileKey, options) => {
  try {
    const skynetClient = new SkynetClient(getPortal())
    // Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys")
    }
    const { entry } = await skynetClient.registry.getEntry(publicKey, fileKey)
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
  } catch (e) { }
}



export const uploadToSkynet = async (file, skynetClient) =>
  await skynetClient.uploadFile(file)

export const getPublicApps = async (hash) =>
  await fetch(
    `${document.location.origin.indexOf("localhost") === -1
      ? document.location.origin
      : DEFAULT_PORTAL
    }/${hash}`
  ).then((res) => res.json())

export const getSkylinkPublicShareFile = (arrApps) => {
  const strArrApps = JSON.stringify(arrApps)
  return new File([strArrApps], `public${new Date()}.txt`, {
    type: "text/plain",
    lastModified: new Date(),
  })
}

export const savePublicSpace = async (publicHash, inMemObj) => {
  const publicHashData = await getPublicApps(publicHash)
  const skappListToSave = getAllPublicApps(
    publicHashData.data,
    inMemObj.addedSkapps,
    inMemObj.deletedSkapps
  )
  publicHashData.history[publicHashData.history.length - 1].skylink = publicHash
  publicHashData.history.push({
    creationDate: new Date(),
  })
  publicHashData.data = skappListToSave
  const skylinkListFile = getSkylinkPublicShareFile(publicHashData)
  const portal =
    document.location.origin.indexOf("localhost") === -1
      ? document.location.origin
      : DEFAULT_PORTAL
  const uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile)
  if (uploadedContent) {
    return {
      skylink: parseSkylink(uploadedContent),
    }
  }
  return null
}


export const setJSONFile = async (
  publicKey,
  privateKey,
  fileKey,
  fileData,
  options
) => {
  if (pwa && (options?.skydb == undefined || options?.skydb == false)) {
    try {
      await setJSONinIDB(fileKey, fileData, { store: IDB_STORE_SKAPP })
      await setJSONinIDB(IDB_IS_OUT_OF_SYNC, true, { store: IDB_STORE_SKAPP })
      store.dispatch(setIsDataOutOfSync(true)) // set value is store
      return true
    } catch (error) {
      // setErrorMessage(error.message);
      return false
    }
  } else {
    try {
      const skynetClient = new SkynetClient(getPortal())
      if (publicKey == null || privateKey == null) {
        throw new Error("Invalid Keys")
      }
      const registryEntry = await getRegistry(publicKey, fileKey) // I think we dont neeed to do this. SDK is doing it for us.
      const revision = (registryEntry ? registryEntry.revision : 0) + 1
      // create linked list to track history
      if (options.historyflag == true) {
        const skylink = registryEntry ? registryEntry.data : null
        fileData.prevSkylink = skylink
      }
      // // change below call to registery only
      // //const jsonObj = await getJSONFile(publicKey, fileKey, null, { getEntry: true });
      // if (appendFlag) {
      //   let tempFileData = await getJSONFile(publicKey, fileKey);
      //   if (fileData != null && tempFileData != null)
      //     fileData = tempFileData.push(fileData);
      // }
      // console.log("Final JSON "+JSON.stringify(fileData));
      let status = false
      // encrypt it
      if (options?.encrypt == true) {
        const cypherfileData = await encryptData(
          privateKey,
          publicKey,
          JSON.stringify(fileData)
        )
        status = await skynetClient.db.setJSON(privateKey, fileKey, cypherfileData)
      } else {
        status = await skynetClient.db.setJSON(privateKey, fileKey, fileData)
      }
      // let status = await skynetClient.db.setJSON(privateKey, fileKey,fileData);
      // let status = await skynetClient.db.setJSON(privateKey, fileKey,fileData); //<-- update Key Value pair for that specific pubKey
    } catch (error) {
      // setErrorMessage(error.message);
      return false
    }
    return true
  }
}

export const snKeyPairFromSeed = (userSeed) => genKeyPairFromSeed(userSeed)

export const snSerializeSkydbPublicKey = (publicKey) => publicKey

export const snDeserializeSkydbPublicKey = (publicKeyStr) => publicKeyStr





export const initializeLocalDatabaseFromBackup = async () => {
  try {
  } catch (e) { }
}

export const backupLocalDatabaseOnSkyDB = async () => {
  try {
  } catch (e) { }
}
