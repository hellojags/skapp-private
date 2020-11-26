import React from "react";
import "../App.css";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import SnCards from "../components/cards/sn.cards";
import SnHistory from "../components/history/sn.history";
import SnNew from "../components/new/sn.new";
import SnTopBar from "../components/navbar/sn.topbar";
import SnLeftMenu from "../components/navbar/sn.left-menu";
import SnUserSettings from "../components/user/sn.user-settings";
import SnMultiUpload from "../components/upload/sn.multi-upload";
import snLogin from "../components/login/sn.login";
import SnProfile from "../components/sn.profile";

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
});

export class SnRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayMenu: false};
  }
  displayMenu() {
    if (this.props.location.pathname.indexOf("login") > -1) {
      return false;
    }
    else
    {
      return true;
    }
  }
  render() {
    const { classes } = this.props;
    const displayMenu = this.state.displayMenu;
    let SnLeftMenuComponent;
    if (displayMenu){
      SnLeftMenuComponent = <SnLeftMenu />
    }
    else
    {
      SnLeftMenuComponent = <SnLeftMenu />;
    }
    return (
      <Router>
        {/* <div classsName="lightbox-container" id="lightbox-container">
          <ReactImageVideoLightbox 
           id="light-box"
          className="light-box"
        data={[
          { url: 'https://skynethub.io/AABHk6DdHbve_nfjRNVuaAQTs-ehFiXJx1yM30q7ZAgb2w', type: 'video', altTag: 'some other video' }
        ]}
        startIndex={0}
        onCloseCallback={(evt)=> console.log(evt)}
      />
      </div> */}
        {/* <SnScrollToTop /> */}
        <div className={classes.root + " router-root"}>
          <CssBaseline />
          <SnTopBar onDrawerToggle={this.handleDrawerToggle} />
          {SnLeftMenuComponent}
          <main className={classes.content + " router-main"}>
            <div className={classes.toolbar}>
              <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                  <Switch>
                    <Route exact path="/">
                      {/* <Redirect to="/upload" /> */}
                      <Redirect to="/login" />
                    </Route>
                    <Route path="/upload" component={SnMultiUpload} />
                    <Route path="/settings" component={SnUserSettings} />
                    <Route path="/login" component={snLogin} />
                    <Route path="/register" component={SnNew} />
                    <Route path="/publish" component={SnNew} />
                    <Route path="/apps/:category" component={SnCards} />
                    <Route path="/skylinks" component={SnCards} />
                    <Route path="/skyapps/:id" component={SnNew} />
                     <Route path="/skapp/:skyspace" component={SnCards} />
                    {/* <Route path="/skyspace/:skyspace" component={SnCards} /> */}
                    <Route path="/history" component={SnHistory} />
                    <Route path="/profile" component={SnProfile} />
                    <Route path="/public-cards" component={SnCards} />
                    <Route path="/imported-spaces/:sender/:skyspace" component={SnCards} />
                    <Route path="/imported-skyapps/:sender/:id" component={SnNew} />
                    <Route component={SnMultiUpload} />
                  </Switch>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(SnRouter);
