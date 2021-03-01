


// "Shared Global storage" is mechanism built on SkyDB for storing EVENTS emitted by all Skapp users in Sequence. You can think of it as MessagingQueue. 
// If bad actor is identified, key will be automatically rotated. 
// Its experimental feature and may change over time.
// It used SkyDB Registry entry with max revision number. "Sequential Immutable registry"
// In case of anonymous users, we will not have publickey. anonymous#

const SMQ_CURSOR_DATA_KEY = "cursorCurrentPosition"
const SMQ_HEADER_DATA_KEY = "0"; // registry entry - [prevSeed,lastValidatedCursorPosition]
export function getSkappKeys(){
    return {
      publicKey : "ff03642858fcb0c4f6e90bd76bcd0cd91f3db837b79581afd4371a325604c00b",
      privateKey : "9be0a30c58ca2426f0d4f9d1dc81367ff1eb701a58b7d6c262192fde881528d4ff03642858fcb0c4f6e90bd76bcd0cd91f3db837b79581afd4371a325604c00b"
    };
}
// Global EVENT QUEUE (SMQ) - user Events
//PublicKey#AppID#EVENT_NAME OR anonymous#AppID#EVENT_NAME

// PUSH "User Action Event" at ( Current Cursor Position + 1)
export const emitEvent = async (appId, eventType) => {
    //DataKey -> PublicKey#AppID#EVENT_NAME OR anonymous#AppID#EVENT_NAME
    let publicKey = getKeys(getUserSession()).publicKey ?? "Anonymous";
    let eventData = publicKey + "#" + appId + "#" + eventType;
    let isSuccess = false;
    let cursorPositionOfSMQ = 0;
    let revision = 0;
    let coolDownCounter = 0;
    while (!isSuccess) {
        //STEP1: Get Current Cursor Position of "SMQ"
        cursorPositionOfSMQ = await getCurrentCursorPosition();
        console.log("getCurrentCursorPosition(): eventData= " + eventData +" cursorPositionOfSMQ="+ cursorPositionOfSMQ); 
        //STEP2: PUSH USER ACTION EVENT in "SMQ". Its important to set maxRevisionFlag = true
        let result = await setRegistryEntry(cursorPositionOfSMQ++, eventData, { publicKey: getSkappKeys().publicKey, privateKey: getSkappKeys().privateKey, maxRevisionFlag: true });
        isSuccess = result?.resultFlag;
        revision = result?.revision;
        console.log("setRegistryEntry(): eventData= " + eventData +" revision="+ revisions+" isSuccess="+ isSuccess); 
        coolDownCounter++;
        if(coolDownCounter >= 5)
        {
            console.log("emitEvent : Sleeping for 10 Seconds"); 
            sleep(10000);
            coolDownCounter = 0;
        }
    }
    //STEP3: incrementCursorPosition. If its already incremented by some other user, dont worry and skip update. This is becoze, entry is added by you so noone will be able to change that entry.
    await incrementCursorPosition(cursorPositionOfSMQ,eventData);
}

// Get Current Cursor Position
const getCurrentCursorPosition = async () => {
    let entry = getRegistryEntry(getSkappKeys().publicKey, SMQ_CURSOR_DATA_KEY, null);
    revision = entry && entry != "undefined" ? entry.revision : 0;
    return revision;
}
// Increment CursorPosition in "SMQ"
const incrementCursorPosition = async (revision,eventData) => {
    // get current cursor position. Match Revision# with counter value. if mismatch ask for new Key.
    let { resultFlag, revision } = await setRegistryEntry(SMQ_CURSOR_DATA_KEY, revision++, { publicKey: getSkappKeys().publicKey, privateKey: getSkappKeys().privateKey });
    console.log("incrementCursorPosition(): eventData= " + eventData +" resultFlag="+ resultFlag); 
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