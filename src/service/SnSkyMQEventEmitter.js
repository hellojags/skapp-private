import { getRegistryEntry, getProviderKeysByType, setRegistryEntry } from './SnSkynet'
import {getUserID, putFile_MySky, getFile_MySky} from './skynet-api'

// "Shared Global Event Queue" is mechanism built on SkyDB for storing EVENTS emitted by all Skapp 
// users in Sequence. You can think of it as MessagingQueue. 
// If bad actor is identified, key will be automatically rotated. 
// Its experimental feature and may change over time.
// It used SkyDB Registry entry with max revision number. "Sequential Immutable registry"
// In case of anonymous users, we will not have publickey. anonymous#

const GEQ_CURSOR_DATA_KEY = "cursorPosition"
const GEQ_HEADER_DATA_KEY = "0"; // registry entry - [prevSeed,lastValidatedCursorPosition]
const ANONYMOUS = "anonymous";

// Global EVENT QUEUE (GEQ) - user Events
//PublicKey#AppID#EVENT_NAME OR anonymous#AppID#EVENT_NAME

// PUSH "User Action Event" at ( Current Cursor Position + 1)
// EVENT_PUBLISHED_APP =  DK_PUBLISHED_APPS;
// EVENT_APP_VIEWED =  '1';
// EVENT_APP_ACCESSED =  '2';
// EVENT_APP_LIKED =  '3';
// EVENT_APP_FAVORITE =  '4';
// EVENT_APP_COMMENT =  '5';
// This method can go in ServiceWorker
export const emitEvent = async (userID, appId, eventType) => {
    //DataKey -> PublicKey#AppID#EVENT_NAME OR anonymous#AppID#EVENT_NAME
    //let eventData = publicKey + "#" + appId + "#" + eventType;
    let eventData = userID + "#" + appId + "#" + eventType;
    let isSuccess = false;
    let isleqSuccess = false;
    //STEP1: Get Current Cursor Position of "GEQ"
    let cursorPositionOfGEQ = (await getCurrentCursorPosition()) ?? 0;
    let revision = 0;
    let coolDownCounter = 0;
    while (!isSuccess && !isleqSuccess) {
        cursorPositionOfGEQ++
        console.log("getCurrentCursorPosition(): eventData= " + eventData + " cursorPositionOfGEQ=" + cursorPositionOfGEQ);
        //STEP2: ** MOST IMPORTANT STEP ** PUSH USER ACTION EVENT in "GEQ". Its important to set maxRevisionFlag = true
        let result = await setRegistryEntry((cursorPositionOfGEQ).toString(), eventData, { publicKey: getProviderKeysByType("GEQ").publicKey, privateKey: getProviderKeysByType("GEQ").privateKey, maxRevisionFlag: true, skipIDB: true });
        isSuccess = result?.resultFlag;
        revision = result?.revision;
        console.log("setRegistryEntry(): GEQ eventData= " + eventData + " revision=" + revision + " isSuccess=" + isSuccess);
        if (isSuccess == true && userID != ANONYMOUS) {
            //STEP3: on GEQ PUSH success, PUSH USER ACTION EVENT in "LEQ". Its important to set maxRevisionFlag = true
            //(with DAC this STEP 3 is not required)
            // let leqResult = await setRegistryEntry((cursorPositionOfGEQ).toString(), eventData, { publicKey, privateKey, maxRevisionFlag: true, skipIDB: true });
            // isleqSuccess = leqResult?.resultFlag;
            // //let leqResult = await setRegistryEntry((cursorPositionOfGEQ).toString(), eventData, { publicKey, privateKey, maxRevisionFlag: true, skipIDB: true });
            let leqResult = await putFile_MySky((cursorPositionOfGEQ).toString(),{e : eventData});
            isleqSuccess = leqResult ? true : false ;
            console.log("setRegistryEntry(): LEQ : eventData= " + eventData + " revision=" + revision + " isleqSuccess=" + isleqSuccess);

        } else {
            console.log("setRegistryEntry(): ** Skipping LEQ ** : ANONYMOUS eventData= " + eventData);
        }
        coolDownCounter++;
        if (coolDownCounter >= 5) {
            break;
            console.log("emitEvent : Sleeping for 10 Seconds");
            sleep(10000);
            coolDownCounter = 0;
        }
    }
    //STEP3: incrementCursorPosition. If its already incremented by some other user, dont worry and 
    // skip update. This is becoze, entry is added by you so noone will be able to change that entry.
    await incrementCursorPosition(cursorPositionOfGEQ, eventData);
}

// Get Current Cursor Position
const getCurrentCursorPosition = async () => {
    let entry = await getRegistryEntry(getProviderKeysByType("GEQ").publicKey, GEQ_CURSOR_DATA_KEY, { publicKey: getProviderKeysByType("GEQ").publicKey, privateKey: getProviderKeysByType("GEQ").privateKey });
    let revision = entry && entry != "undefined" ? entry.revision : 0;
    return revision;
}
// Increment CursorPosition in "GEQ"
const incrementCursorPosition = async (cursorPositionOfGEQ, eventData) => {
    // get current cursor position. Match Revision# with counter value. if mismatch ask for new Key.
    let { resultFlag, revision } = await setRegistryEntry(GEQ_CURSOR_DATA_KEY, cursorPositionOfGEQ, { publicKey: getProviderKeysByType("GEQ").publicKey, privateKey: getProviderKeysByType("GEQ").privateKey, skipIDB: true });
    console.log("incrementCursorPosition(): eventData= " + eventData + " resultFlag=" + resultFlag);
}
function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}