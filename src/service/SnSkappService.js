import {
  BROWSER_STORAGE,
  STORAGE_USER_SESSION_KEY,
  FOLLOWER_PATH,
  FOLLOWING_PATH,
  DK_HOSTED_APPS,
  DK_PUBLISHED_APPS,
  DK_INSTALLED_APPS,
  EVENT_PUBLISHED_APP,
  EVENT_APP_VIEWED,
  EVENT_APP_ACCESSED,
  EVENT_APP_LIKED,
  EVENT_APP_LIKED_REMOVED,
  EVENT_APP_FAVORITE,
  EVENT_APP_FAVORITE_REMOVED,
  EVENT_APP_COMMENT,
  FAVORITE_REMOVED,
  EVENT_APP_INSTALLED,
  EVENT_APP_UNINSTALLED,
  ANONYMOUS,
  DK_AGGREGATED_PUBLISHED_APPS_STATS,
  DK_AGGREGATED_PUBLISHED_APPS
} from '../utils/SnConstants';
import {
  getJSONfromIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKAPP_AGGREGATED_DATA,
} from "../service/SnIndexedDB"
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { emitEvent } from "./SnSkyMQEventEmitter";
import { getProviderKeysByType, uploadFile, getRegistryEntry, setRegistryEntry, putFile, getFile, getRegistryEntryURL } from './SnSkynet'
import { getUserID, putFile_MySky, getFile_MySky, getContentDAC, getFeedDAC, getProfileDAC } from './skynet-api'
import { createDummyUserProfileObject } from '../utils/SnNewObject'

var _ = require('lodash');

// TODO: implement actual logic
function generateSkappId(prop) {
  return uuidv4();
}
// Provider Type: GEQ Provider, Aggregator, Validator, Moderator, Blocklist Manager
// This JS file will list app methods consumed by components

// ### User Profile Functionality ###
// null or publicKey
export const getProfile = async () => {
  //set options

  //return await getFile_MySky("userProfile", { skydb: true })?.data
  return JSON.parse(BROWSER_STORAGE.getItem('userProfile'));
  // getFile_MySky( "userProfile", { skydb: true })
}

export const setProfile = async (profileJSON) => {
  //set options
  //const resultObj = await putFile_MySky("userProfile", profileJSON, { skydb: true });
  //await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "userprofile", "action": "update" } });
  BROWSER_STORAGE.setItem('userProfile', JSON.stringify(profileJSON));
  // await putFile_MySky("userProfile", profileJSON, { skydb: true });
}

export const getPreferences = async () => {
  //set options
   return JSON.parse(BROWSER_STORAGE.getItem('userPreferences'));
  // return await getFile_MySky( "userPreferences", { skydb: true })

}
//export const setPreferences = async (preferencesJSON) => {
  //set options
  //const resultObj = await putFile_MySky("userPreferences", preferencesJSON, { skydb: true });
  //await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "preferences", "action": "update" } });
//}
export const setPreferences = async (preferencesJSON) => {
  //set options
  BROWSER_STORAGE.setItem("userPreferences", JSON.stringify(preferencesJSON));
}
// ### Following/Followers Functionality ###

// null or publicKey
export const getFollwers = (publicKey) => { }

// list of publicKeys
export const setFollwers = (publicKeys) => { }
export const setFollowersJSON = async (followersJSON, options) => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (followersJSON) {
      const resultObj = await putFile_MySky(FOLLOWER_PATH, followersJSON, options);
      await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "followers", "action": "add" } });
    }
  } catch (e) {
    return e
  }
  return ""
}

// null or publicKey
export const getFollwings = (publicKey) => { }

// list of publicKeys
export const setFollwings = (publicKeys) => { }
export const setFollowingsJSON = async (followingsJSON, options) => {
  const session = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  try {
    if (followingsJSON) {
      const resultObj = await putFile_MySky(FOLLOWING_PATH, followingsJSON, options)
      await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "following", "action": "add" } });
    }
  } catch (e) {
    return e
  }
  return ""
}

// ### Published Apps Functionality ###

export const getPublishedApp = async (appId) => {
  let publishedAppJSON = await getJSONfromIDB(appId, { store: IDB_STORE_SKAPP, });
  return publishedAppJSON;
}

export const getMyPublishedApps = async () => {
  //let publishedAppsMap = new Map();
  let publishedAppsMap = [];
  try {
    let { data: publishedAppsIdList } = await getFile_MySky(DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (appId) => {
        const resultObj = await getFile_MySky(appId, { store: IDB_STORE_SKAPP });
        publishedAppsMap.push(resultObj.data);
        await getContentDAC().recordInteraction({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "publishedApp", "skappID": appId, "action": "view" } });
      }));
      console.log("getMyPublishedApps: " + publishedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return publishedAppsMap;
  }
  return publishedAppsMap;
}

//Update published app and returns list of all Published apps by loggedin User.
export const publishApp = async (appJSON) => {
  //let publishedAppsIdList = await getFile_MySky( DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
  let { data: publishedAppsIdList } = await getFile_MySky(DK_PUBLISHED_APPS, { skydb: true });
  let firstTime = false;
  if (publishedAppsIdList) {
    if (!publishedAppsIdList.includes(appJSON.id)) {
      // update Index value
      publishedAppsIdList.push(appJSON.id);
      firstTime = true;
    }
  }
  else {
    publishedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile_MySky(DK_PUBLISHED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
  // update existing published app
  // add additional logic to link previously published App
  const resultObj = await putFile_MySky(appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
  //
  await emitEvent(appJSON.id, EVENT_PUBLISHED_APP);
  if (firstTime) {
    await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "publishedApp", "skappID": appJSON.id, "action": "created" } });
  }
  else {
    await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "publishedApp", "skappID": appJSON.id, "action": "updated" } });
  }
  const publishedAppsMap = await getMyPublishedApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return publishedAppsMap;
}

export const republishApp = async (appJSON) => {
  let { data: publishedAppsIdList } = await getFile_MySky(DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
  // check if appid is present in publishedAppsIdList.
  if (publishedAppsIdList && !publishedAppsIdList.includes(appJSON.id)) {
    // update Index value
    await putFile_MySky(DK_PUBLISHED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
    // update existing published app
    // add additional logic to link previously published App
    const resultObj = await putFile_MySky(appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
    await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "publishedApp", "skappID": appJSON.id, "action": "updated" } });
    await emitEvent(appJSON.id, EVENT_PUBLISHED_APP);
    //await addToSkappUserFollowing(userPubKey);
    //await addToSharedApps(userPubKey, appJSON.id);
  }
  else {
    console.log("app is not published. first publish app, then only you can EDIT app");
  }
  const publishedAppsMap = await getMyPublishedApps();
  return publishedAppsMap;
}
export const installApp = async (appJSON) => {
  let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
  let firstTime = false;
  if (installedAppsIdList) {
    //app should not already be installed
    if (!installedAppsIdList.includes(appJSON.id)) {
      installedAppsIdList.push(appJSON.id);
      firstTime = true;
    }
    else {
      const installedAppsMap = await getMyInstalledApps();
      //await addToSkappUserFollowing(userPubKey);
      //await addToSharedApps(userPubKey, appJSON.id);
      return installedAppsMap;
    }
  }
  else {
    installedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile_MySky(DK_INSTALLED_APPS, installedAppsIdList, { store: IDB_STORE_SKAPP });
  // update existing published app
  // add additional logic to link previously published App
  const resultObj = await putFile_MySky(`${appJSON.id}#installed`, appJSON, { store: IDB_STORE_SKAPP })
  await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "pinned", "skappID": appJSON.id, "action": "created" } });
  await emitEvent(appJSON.id, EVENT_APP_INSTALLED);
  const installedAppsMap = await getMyInstalledApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return installedAppsMap;
}

export const uninstallApp = async (appId) => {
  let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
  if (installedAppsIdList) {
    //app should already be installed for uninstall
    if (installedAppsIdList.includes(appId)) {
      installedAppsIdList.splice(installedAppsIdList.indexOf(appId), 1);
      //set updated list
      await putFile_MySky(DK_INSTALLED_APPS, installedAppsIdList, { store: IDB_STORE_SKAPP });
      // update existing published app
      // add additional logic to link previously published App// set empty value
      const resultObj = await putFile_MySky(`${appId}#installed`, {}, { store: IDB_STORE_SKAPP })
      await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "pinned", "skappID": appId, "action": "removed" } });
      await emitEvent(appId, EVENT_APP_UNINSTALLED);
    }
  }
  const installedAppsMap = await getMyInstalledApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return installedAppsMap;
}

export const getMyInstalledApps = async () => {
  //let publishedAppsMap = new Map();
  let installedAppsMap = [];
  try {
    let { data: installedAppsIdList } = await getFile_MySky(DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
    if (installedAppsIdList) {
      await Promise.all(installedAppsIdList.map(async (appId) => {
        const resultObj = await getFile_MySky(`${appId}#installed`, { store: IDB_STORE_SKAPP });
        installedAppsMap.push(resultObj.data);
        await getContentDAC().recordInteraction({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "pinned", "skappID": appId, "action": "view" } });
      }));
      console.log("getMyInstalledAppsMap: " + installedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return installedAppsMap;
  }
  return installedAppsMap;
}


export const setAppStatsEvent = async (statsEventType, appId) => {
  let appStatsStr = "0#0#0#0"; // View#access#likes#fav
  let userID = getUserID() ?? ANONYMOUS; // ANONYMOUS : user is not loggedIn
  let appStatsList = null;
  let resultObj = null;
  try {
    // Get Data from IDX-DB
    //appStatsJSON = await getFile_MySky(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
    if (userID != ANONYMOUS) {
      // STEP1: get current value from Users Storage
      // let appStatsEntry = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`, { store: IDB_STORE_SKAPP, });
      // appStatsStr = appStatsEntry?.data ?? "0#0#0#0";// View#access#likes#fav
      resultObj = await getFile_MySky(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
      appStatsStr = resultObj?.data?.stats ?? "0#0#0#0";// View#access#likes#fav
      //{ views: parseInt(appStatsList[0]), access: parseInt(appStatsList[1]), likes: parseInt(appStatsList[2]), favorites: parseInt(appStatsList[3]) }
    }
    appStatsList = appStatsStr.split('#');
    switch (statsEventType) {
      case EVENT_APP_VIEWED:
        appStatsList[0] = parseInt(appStatsList[0]) + 1;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "viewed" } });
        break;
      case EVENT_APP_ACCESSED:
        appStatsList[1] = parseInt(appStatsList[1]) + 1;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "accessed" } });
        break;
      case EVENT_APP_LIKED:
        appStatsList[2] = 1;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "liked" } });
        break;
      case EVENT_APP_LIKED_REMOVED:
        appStatsList[2] = 0;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "unliked" } });
        break;
      case EVENT_APP_FAVORITE:
        appStatsList[3] = 1;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "favorite" } });
        break;
      case EVENT_APP_FAVORITE_REMOVED:
        appStatsList[3] = 0;
        await getContentDAC().recordInteraction({ skylink: resultObj?.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "unfavorite" } });
        break;
      default:
        console.log("In Dafault loop: " + statsEventType)
        break;
    }
    if (userID != ANONYMOUS) {
      //await setRegistryEntry(`${appId}#stats`, appStatsList.join("#"), { store: IDB_STORE_SKAPP, });
      await putFile_MySky(`${appId}#stats`, { stats: appStatsList.join("#") }, { store: IDB_STORE_SKAPP, });
    }
    await emitEvent(appId, statsEventType);
  } catch (err) {
    console.log(err);
    return appStatsList;
  }
  return appStatsList;
}

// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = async (appId) => {
  // Get Data from IDX-DB
  //let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
  // let appStatsStr = (appStatsObj && appStatsObj[1]) ?? "0#0#0#0"
  // let appStatsList = appStatsStr.split("#"); // View#access#likes#fav
  let resultObj = await getFile_MySky(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
  //let appStatsObj = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`);
  await getContentDAC().recordInteraction({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": appId, "action": "statsViewed" } });
  let appStatsList = (resultObj?.data?.stats ?? "0#0#0#0").split("#");
  return appStatsList;
}

// get apps comments - 
export const setAppComment = async (appId, comment) => {
  let commentObj = {
    timestamp: new Date(),
    comment,
  };
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, { store: IDB_STORE_SKAPP, });
  if (appCommentsJSON === null) { //If null or empty
    // TODO: create and return new empty stats object
  }
  appCommentsJSON.content.comments.push(commentObj);
  const resultObj = await setJSONinIDB(`${appId}appComments`, appCommentsJSON, { store: IDB_STORE_SKAPP });
  await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "comments", "skappID": appId, "action": "created" } });

}

// pass list of appIds to get App Comments.
export const getAppComments = async (appId) => {
  let appCommentsJSON = await getJSONfromIDB(`${appId}#appComments`, { store: IDB_STORE_SKAPP, });
  return appCommentsJSON;
}

//action for upload videos and images
export const UploadAppLogo = async (file, setLogoUploaded, logoLoaderHandler) => {
  try {
    const getCompressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 256,
      useWebWorker: true,
    });
    const skylinkForCompressed = await uploadFile(getCompressed);
    const skylink = await uploadFile(file);
    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      image: skylink.skylink,
    };
    setLogoUploaded(obj);
    logoLoaderHandler(false);
  } catch (err) {
    logoLoaderHandler(false);
  }
};

export const UploadImagesAction = async (file, getUploadedFile, getFun) => {
  try {
    const getCompressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 256,
      useWebWorker: true,
    });

    const skylinkForCompressed = await uploadFile(getCompressed);

    const skylink = await uploadFile(file);

    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      image: skylink.skylink,
    };

    getUploadedFile(obj);
    getFun(false);
  } catch (err) {
    getFun(false);
    console.log(err);
  }
};

export const UploadVideoAction = async (file, thumb, getUploadedFile, videoUploadLoader) => {
  try {
    const skylinkForCompressed = await uploadFile(thumb);

    const skylink = await uploadFile(file);

    let obj = {
      thumbnail: skylinkForCompressed.skylink,
      video: skylink.skylink,
    };

    getUploadedFile(obj);
    videoUploadLoader(false);
  } catch (err) {
    videoUploadLoader(false);
    console.log(err);
  }
};

// ### AppStore Functionality ###

// Returns all Apps data(JSON) from List of Devs I am Following
export const getMyAppStore = () => { }

// Returns all Apps data(JSON) from "Skapp Developer"
export const getDefaultAppStore = () => { }

// ### Hosting Functionality ###

// get my all hosted apps. Returns List of JSONS
/**
 * 
 * @param { Array } appIds[] Optional. Do not pass argument to get only the list of IDs. Pass a blank array to get list of all hosted apps. 
 * Pass array with values in it get app list of the provided hosted apps.
 * 
 *
 */
export const getMyHostedApps = async (appIds) => {
  const hostedAppIdList = { appIdList: [], appDetailsList: {} }
  try {
    if (appIds == null || appIds.length === 0) {
      let { data } = await getFile_MySky(DK_HOSTED_APPS, { store: IDB_STORE_SKAPP });
      hostedAppIdList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 && await Promise.all(appIds.map(async (appId) => {
      const resultObj = await getFile_MySky(`${appId}#hosted`, { store: IDB_STORE_SKAPP });
      hostedAppIdList.appDetailsList[appId] = resultObj.data;
      await getContentDAC().recordInteraction({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "hosted", "skappID": appId, "action": "viewed" } });
    }));
    return hostedAppIdList;
  } catch (err) {
    console.log(err);
  }
}

//Update published app data
export const setMyHostedApp = async (appJSON, previousId) => {

  const hostedAppIdList = (await getMyHostedApps())?.appIdList || [];
  const ts = new Date().getTime();
  let history = {};
  history[ts] = appJSON.skylink;
  const id = previousId ? previousId : generateSkappId();
  let appVersion = "1";
  let previousApp;
  if (previousId) {
    previousApp = (await getMyHostedApps([previousId])).appDetailsList[previousId];
    appVersion = parseInt(previousApp.version) + 1;
    history = { ...previousApp.content.history, ...history };
  }
  const hostedAppJSON = {
    "$type": "skapp",
    "$subType": "hosted",
    "createdTs": previousApp ? previousApp.createdTs : ts,
    id,
    "version": appVersion,
    "prevSkylink": previousApp ? previousApp.content.skylink : null,
    "content": {
      ...appJSON,
      history
    },
    ts
  };
  //alert("previousId" + previousId);
  const resultObj = await putFile_MySky(`${id}#hosted`, hostedAppJSON, { store: IDB_STORE_SKAPP });
  await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "hosted", "skappID": appJSON.id, "action": "created" } });
  if (previousId === "" || previousId === null || previousId === undefined) {
    //alert("adding in array" + previousId);
    await putFile_MySky(DK_HOSTED_APPS, [...hostedAppIdList, id], { store: IDB_STORE_SKAPP });
  }
  return hostedAppJSON;
}

export const deleteMyHostedApp = async (appId) => {
  let status = false;
  try {
    const hostedAppIdList = (await getMyHostedApps())?.appIdList || [];
    hostedAppIdList.splice(hostedAppIdList.indexOf(appId), 1);
    const resultObj = await putFile_MySky(`${appId}#hosted`, {}, { store: IDB_STORE_SKAPP });
    await getContentDAC().recordNewContent({ skylink: resultObj.skylink, metadata: { "contentType": "skapp", "contentSubType": "hosted", "skappID": appId, "action": "removed" } });
    await putFile_MySky(DK_HOSTED_APPS, [...hostedAppIdList], { store: IDB_STORE_SKAPP });
    status = true;
  }
  catch (e) {
    console.log("deleteMyHostedApp : Error deleting  = " + appId)
  }
  return status;
}

//set HNS Entry. Everytime app is deployed this method must be called. else handshake name wont be updated with new skylink
export const setHNSEntry = (hnsName, skylink) => { }

//get HNS URL for TXT record
//export const getHNSSkyDBURL = (hnsName) => getRegistryEntryURL(getUserPublicKey(), hnsName);
export const getHNSSkyDBURL = (hnsName) => getRegistryEntryURL(getUserID(), hnsName);

export const initializeLocalDatabaseFromBackup = async () => {
  try {
  } catch (e) { }
}

export const backupLocalDatabaseOnSkyDB = async () => {
  try {
  } catch (e) { }
}

export const getUserProfile = async (userID) => {
  // let profileJSON = await getFile(session, SKYID_PROFILE_PATH);
  let userProfileObj = createDummyUserProfileObject();
  userProfileObj.userID = userID;
  //await getContentDAC().recordNewContent({skylink: resultObj.skylink,metadata: {"contentType":"skapp","contentSubType":"hosted","skappID":appJSON.id,"action":"removed"}});
  //TODO: KUSHAL - call userprofile DAC

  //const response = await getFile(session.mySky.userID, SKYID_PROFILE_PATH, { skydb: true })
  // if (response == "" || response == undefined) {
  //   // file not found
  //   console.log("Profile not found;, please check your connection and retry")
  // } else {
  //   // success
  //   //let temp = JSON.stringify(response);
  //   let skyIdProfileObj = JSON.parse(response);
  //   const { publicKey, privateKey } = snKeyPairFromSeed(session.skyid.seed)
  //   personObj = {
  //     masterPublicKey: session.skyid.userId, // public key derived from "master seed". we pull profile using this public key
  //     appSeed: session.skyid.seed, // App specific seed derived from "Master Seed"
  //     appId: session.skyid.appId,
  //     appImg: session.skyid.appImg,
  //     appPublicKey: publicKey,
  //     appPrivateKey: privateKey,
  //     profile: {
  //       username: skyIdProfileObj.username, // user name is associated with master Key
  //       did: skyIdProfileObj.username, // this is place holder for Decentralized Id (DID)
  //       aboutme: skyIdProfileObj.aboutMe,
  //       location: skyIdProfileObj.location,
  //       avatar: skyIdProfileObj.avatar,
  //       profilePicture: skyIdProfileObj.profilePicture,
  //     },
  //   }
  // }
  return userProfileObj
}


//#################### SkyDB Methods #########################
// After SKAPP DAC is integrated, move this methods to DAC setter and getter methods
//########################################################
export const getAllPublishedApps = async (sortOn, orderBy, resultCount) => {
  // TODO: Check Sorting in App stats first and then load remaining appIDs
  //let publishedAppsMap = new Map();
  let allPublishedApps = [];
  try {
    // april 25th 
    // let publishedAppsIdList = await getFile(getProviderKeysByType("AGGREGATOR").publicKey, DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
    //let publishedAppsIdList = await getFile(null, DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    let publishedAppsIdList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    let publishedAppsStatsList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS_STATS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });

    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (pubkeyAndAppId) => {
        let temp = pubkeyAndAppId.split('#'); //userID#appId
        //let appJSON = await getFile(null, temp[1], { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: temp[0]})// TODO: need to fix IDB store
        let { data: appJSON, skylink } = await getFile_MySky(temp[1], { userID: temp[0] });
        await getContentDAC().recordInteraction({ skylink: skylink, metadata: { "contentType": "skapp", "contentSubType": "published", "skappID": temp[1], "action": "viewed" } });
        if (appJSON) { // if no appJSON found in user SkyDB, skip and move on to next appId
          // Read appStats from Aggregator Storage and update AppJSON
          let appStats = "0#0#0#0";
          let appStatsList = [];
          try {
            //let tempEntry = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, temp[1] + "#stats");
            appStats = publishedAppsStatsList?.appStatsList[appJSON.id] ?? "0#0#0#0";
            appStatsList = appStats.split('#');
            // View#access#likes#fav
            appJSON.content.appstats = { views: parseInt(appStatsList[0]), access: parseInt(appStatsList[1]), likes: parseInt(appStatsList[2]), favorites: parseInt(appStatsList[3]) };
          } catch (e) {
            console.log("getAllPublishedApps: e" + e);
          }
          // let appStats = "0#0#0#0";
          // let appStatsList = [];
          // try {
          //   let tempEntry = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, temp[1] + "#stats");
          //   appStats = tempEntry ? tempEntry.data : "0#0#0#0";
          //   appStatsList = appStats.split('#');
          //   // View#access#likes#fav
          //   appJSON.content.appstats = { views: parseInt(appStatsList[0]), access: parseInt(appStatsList[1]), likes: parseInt(appStatsList[2]), favorites: parseInt(appStatsList[3]) };
          // } catch (e) {
          //   console.log("getAllPublishedApps: e" + e);
          // }
          allPublishedApps.push(appJSON);
        }
      }));
      // Sort list by specific parameter
      let iteratees = obj => -obj.content.appstats.views;
      switch (sortOn) {
        case "VIEWS":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.views : -obj.content.appstats.views;
          break;
        case "ACCESS":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.access : -obj.content.appstats.access;
          break;
        case "LIKES":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.likes : -obj.content.appstats.likes;
          break;
        case "FAVORITES":
          iteratees = obj => (orderBy === "ASC") ? obj.content.appstats.favorites : -obj.content.appstats.favorites;
          break;
        default:
          iteratees = obj => -obj.content.appstats.views;
          console.log("In Dafault sorting 'Views Desc' ");
          break;
      }
      allPublishedApps = _.orderBy(allPublishedApps, iteratees)
      if (resultCount && resultCount != 0) {
        allPublishedApps = allPublishedApps.slice(0, resultCount);
      }
      console.log("allPublishedApps: " + allPublishedApps);
    }
  } catch (err) {
    console.log(err);
    return allPublishedApps;
  }
  return allPublishedApps;
}

export const getAggregatedAppStatsByAppId = async (appId) => {
  // Get Data from IDX-DB
  let appStatsObj = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, `${appId}#stats`);
  // let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, });
  let appStatsList = (appStatsObj?.data?.stats ?? "0#0#0#0").split("#"); // View#access#likes#fav
  //await getContentDAC().recordInteraction({skylink: resultObj.skylink,metadata: {"contentType":"skapp","contentSubType":"published","skappID":appJSON.id,"action":"viewed"}});
  return appStatsList;
}

export const getAggregatedAppStats = async (appIds) => {
  let appStatsList = { appIdList: [], appStatsList: {} };
  // get all appId from PublishedApp
  try {
    // we can improve here by pagination
    // Fetch all AppStats
    appStatsList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS_STATS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });

    // if (appIds == null || appIds.length === 0) {
    //   let publishedAppsIdList = await getFile(null, DK_AGGREGATED_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    //   //let {data} = await getFile_MySky(DK_AGGREGATED_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
    //   appStatsList.appIdList = publishedAppsIdList;
    //   appIds = appIds?.length === 0 ? publishedAppsIdList : appIds;
    // }
    // appIds?.length > 0 && await Promise.all(appIds.map(async (userIDAndAppId) => {
    //   let temp = userIDAndAppId.split('#'); //userID#appId
    //   const aggStatsByAppID = await getFile(null, temp[1] + "#stats", { store: IDB_STORE_SKAPP_AGGREGATED_DATA, publicKey: getProviderKeysByType("AGGREGATOR").publicKey });
    //   //appStatsList.appStatsList[temp[1]] = (await getFile_MySky( `${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA }))?.data;
    //   appStatsList.appStatsList[temp[1]] = aggStatsByAppID;
    // }));
    return appStatsList;
  } catch (err) {
    console.log(err);
    return 
  }
}
// ### Apps Stats and comments Functionality ###
