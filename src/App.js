import { ThemeProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import Nav from "./components/Navbar/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import SnLoader from "./components/Utils/SnLoader";
import "./index.css";
import { setUserSession } from "./redux/action-reducers-epic/SnUserSessionAction";
import SnRouter from "./router/SnRouter";
import { initMySky } from "./service/skynet-api";
import { skappTheme } from "./theme/Theme";

function App() {
  const [toggle, setToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const userSession = useSelector((state) => state.userSession)

  useEffect(() => {
    initMySky().then((data) => {
      console.log("### MySky Session Initialized Successfully !!");
      if (data)
        dispatch(setUserSession(data.userSession));
    });
  }, []);

  useEffect(() => {
    if(userSession?.mySky)
    {
      userSession.mySky.checkLogin().then((loginStatus)=>{
        setIsLoggedIn(loginStatus)
      })
    }
  }, [userSession]);
  return (
    <Router>
      <ThemeProvider theme={skappTheme}>
        <SnLoader />
        <div className="App">
          <Nav toggle={toggle} setToggle={setToggle} />
          <section className="main-content">
            {isLoggedIn ?
            <aside className="app-sidebar">
              <Sidebar toggle={toggle} />
            </aside> : null}
            <main className="app-content" id="app-content">
              <SnRouter toggle={toggle} />
            </main>
          </section>
        </div>
      </ThemeProvider>
    </Router>
  );
}
export default App;
