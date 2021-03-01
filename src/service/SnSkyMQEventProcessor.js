
// IndexedDB - IDB_STORE_SKAPP_AGGREGATOR
// Fetch Event -> Validate Event -> BlockList Check(If Public Key is block listed as attacker) -> Moderate Event -> Aggregate Event (with Anonymous data, without Anonymous data)

// Validator 
// Rule1: GEQ Latest DataKey Value, "currentCursor" DataKey value and "currentCursor" Revision Number must match. If not get new keypair(Rotation Logic) and setHeader in new GEQ to link to old GEQ. Return KeyPair to Client

export const fetchGSSEvents = async () => {
    // Get currentCursorPosition from GSS
    // Get lastReadCursorPosition from IDB_STORE_SKAPP_AGGREGATOR
    // if currentCursorPosition > lastReadCursorPosition
    // run for loop  (currentCursorPosition - lastReadCursorPosition) times
    // in for loop fetch data from GSS and call processGSSEvents() 
    //NOTE: if EVENT is from Same loggedin user "ignore" it
}
// publishedApp : [user1PublicKey#AppID1,user2PublicKey#AppID2,,user3PublicKey#AppID3,....userNPublicKey#AppIDN]

export const processGSSEvents = async (event_type, data) => {
    // Get CurrentCursorPosition
    //Switch based on Event Type
    switch (event_type) {
        case 'publishedApp':
            console.log('Processing Event: publishedApp');
            onEventPublishedApp(event_type, data);
            break;
        case 'RemovePublishedApp':
            console.log('Processing Event: publishedApp');
            onEventPublishedApp(event_type, data);
            break;
        case 'viewed':
            console.log('Processing Event: viewed');
            onEventAppViewed(event_type, data);
            break;
        case 'accessed':
            console.log('Processing Event: accessed');
            onEventAppAccessed();
            break;
        case 'liked':
            console.log('Processing Event: liked');
            onEventAppLiked();
            break;
        case 'likedRemoved':
            console.log('Processing Event: liked');
            onEventAppLiked();
            break;
        case 'FavoriteMarked':
            console.log('Processing Event: favorite');
            onEventAppMarkedFavorite();
            break;
        case 'FavoriteUnmarked':
            console.log('Processing Event: favorite');
            onEventAppMarkedFavorite();
            break;
        case 'commentAdded':
            console.log('Processing Event: commentAdded');
            onEventAppMarkedFavorite();
            break;
        case 'commentRemoved':
            console.log('Processing Event: commentAdded');
            onEventAppMarkedFavorite();
            break;
        default:
            console.log(message)
            onSkyIdDefault();
            break;
    }

}

const onEventPublishedApp = async (event_type, data) => {

}

const onEventAppViewed = async (event_type, data) => {

}

const onEventAppAccessed = async (event_type, data) => {

}

const onEventAppLiked = async (event_type, data) => {

}

const onEventAppMarkedFavorite = async (event_type, data) => {

}