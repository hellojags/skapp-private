import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { SkynetClient, SkyFile, FileID, User, FileType , parseSkylink} from "skynet-js";
import { of } from 'rxjs';
import prettyBytes from 'pretty-bytes';
import { DEFAULT_PORTAL } from "../sn.constants";
import { getAllPublicApps } from '../sn.util';
import { getPortalFromUserSetting, getCompressedImageFile, generateThumbnailFromVideo, videoToImg } from "../sn.util";

import {
  getFile,
  putFile,
  deleteFile,
  generateSkyhubId,
  listFiles,
  encryptContent,
  decryptContent,
  putFileForShared
} from '../blockstack/utils';
import {
  SKYLINK_PATH,
  SHARED_WITH_FILE_PATH,
  SKYLINK_IDX_FILEPATH,
  SKYSPACE_PATH,
  SKYSPACE_IDX_FILEPATH,
  ID_PROVIDER,
  createSkylinkIdxObject,
  INITIAL_SETTINGS_OBJ,
  INITIAL_PORTALS_OBJ,
  HISTORY_FILEPATH,
  USERSETTINGS_FILEPATH, SKYNET_PORTALS_FILEPATH, SUCCESS, FAILED, createSkySpaceObject,
  FAILED_DECRYPT_ERR,
  IGNORE_PATH_IN_BACKUP,
  PUBLIC_KEY_PATH,
  SHARED_PATH_PREFIX,
  GAIA_HUB_URL
} from '../blockstack/constants';

export const getSkylinkHeader = (skylinkUrl) => ajax({
  url: skylinkUrl+"?format=concat",
  method: "HEAD",
  responseType: "",
  }).pipe(
    map((res) => {
        let headerMap = {};
        let contentType = res.xhr.getResponseHeader('content-type');
        headerMap["contentType"] = contentType;
        console.log("contentType:"+contentType);
        let contentLength = res.xhr.getResponseHeader('content-length');
        headerMap["contentLength"] = contentLength ? prettyBytes(Number(contentLength)):"";
        console.log("contentLength:"+contentLength);
        let skynetFileMetadata = res.xhr.getResponseHeader('Skynet-File-Metadata');
        headerMap["skynetFileMetadata"] = skynetFileMetadata;
        //console.log("skynetFileMetadata:"+skynetFileMetadata);
        //let headerParams = res.xhr.getAllResponseHeaders();
        //console.log("headerParams"+headerParams);
        //console.log("headerMap: "+headerMap);
        return headerMap;
    }),
    catchError(error => {
      console.log('getSkylinkHeader::error: ', error);
      return of(error);
    })
  );


export const uploadToSkynet = async(file, skynetClient)=> await skynetClient.upload(file);

export const getPublicApps = async (hash)=> await fetch((document.location.origin.indexOf("localhost")===-1 ? document.location.origin :  DEFAULT_PORTAL)+"/"+hash).then(res=>res.json());

export const getSkylinkPublicShareFile = (arrApps) => {
  const strArrApps = JSON.stringify(arrApps);
  return new File([strArrApps], "public"+new Date()+".txt", {type: "text/plain", lastModified: new Date()});
}

export const savePublicSpace = async (publicHash, inMemObj) => {
  const publicHashData = await getPublicApps(publicHash);
  const skappListToSave = getAllPublicApps(publicHashData.data, inMemObj.addedSkapps, inMemObj.deletedSkapps);
  publicHashData.history[publicHashData.history.length - 1].skylink = publicHash;
  publicHashData.history.push({
    creationDate: new Date()
  });
  publicHashData.data = skappListToSave;
  const skylinkListFile = getSkylinkPublicShareFile(publicHashData);
  const portal = document.location.origin.indexOf("localhost") === -1 ? document.location.origin : DEFAULT_PORTAL;
  const uploadedContent = await new SkynetClient(portal).upload(skylinkListFile);
  return uploadedContent;
};



export const submitSkapp = async (skylinkObj) => {
  // TODO: Need to append to UserMaster List. Currently its overwriting
  const skynetClient = new SkynetClient("https://siasky.net");
  try {
    const skappOwner_name="skappowner";
    const skappOwner_password="skappowner001";
    //Get User Public Key
    const skappOwnerUser = new User(skappOwner_name,skappOwner_password);
    const skappOwnerUserId=skappOwnerUser.id;
    console.log("appUser:id "+skappOwnerUser.id);
    console.log("appUser:PubKey "+skappOwnerUser.publicKey);
    if (skappOwnerUser == null) {
      throw new Error("User Not Logged In");
    }
    // check if skappId is present. If new Object, this value will be empty
    let skhubId = skylinkObj.skhubId;
    if (skylinkObj && (skylinkObj.skhubId == null || skylinkObj.skhubId === "")) {
      skhubId = generateSkyhubId("skynet" + ":" + skappOwnerUser.id + ":" + skylinkObj.skylink)
      skylinkObj.skhubId = skhubId;
    }
    // ### Step1: SET FILE (USER) ###
    // ## KEY ##
    const skappOwnerKey = "skappOwner.json"; // File Key (skapp-appname)
    const skappOwnerFileID = new FileID("skapp-appid", FileType.PublicUnencrypted, skappOwnerKey);//MAP: keyId
    // ## VALUE ##
    const skappOwnerData = new TextEncoder("utf-8").encode(JSON.stringify(skylinkObj));
    const skappOwnerFile = new File([skappOwnerData], skappOwnerKey, {type: "application/json"}); //MAP: VALUE -> here we will have JSON file.
    const skappOwnerskyfile = new SkyFile(skappOwnerFile);//<-- It will create skyfile object
    // ## Update SkyDB
    let status = await skynetClient.setFile(skappOwnerUser, skappOwnerFileID, skappOwnerskyfile); //<-- update Key Value pair for that specific user
    console.log("appUser:setFile:status "+status);
    
    // ### Step2: GET FILE (USER) ###
    let existing = await skynetClient.lookupRegistry(skappOwnerUser, skappOwnerFileID);
    let skylink = existing.value.data;
    console.log("skylink"+skylink);
    let skylinkUrl = "https://siasky.net/" + parseSkylink(skylink);
    let skappOwnerJSON = await fetch(skylinkUrl).then(res=>res.json());
    console.log("skyFile1"+skappOwnerJSON);
    // skyFile = await skynetClient.getFile(skappOwnerUser, skylinkIdxFileID);
    // skylinkIdxObj = await skyFile.file.text();
    // console.log("value"+skylinkIdxObj);    

    // ### Step3: GET FILE (MASTER) ###
    const skappMasterUser = new User("skappmaster", "skappmaster001");
    const skappMasterKey = "skappMaster.json"
    const skappMasterUserId = skappMasterUser.id;
    const skappMasterUserPubkey = skappMasterUser.publicKey;
    console.log("appUser:id"+skappMasterUser.id);
    console.log("appUser:PubKey"+skappMasterUser.publicKey);
    const skappMasterFileID = new FileID("skapp-appid", FileType.PublicUnencrypted, skappMasterKey);//MAP: keyId
    existing = await skynetClient.lookupRegistry(skappMasterUser, skappMasterFileID);
    let skappMasterJSON;
    if (existing) 
    {
      skylink = existing.value.data;
      console.log("skylink"+skylink);
      skylinkUrl = "https://siasky.net/" + parseSkylink(skylink);
      skappMasterJSON = await fetch(skylinkUrl).then(res=>res.json());
      console.log("skappMasterJSON "+skappMasterJSON);
    }
    //###### Step4: SET FILE (MASTER) #####
    if (!skappMasterJSON) //empty
    {
        skappMasterJSON = {
        version: "v1",
        createTS: new Date(),
        lastUpdateTS: new Date(),
        skappusers: [{username:skappOwner_name,userid:skappOwnerUserId}],
      }
    }
    else if(skappMasterJSON.skappusers.some(user => user.userid === skappOwnerUserId) === true ) { //already present in Index
      //throw new Error("Skylink already exist");
      //User already exist in SkappMaster
      return true;
    }
    else
    {
      skappMasterJSON.skappusers.push({username:skappOwner_name,userid:skappOwnerUserId})
      // ## VALUE ##
      const data_en = new TextEncoder("utf-8").encode(JSON.stringify(skappMasterJSON));
      const file = new File([data_en], skappMasterKey, { type: "application/json"}); //MAP: VALUE -> here we will have JSON file.
      const skyfile = new SkyFile(file);//<-- It will create skyfile object
      status = await skynetClient.setFile(skappMasterUser, skappMasterFileID, skyfile); //<-- update Key Value pair for that specific user
      console.log("skappOwnerUser:setFile:status"+status);
      //###### Step5: GET FILE (MASTER) #####
      existing = await skynetClient.lookupRegistry(skappMasterUser, skappMasterFileID);
      // if (!existing) {
      //   throw new Error("not found");
      // }
      skylink = existing.value.data;
      console.log("skylink"+skylink);
    }
  }
  catch (error) {
    //setErrorMessage(error.message);
    return false;
  }
  return true;
}