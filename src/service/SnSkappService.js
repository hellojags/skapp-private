import {
  APPSTORE_PROVIDER_MASTER_PUBKEY,
  BLOCKSTACK_CORE_NAMES,
  BROWSER_STORAGE,
  ID_PROVIDER_BLOCKSTACK,
  ID_PROVIDER_SKYDB,
  ID_PROVIDER_SKYID,
  STORAGE_USER_SESSION_KEY,
  DK_IDB_SKYSPACES,
  FAILED,
  FAILED_DECRYPT_ERR,
  FOLLOWER_PATH,
  FOLLOWING_PATH,
  HISTORY_FILEPATH,
  IDB_IS_OUT_OF_SYNC,
  IDB_LAST_SYNC_REVISION_NO,
  ID_PROVIDER,
  IGNORE_PATH_IN_BACKUP,
  PUBLIC_KEY_PATH,
  SHARED_BY_USER_FILEPATH,
  SHARED_PATH_PREFIX,
  SHARED_WITH_FILE_PATH,
  SKAPP_PROFILE_PATH,
  SKYID_PROFILE_PATH,
  SKYLINK_IDX_FILEPATH,
  SKYLINK_PATH,
  SKYNET_PORTALS_FILEPATH,
  SKYSPACE_IDX_FILEPATH,
  SKYSPACE_PATH,
  SUCCESS,
  USERSETTINGS_FILEPATH,
  DK_HOSTED_APPS,
  DK_PUBLISHED_APPS,
  DK_INSTALLED_APPS,
  DK_UNINSTALLED_APPS,
  SKAPP_FOLLOWING_FILEPATH,
  SKAPP_SHARED_APPS_FILEPATH,
  SKAPP_SHARED_APPS_KEY_SEPERATOR,
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
} from '../utils/SnConstants';
import {
  getAllItemsFromIDB,
  getJSONfromIDB,
  setAllinIDB,
  setJSONinIDB,
  IDB_STORE_SKAPP,
  IDB_STORE_SKAPP_AGGREGATED_DATA,
} from "../service/SnIndexedDB"
import store from "../redux"
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { emitEvent } from "./SnSkyMQEventEmitter";
import { isNull } from 'lodash';
import { getProviderKeysByType, uploadFile, getRegistryEntry, setRegistryEntry, putFile, getFile, getRegistryEntryURL } from './SnSkynet'
import { getUserPublicKey, putFile_MySky, getFile_MySky } from './skynet-api'
import { INITIAL_SKYDB_OBJ, createDummyUserProfileObject } from '../utils/SnNewObject'

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
  return JSON.parse(BROWSER_STORAGE.getItem('userProfile'));
  // getFile_MySky( "userProfile", { skydb: true })
}

export const setProfile = async (profileJSON) => {
  //set options
  BROWSER_STORAGE.setItem('userProfile', JSON.stringify(profileJSON));
  // await putFile_MySky("userProfile", profileJSON, { skydb: true });
}

export const getPreferences = async () => {
  //set options
  return await getFile_MySky( "userPreferences", { skydb: true })
}
export const setPreferences = async (preferencesJSON) => {
  //set options
  await putFile_MySky("userPreferences", preferencesJSON, { skydb: true });
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
      await putFile_MySky(FOLLOWER_PATH, followersJSON, options)
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
      await putFile_MySky(FOLLOWING_PATH, followingsJSON, options)
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
    let publishedAppsIdList = await getFile_MySky( DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (appId) => {
        publishedAppsMap.push((await getFile_MySky( appId, { store: IDB_STORE_SKAPP })));
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
  let publishedAppsIdList = await getFile_MySky( DK_PUBLISHED_APPS, { skydb: true });

  if (publishedAppsIdList) {
    if (!publishedAppsIdList.includes(appJSON.id)) {
      // update Index value
      publishedAppsIdList.push(appJSON.id);
    }
  }
  else {
    publishedAppsIdList = [appJSON.id];
  }
  // update Index value
  await putFile_MySky(DK_PUBLISHED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
  // update existing published app
  // add additional logic to link previously published App
  await putFile_MySky(appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
  await emitEvent(appJSON.id, EVENT_PUBLISHED_APP);
  const publishedAppsMap = await getMyPublishedApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return publishedAppsMap;
}

export const republishApp = async (appJSON) => {
  let publishedAppsIdList = await getFile_MySky( DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP });
  // check if appid is present in publishedAppsIdList.
  if (publishedAppsIdList && !publishedAppsIdList.includes(appJSON.id)) {
    // update Index value
    await putFile_MySky(DK_PUBLISHED_APPS, publishedAppsIdList, { store: IDB_STORE_SKAPP });
    // update existing published app
    // add additional logic to link previously published App
    await putFile_MySky(appJSON.id, appJSON, { store: IDB_STORE_SKAPP })
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
  let installedAppsIdList = await getFile_MySky( DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
  if (installedAppsIdList) {
    //app should not already be installed
    if (!installedAppsIdList.includes(appJSON.id)) {
      installedAppsIdList.push(appJSON.id);
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
  await putFile_MySky(`${appJSON.id}#installed`, appJSON, { store: IDB_STORE_SKAPP })
  await emitEvent(appJSON.id, EVENT_APP_INSTALLED);
  const installedAppsMap = await getMyInstalledApps();
  //await addToSkappUserFollowing(userPubKey);
  //await addToSharedApps(userPubKey, appJSON.id);
  return installedAppsMap;
}

export const uninstallApp = async (appId) => {
  let installedAppsIdList = await getFile_MySky( DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
  if (installedAppsIdList) {
    //app should already be installed for uninstall
    if (installedAppsIdList.includes(appId)) {
      installedAppsIdList.splice(installedAppsIdList.indexOf(appId), 1);
      //set updated list
      await putFile_MySky(DK_INSTALLED_APPS, installedAppsIdList, { store: IDB_STORE_SKAPP });
      // update existing published app
      // add additional logic to link previously published App// set empty value
      await putFile_MySky(`${appId}#installed`, {}, { store: IDB_STORE_SKAPP })
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
    let installedAppsIdList = await getFile_MySky( DK_INSTALLED_APPS, { store: IDB_STORE_SKAPP });
    if (installedAppsIdList) {
      await Promise.all(installedAppsIdList.map(async (appId) => {
        installedAppsMap.push((await getFile_MySky( `${appId}#installed`, { store: IDB_STORE_SKAPP })));
      }));
      console.log("getMyInstalledAppsMap: " + installedAppsMap);
    }
  } catch (err) {
    console.log(err);
    return installedAppsMap;
  }
  return installedAppsMap;
}

export const newSharedAppValObj = () => {
  return {
    viewCount: 0,
    visitCount: 0
  }
}



// need to optimize below method
export const getAggregatedAppStats = async (appIds) => {
  // get all appId from PublishedApp
  // Fetch all AppStats

  const appStatsList = { appIdList: [], appStatsList: {} }
  try {
    if (appIds == null || appIds.length === 0) {
      const data = await getFile_MySky( DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
      appStatsList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 && await Promise.all(appIds.map(async (appId) => {
      appStatsList.appStatsList[appId] = (await getFile_MySky( `${appId}#stats`, { store: IDB_STORE_SKAPP_AGGREGATED_DATA }));
    }));
    return appStatsList;
  } catch (err) {
    console.log(err);
  }
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
  await setJSONinIDB(`${appId}appComments`, appCommentsJSON, { store: IDB_STORE_SKAPP });
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
      const data = await getFile_MySky( DK_HOSTED_APPS, { store: IDB_STORE_SKAPP });
      hostedAppIdList.appIdList = data;
      appIds = appIds?.length === 0 ? data : appIds;
    }
    appIds?.length > 0 && await Promise.all(appIds.map(async (appId) => {
      hostedAppIdList.appDetailsList[appId] = (await getFile_MySky( `${appId}#hosted`, { store: IDB_STORE_SKAPP }));
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
  await putFile_MySky(`${id}#hosted`, hostedAppJSON, { store: IDB_STORE_SKAPP });
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
    await putFile_MySky(`${appId}#hosted`, {}, { store: IDB_STORE_SKAPP });
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
export const getHNSSkyDBURL = (hnsName) => getRegistryEntryURL(getUserPublicKey(), hnsName);


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

//####################

export const getAllPublishedApps = async (sortOn, orderBy, resultCount) => {
  //let publishedAppsMap = new Map();
  let allPublishedApps = [];
  try {
    let publishedAppsIdList = await getFile(getProviderKeysByType("AGGREGATOR").publicKey, DK_PUBLISHED_APPS, { store: IDB_STORE_SKAPP_AGGREGATED_DATA });
    if (publishedAppsIdList) {
      await Promise.all(publishedAppsIdList.map(async (pubkeyAndAppId) => {
        let temp = pubkeyAndAppId.split('#'); //userPubkey#appId
        let appJSON = await getFile(temp[0], temp[1], { store: IDB_STORE_SKAPP_AGGREGATED_DATA })
        if (appJSON) { // if no appJSON found in user SkyDB, skip and move on to next appId
          // Read appStats from Aggregator Storage and update AppJSON
          let appStats = "0#0#0#0";
          let appStatsList = [];
          try {
            let tempEntry = await getRegistryEntry(getProviderKeysByType("AGGREGATOR").publicKey, temp[1] + "#stats");
            appStats = tempEntry ? tempEntry.data : "0#0#0#0";
            appStatsList = appStats.split('#');
            // View#access#likes#fav
            appJSON.content.appstats = { views: parseInt(appStatsList[0]), access: parseInt(appStatsList[1]), likes: parseInt(appStatsList[2]), favorites: parseInt(appStatsList[3]) };
          } catch (e) {
            console.log("getAllPublishedApps: e" + e);
          }
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
  let appStatsList = (appStatsObj?.data ?? "0#0#0#0").split("#"); // View#access#likes#fav
  return appStatsList;
}

// pass list of appIds to get AppStats. Fav, Viewed, liked, accessed
export const getAppStats = async (appId) => {
  // Get Data from IDX-DB
  //let appStatsObj = await getJSONfromIDB(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
  // let appStatsStr = (appStatsObj && appStatsObj[1]) ?? "0#0#0#0"
  // let appStatsList = appStatsStr.split("#"); // View#access#likes#fav

  let appStatsObj = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`);
  let appStatsList = (appStatsObj?.data ?? "0#0#0#0").split("#");
  return appStatsList;
}

// ### Apps Stats and comments Functionality ###
export const setAppStatsEvent = async (statsEventType, appId) => {
  let appStatsStr = "0#0#0#0"; // View#access#likes#fav
  let publicKey = getUserPublicKey() ?? ANONYMOUS;
  let appStatsList = null;
  try {
    // Get Data from IDX-DB
    //appStatsJSON = await getFile_MySky(`${appId}#stats`, { store: IDB_STORE_SKAPP, });
    if (publicKey != ANONYMOUS) {
      // STEP1: get current value from Users Storage
      let appStatsEntry = await getRegistryEntry(getUserPublicKey(), `${appId}#stats`, { store: IDB_STORE_SKAPP, });
      appStatsStr = appStatsEntry?.data ?? "0#0#0#0";// View#access#likes#fav
    }
    appStatsList = appStatsStr.split('#');
    switch (statsEventType) {
      case EVENT_APP_VIEWED:
        appStatsList[0] = parseInt(appStatsList[0]) + 1;
        break;
      case EVENT_APP_ACCESSED:
        appStatsList[1] = parseInt(appStatsList[1]) + 1;
        break;
      case EVENT_APP_LIKED:
        appStatsList[2] = 1;
        break;
      case EVENT_APP_LIKED_REMOVED:
        appStatsList[2] = 0;
        break;
      case EVENT_APP_FAVORITE:
        appStatsList[3] = 1;
        break;
      case EVENT_APP_FAVORITE_REMOVED:
        appStatsList[3] = 0;
        break;
      default:
        console.log("In Dafault loop: " + statsEventType)
        break;
    }
    if (publicKey != ANONYMOUS) {
      await setRegistryEntry(`${appId}#stats`, appStatsList.join("#"), { store: IDB_STORE_SKAPP, });
    }
    await emitEvent(appId, statsEventType);
    // if (statsType === LIKES) {
    //   appStatsJSON.content.liked = value;
    //   await setRegistryEntry(`${appId}#${LIKES}`, value, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_LIKED)
    // } if (statsType === FAVORITE) {
    //   appStatsJSON.content.favorite = value;
    //   await setRegistryEntry(`${appId}#${FAVORITE}`, value, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_FAVORITE)
    // } if (statsType === VIEW_COUNT) {
    //   appStatsJSON.content.viewed++;
    //   let entry = await getRegistryEntry(getUserPublicKey(), `${appId}#${VIEW_COUNT}`, {});
    //   await setRegistryEntry(`${appId}#${VIEW_COUNT}`, parseInt(entry?.data ?? "0") + 1, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_VIEWED)
    // } if (statsType === ACCESS_COUNT) {
    //   appStatsJSON.content.accessed++;
    //   let entry = await getRegistryEntry(getUserPublicKey(), `${appId}#${ACCESS_COUNT}`, {});
    //   await setRegistryEntry(`${appId}#${ACCESS_COUNT}`, parseInt(entry?.data ?? "0") + 1, { store: IDB_STORE_SKAPP, });
    //   await emitEvent(appId, EVENT_APP_ACCESSED)
    // }
    // update IDX-DB with new value
    // await putFile_MySky( `${appId}#stats`, appStatsJSON, { store: IDB_STORE_SKAPP })
    //.then(() => {
    // pushRoute(url);
  } catch (err) {
    console.log(err);
    return appStatsList;
  }
  return appStatsList;
}