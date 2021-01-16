
1. Refer below files for JSON Schema

- publishedApp.json
- hostedApp.json

2. "USERS" SkyDB DataKey and Values

Fomat -> "DataKey" : "Value"

"profile" : {}
"followers" : {version:"1", publicKeys:[User1_SkyID_MasterPubKey,User2_SkyID_MasterPubKey....]}
"followings" : {version:"1", publicKeys:[User1_SkyID_MasterPubKey,User2_SkyID_MasterPubKey....]}

# Published Apps Data
"publishedSkapps" : {appId1,appId2}
"appId1" : {publishedApp JSON}
"appId2" : {publishedApp JSON} 
Note: When user performs any action on JSON (PUBLISH, EDIT, DELETE), it goes here
## App stats
appId1#stats: 010101
appId2#stats: 01010
Note: 
1. Fav, Likes, Views, Installed, Accessed 
2. when user does any action on app card it goes here 


# Hosted Apps Data
"hostedSkapps" : {appId1,appId2}
"hosted#appId1" : {hostedApp JSON}
"hosted#appId2" : {hostedApp JSON}

# MyAppStore
Fetch all apps from followers

# MyApps
"favApps": [publicKey#appId,publicKey#appId]
"InstalledApps": [publicKey#appId,publicKey#appId]


3. "Shared" SkyDB (Centralized)

"skappUsers" : {} // Provides all users
"User1_publicKey#followers" : [List of followers PubKeys]
"User2_publicKey#followers" : [List of followers PubKeys]
"appId#fav" : [list of publicKey]
"appId#viewed" : [list of publicKey]
"appId#accessed" : [list of publicKey]
"appId#comments" : [list of publicKey]