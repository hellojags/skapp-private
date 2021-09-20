import { ajax } from "rxjs/ajax"
import { map, catchError } from "rxjs/operators"
import { getRelativeFilePath, getRootDirectory, parseSkylink, SkynetClient, genKeyPairFromSeed } from "skynet-js"
import { of } from "rxjs"
import prettyBytes from "pretty-bytes"
import {
  getJSONfromIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKYDB_CACHE,
} from "./SnIndexedDB"
import { encryptData, decryptData } from "./SnEncryption"
import { getPortalUrl } from './skynet-api';
/* global BigInt */
//above comment is required to enable BigInt
// ################################ SkyDB Methods ######################

// pick skynet portal
const skynetClient = new SkynetClient("https://siasky.net");
//const skynetClient = new SkynetClient();
let REGISTRY_MAX_REVISION = BigInt("18446744073709551615");
// "Options"
// skydb = true | false | undefined. Fetch from IndexedDB first and then SkyDB
// publicKey = null | "PubKey Value". If it has PubKey value, that means we need to fetch data of another user. 
// encrypt = true|false
// decrypt = true|false
// contentOnly = true|false  // If true will return onlu content from SkyDB (not revision number)
// store = IDB_STORE_SKAPP | IDB_STORE_SKYDB_CACHE , IDB_STORE_SKAPP =  loggedin users Key/value. IDB_STORE_SKYDB_CACHE = otehr users key/Value
// export function getSkappKeys() {
//   return {
//       publicKey: "01846241b88a741741445d982eff80092b105795349fa071715f451e9101ca4a",
//       privateKey: "b1d00ff5070ad41ee67b518cc1220caeac0da5e0e2f276cc65a0a9c9549f867b01846241b88a741741445d982eff80092b105795349fa071715f451e9101ca4a"
//   };
// }

export function getProviderKeysByType(keyType) {
  let keys = { privateKey: null, publicKey: null };
  switch (keyType) {
    case "GEQ":
      keys = {
        publicKey:"c570f61ef7482622addcdd6cfe1c00a3b08a31d7fa9ba172515cace63570042a",
        privateKey: "57dde68330fbcf3799964d8af7dc78229856d6038e83efdf547a937f8e14c0e4c570f61ef7482622addcdd6cfe1c00a3b08a31d7fa9ba172515cace63570042a"
      };
      break;
    case "AGGREGATOR":
      keys = {
        publicKey:  "96682842f92cb14f257e023e812178ca4304bf963c3758929966746154f59539"
      };
      break;
    default:
      console.log("In Dafault loop: " + keyType)
      break;
  }
  return keys;
}

export const getFile_SkyDB = async (publicKey, dataKey, options) => {
  return await skynetClient.db.getJSON(publicKey, dataKey);
}
export const putFile_SkyDB = async (publicKey, dataKey, content, options) => {
  return await skynetClient.db.setJSON(options.privateKey, dataKey, content)
}
// gets JSON file from SkyDB
export const getFile = async (publicKey, dataKey, options) => {
  // Get User Public Key
  if (publicKey == null && options?.publicKey == null) {
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
        let registryEntry = await getRegistryEntry(options.publicKey, dataKey)
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
          const { data, contentType, metadata, skylink } = await skynetClient.getFileContent(registryEntry.data);
          //setcontent in IndexedDB - "SkyDB Cache"
          await setJSONinIDB(tempKey, [skyDBRevisionNo, data], {
            store: IDB_STORE_SKYDB_CACHE,
          })
          // TODO: decrypt method
          return data
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
        let result = await getJSONfromIDB(dataKey, { store: IDB_STORE_SKAPP })// TODO: need to fix IDB store. we cant hardcode store value. must take from options
        // get revision number using dataKey - getEntry method
        let registryEntry = await getRegistryEntry(publicKey, dataKey)
        const skyDBRevisionNo =
          registryEntry && registryEntry != "undefined"
            ? registryEntry.revision
            : 0
        //check if [PubKey#DataKey ] exist in skydb_cache and revision numbers are same.
        if (
          result &&
          result.length > 0 &&
          parseInt(result[0]) === parseInt(skyDBRevisionNo)
        ) {
          //if revision numbers are same, return Skylink content from IndexedDB
          return result[1]
        } else {
          // If revision numbers are different, return Skylink content from SkyDB/Skynet
          // Fetch content fromSkynet
          //let content = getSkylinkContent(registryEntry.data)
          const { data, contentType, metadata, skylink } = await skynetClient.getFileContent(registryEntry.data);
          // TODO: convert array to JSOn object
          // Example:
          // {
          //   data: {
          //     example: "This is some example JSON data."
          //   },
          //   revision: 11
          // }
          await setJSONinIDB(dataKey, [skyDBRevisionNo, data], {
            store: IDB_STORE_SKAPP,
          }) // TODO: need to fix IDB store. we cant hardcode store value. must take from options
          // TODO: decrypt method
          return data
        }
      }
    } else { //If we need to fetch directly from SkyDB
      let result = null;
      let entryObj = null;
      // Below condition means, we are fetching other user's data
      if (options?.publicKey) {
        let tempKey = options.publicKey + "#" + dataKey
        // fetch content from SkyDB
        entryObj = await getContent(options?.publicKey, dataKey, { ...options, contentOnly: false });
        // update IndexedDB cache
        await setJSONinIDB(tempKey, result, { store: IDB_STORE_SKYDB_CACHE, })
      }
      else {
        // fetching loggedin users data from SkyDB
        entryObj = await getContent(publicKey, dataKey, { ...options, contentOnly: false });
        // update IndexedDB cache
        await setJSONinIDB(dataKey, entryObj, { store: IDB_STORE_SKAPP, })
      }
      // Return data
      return entryObj?.data;
    }
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return null
  }
}

export const getContent = async (publicKey, dataKey, options) => {
  //TODO - get privateKey from localstorage
  const privateKey = "";
  try {
    // Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys")
    }
    let registryEntry = await getRegistryEntry(publicKey, dataKey)
    //var { data, revision } =await skynetClient.db.getJSON(publicKey, 'profile'); 
    const { data, contentType, metadata, skylink } = await skynetClient.getFileContent(registryEntry.data);
    //const entryObj = await skynetClient.db.getJSON(publicKey, dataKey)
    const entryObj = { revision: registryEntry.revision, data }
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
export const putFile = async (publicKey, dataKey, content, options) => {
  // fetch private key from localstorage
  const privateKey = options.privateKey;
  try {
    // get previous skylink 
    // create linked list to track history
    if (options.historyflag == true) {
      const registryEntry = await getRegistryEntry(publicKey, dataKey)
      //const revision = (registryEntry ? registryEntry.revision : 0) + 1
      const skylink = registryEntry ? registryEntry.data : null
      content.prevSkylink = skylink
    }
    // set new data in SkyDB with
    let status = false
    // encrypt it
    if (options?.encrypt == true) {
      const cypherContent = await encryptData(privateKey, publicKey, JSON.stringify(content))
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
export const getRegistryEntry = async (publicKey, dataKey, options) => {
  try {
    // Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys")
    }
    let { entry, signature } = await skynetClient.registry.getEntry(publicKey, dataKey)
    entry.data = entry ? uint8ArrayToString(entry.data) : null
     return entry;
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return null
  }
  return null
}

export const setRegistryEntry = async (dataKey, content, options) => {
  let revision = 0;
  try {
    // fetch private key from localstorage
    const privateKey = options.privateKey ?? getProviderKeysByType("AGGREGATOR").privateKey;
    const publicKey = options.publicKey ?? getProviderKeysByType("AGGREGATOR").publicKey;
    if (options?.maxRevisionFlag) {
      revision = REGISTRY_MAX_REVISION;
    }
    else {
      let entry = await getRegistryEntry(publicKey, dataKey, null)
      revision = entry && entry != "undefined" && entry?.revision != NaN && entry.revision != "undefined" ? entry.revision : 0
      revision++;
    }
    let entry = { dataKey: dataKey, data: stringToUint8Array(content + ""), revision: BigInt(revision) };
    let value = await skynetClient.registry.setEntry(privateKey, entry);
    if (options.skipIDB && options.skipIDB != true) {
      await setJSONinIDB(dataKey, [BigInt(revision), content], options)
    }
    return { resultFlag: true, revision }
  } catch (error) {
    // setErrorMessage(error.message);
    console.log(`error.message ${error.message}`)
    return { resultFlag: false, revision }
  }
}

export async function getRegistryEntryURL(publicKey, dataKey) {
  try {
    const url = await skynetClient.registry.getEntryUrl(publicKey, dataKey);
    return url;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export const getSkylinkMetadata = async (skylink) => {
  try {
    const md = await skynetClient.getMetadata(skylink);
    return md;
  } catch (error) {
    console.log(error);
    return null;
  }
}
// TODO: below method can be removed once all functionality is implemented. From getSkylinkMetadata we shall get all data.
export const getSkylinkHeader = (skylink) => {
  //TODO: create URL from Skylink
  const skylinkUrl = getPortalUrl + skylink;
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
export const uploadFile = async (file) => {
  try {
    const md = await skynetClient.uploadFile(file);
    return md;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// this method will upload content and return skylink
export const uploadDirectory = async (files) => {
  try {
    // Get the directory name from the list of files.
    // Can also be named manually, i.e. if you build the files yourself
    // instead of getting them from an input form.
    const filename = getRootDirectory(files[0]);

    // Use reduce to build the map of files indexed by filepaths
    // (relative from the directory).
    const directory = files.reduce((accumulator, file) => {
      const path = getRelativeFilePath(file);

      return { ...accumulator, [path]: file };
    }, {});

    const skylink = await skynetClient.uploadDirectory(directory, filename);
  } catch (error) {
    console.log(error);
  }
}
export const snKeyPairFromSeed = (userSeed) => genKeyPairFromSeed(userSeed)

function stringToUint8Array(bufferString) {
	let uint8Array = new TextEncoder("utf-8").encode(bufferString);
	return uint8Array;
}
function uint8ArrayToString(bufferValue) {
	return new TextDecoder("utf-8").decode(bufferValue);
}

// export const getPublicApps = async (hash) =>
//   await fetch(
//     `${document.location.origin.indexOf("localhost") === -1
//       ? document.location.origin
//       : DEFAULT_PORTAL
//     }/${hash}`
//   ).then((res) => res.json())

// export const getSkylinkPublicShareFile = (arrApps) => {
//   const strArrApps = JSON.stringify(arrApps)
//   return new File([strArrApps], `public${new Date()}.txt`, {
//     type: "text/plain",
//     lastModified: new Date(),
//   })
// }
