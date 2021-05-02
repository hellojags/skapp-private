

export const userProfileDacTest = async (userSession) =>{
try {

    let userprofile = userSession.dacs.userProfileDAC;
    let userID = userSession.userID;
    console.log("Workshop :: ######### SKYID test ######### ");
    let SKyIdProf = await userprofile.getProfile("b114531ddb46d1446806a5f4334729dac0149665893383d4dcba692cfa51f2dc");
    console.log("Workshop :: ######### SKYID Profile:"+SKyIdProf);
    let profileObj = await userprofile.getProfile(userID);
    console.log("Workshop :: original Profile", profileObj);
    let profile = {
      version: 1,
      username: "crypto_rocket",
      aboutMe: "SkynetHub Founder and CEO. Product Architect - SkySpace.hns, Skapp.hns",
      location: "Virginia",
      topics: ['Skynet', 'SkyDB']
    }
    console.log('Workshop :: before setProfile');
    await userprofile.setProfile(profile);
    console.log('Workshop :: before getProfile');
    let prof = await userprofile.getProfile(userID);
    console.log("Workshop :: Updated Profile", prof);
    console.log("Workshop :: ######### PREFERENCES ######### ");
    let pref = {
      version: 1,
      darkmode: true,
      portal: "siasky.net"
    }
    await userprofile.setPreferences(pref);
    let prefrencesObj = await userprofile.getPreferences(userID);
    console.log("Workshop :: getPreference() = ", prefrencesObj);
    let profileHistoryObj = await userprofile.getProfileHistory(userID);
    console.log("Workshop :: getProfileHistory() = ", profileHistoryObj);
    let preferencesHistoryObj = await userprofile.getPreferencesHistory(userID);
    console.log("Workshop :: getPreferencesHistory() = ", preferencesHistoryObj);
    
    console.log("Workshop :: Updated Profile", prof);

  } catch (error) {
    console.log(`Workshop :: error with userprofile DAC: ${error.message}`);
  }
}