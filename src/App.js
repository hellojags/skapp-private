import React, {useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { ThemeProvider } from '@material-ui/core'
import Sidebar from './components/Sidebar/Sidebar'
import SnLoader from "./components/Utils/SnLoader"
import './index.css'
import { skappTheme } from './theme/Theme'
import SnRouter from './router/SnRouter'
import {
  BrowserRouter as Router
} from "react-router-dom";
import Nav from './components/Navbar/Nav'
import { initMySky } from "./service/skynet-api"
import { setUserSession } from "./redux/action-reducers-epic/SnUserSessionAction"

function App() {
  const [toggle, setToggle] = useState(false);

  const dispatch = useDispatch()
  useEffect(() => {
    initMySky().then(({ loggedIn, userSession }) => {
      if (loggedIn)// only if login is true set session
        dispatch(setUserSession(userSession))
      } 
    );
  }, []);

  return (
    <Router>
      <ThemeProvider theme={skappTheme}>
        <SnLoader />
        <div className="App">
          <Nav toggle={toggle} setToggle={setToggle} />
          <section className="main-content">
            <aside className="app-sidebar">
              <Sidebar toggle={toggle} />
            </aside>
            <main className="app-content" id="app-content">
              <SnRouter toggle={toggle} />
            </main>
          </section>
        </div>
      </ThemeProvider>
    </Router>
  )
}
export default App
