# sample JSON Obejcts for reference

## userSession
{
  idp: "SKYID",
  skyid: {
    callback: function () { [native code] },
    appId: "SkySpaces",
    opts: {
      devMode: true,
    },
    skynetClient: {
      /*skynet methods*/
    },
    seed: "e26283c753cf0fefb577ee1d3d999c104f897127841d71343d93c0366f6aa1c3",
    userId: "c1a956eb2cc4fc9c2d34c9a48eae8dba7ad89c7a57d6f55f320c07f9c1eb8ea7",
    url: "http://localhost:3000/",
    appImg: null,
  }

  person: {
    masterPublicKey: "c1a956eb2cc4fc9c2d34c9a48eae8dba7ad89c7a57d6f55f320c07f9c1eb8ea7",
    appSeed: "e26283c753cf0fefb577ee1d3d999c104f897127841d71343d93c",
    appId: "SkySpaces",
    appImg: null,
    appPublicKey: "370a627bc1f86a58f9d4bce067e3f23540f9bc6281532532df0aae0d04d07f04",
    appPrivateKey: "153032780482d8de15d0cfea062e4c8610325fc8affe5a370a627bc1f86a58f9d4bce067e3f23540f9bc6281532532df0aae0d",
    profile: {
      username: "skyspaces",
      did: "skyspaces",
      aboutme: "",
      location: undefined,
      avatar: undefined,
      profilePicture: undefined,
    },
  }


## SkyID Objects

appData = { 'seed': appSeed, 'userId': masterKeys.publicKey, 'url': document.referrer, 'appImg': null }
publicAppData = { 'url': document.referrer, 'publicKey': publicKey, 'img': null }


## SkyId
{
  callback: function () { [native code] },
  appId: "SkySpaces",
  opts: {
    devMode: true,
  },
  seed: "e26283c753cf0fefb577ee1d3d999c104f897127841d71343d93c0366f6aa",
  userId: "c1a956eb2cc4fc9c2d34c9a48eae8dba7ad89c7a57d6f55f320c07f9c1eb8ea7",
  url: "http://localhost:3000/",
  appImg: null,
}


## Data Key: Profile
{
  "username": "skyspaces",
  "aboutMe": "",
  "dapps": {
    "Example skapp": {
      "url": "https://sky-note.hns.siasky.net/",
      "publicKey": "fb1e595e70cd02845583a2e7b8a4c0278744cecebbf3aef8474ae9c8932c2b2e",
      "img": null
    },
    "SkySpaces": {
      "url": "http://localhost:3000/",
      "publicKey": "370a627bc1f86a58f9d4bce067e3f23540f9bc6281532532df0aae0d04d07f04",
      "img": null
    },
    "skyfeed": {
      "url": "https://sky-id.hns.siasky.net/?appId=skyfeed&redirect=backConnect",
      "publicKey": "b7fe28de361766b730ea169226352198fe3e4a2995454045f1787d5a528eb40f",
      "img": null
    }
  }
}