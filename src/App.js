import { ThemeProvider } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  useEffect(() => {
    initMySky().then((data) => {
      if (data && data.loggedIn)
        // only if login is true set session
        dispatch(setUserSession(data.userSession));
    });
  }, [dispatch]);

  return (
    <Router>
      <ThemeProvider theme={skappTheme}>
        <SnLoader />
        <div className="App">
          <Nav />
          <section className="main-content">
            <aside className="app-sidebar">
              <Sidebar />
            </aside>
            <main className="app-content" id="app-content">
              <SnRouter />
            </main>
          </section>
        </div>
      </ThemeProvider>
    </Router>
  );
}
export default App;
