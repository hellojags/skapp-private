import {
  ACT_TY_SET_USER_PREFERENCES,
  EPIC_TY_SET_USER_PREFERENCES,
} from "../SnActionConstants"
import store from ".."
import { STORAGE_USER_PREFERENCES_KEY, BROWSER_STORAGE } from "../../utils/SnConstants"

// get internally calls set from epic
export const setUserPreferencesEpic = (userPreferences) => {
  if (userPreferences == null) {
    BROWSER_STORAGE.removeItem(STORAGE_USER_PREFERENCES_KEY)
  } else {
    BROWSER_STORAGE.setItem(
      STORAGE_USER_PREFERENCES_KEY,
      JSON.stringify(userPreferences)
    )
  }
  return {
    type: EPIC_TY_SET_USER_PREFERENCES,
    payload: userPreferences,
  }
}
// This method is called during login and on Profile Page
export const setUserPreferencesAction = (userPreferences) => {
  if (userPreferences == null) {
    userPreferences = BROWSER_STORAGE.getItem(STORAGE_USER_PREFERENCES_KEY)
    if (userPreferences != null) {
      userPreferences = JSON.parse(userPreferences)
    }
  } else {
    BROWSER_STORAGE.setItem(
      STORAGE_USER_PREFERENCES_KEY,
      JSON.stringify(userPreferences)
    )
  }
  return {
    type: ACT_TY_SET_USER_PREFERENCES,
    payload: userPreferences,
  }
}
