import { of } from "rxjs"
import { ajax } from "rxjs/ajax"

export const API_ROOT = "process.env.REACT_APP_APPSTORE_HOST"
export const SKAPP_API_ROOT = "https://skynethub-api.herokuapp.com"

export const getUsersCacheInfo = async () =>
  await fetch(`${SKAPP_API_ROOT}/skyuser`)
    .then((res) => res.json())
    .catch((error) => {
      console.log("error: ", error)
      return of(error)
    })

export const addUserPubKeyInCache = async (data) =>
  await fetch(`${SKAPP_API_ROOT}/skyuser`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((res) => res)
    .catch((error) => {
      console.log("error: ", error)
      return of(error)
    })

export const getAppList = (opt) =>
  ajax.getJSON(`${API_ROOT}?limit=100&category=${opt}`)
export const getSkyAppList = (opt) =>
  ajax.getJSON(`${API_ROOT}?limit=100&skyspace=${opt}`)
export const fetchSkyAppDetails = (skyAppId) => ajax.getJSON(API_ROOT + skyAppId)
export const createSkapp = (skapp) =>
  ajax({
    url: API_ROOT,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skapp),
  })
export const editSkapp = (skapp) =>
  ajax({
    url: API_ROOT + skapp.id,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skapp),
  })
export const deleteSkapp = (skapp) =>
  ajax({
    url: API_ROOT + skapp.id /* +"/"+skapp.auth_code */,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skapp),
  })
