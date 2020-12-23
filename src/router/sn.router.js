import React from "react"
import "../App.css"

import { Route, HashRouter as Router, Switch, Redirect } from "react-router-dom"
import SnCards from "../components/cards/sn.cards"
import RecipeReviewCard from "../components/cards/sn.new-app-card"
import SnHistory from "../components/history/sn.history"
import SnNew from "../components/new/sn.new"
import SnTopBar from "../components/navbar/sn.topbar"
import SnLeftMenu from "../components/navbar/sn.left-menu"
import SnUserSettings from "../components/user/sn.user-settings"
import SnMultiUpload from "../components/upload/sn.multi-upload"
import snLogin from "../components/login/sn.login"
import SnProfile from "../components/user/sn.profile"
import SnUserDiscovery from "../components/user/sn.user-discovery"
import { APPSTORE_PROVIDER_MASTER_PUBKEY } from "../sn.constants"

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    "padding-top": "20px",
  },
  toolbar: theme.mixins.toolbar,
})

const SnRouter = (props) => (
  <Router>
    <SnTopBar />
    <SnLeftMenu />
    <Switch>
      <Route exact path="/">
        <Redirect
          to={`/public-skapps/?provider=${APPSTORE_PROVIDER_MASTER_PUBKEY}`}
        />
      </Route>
      {/* <Route path="/upload" component={SnMultiUpload} /> */}
      {/* <Route path="/public-upload" component={SnLandingUpload} /> */}
      <Route path="/settings" component={SnUserSettings} />
      <Route path="/login" component={snLogin} />
      <Route path="/publishapp" component={SnNew} />
      <Route path="/userdiscovery" component={SnUserDiscovery} />
      <Route path="/myappstore" component={SnCards} />
      <Route path="/appstore" component={SnCards} />
      <Route path="/apps/:category" component={SnCards} />
      <Route path="/skylinks" component={SnCards} />
      <Route path="/providerskyapps/:id" component={SnNew} />
      <Route path="/myskyapps/:id" component={SnNew} />
      {/* <Route path="/publishedapps/skyapps/:id" component={SnNew} /> */}
      <Route path="/skyapps/:id" component={SnNew} />
      <Route path="/skyspace/:skyspace" component={SnCards} />
      <Route path="/history" component={SnHistory} />
      <Route path="/profile" component={SnProfile} />
      <Route path="/public-skapps" component={SnCards} />
      <Route path="/public-skappinfo/:id" component={SnNew} />
      <Route path="/imported-spaces/:sender/:skyspace" component={SnCards} />
      <Route path="/imported-skyapps/:sender/:id" component={SnNew} />
      <Route path="/cardtest" component={RecipeReviewCard} />
      <Route component={SnMultiUpload} />
    </Switch>
    {/* <div>
        <SnFooter />
      </div> */}
  </Router>
)

export default SnRouter
