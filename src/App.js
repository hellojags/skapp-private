import React,{useMemo, useState} from 'react'

import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import SnLoader from "./components/Utils/SnLoader"
import './index.css'
import { skappTheme } from './theme/Theme'
import SnRouter from './router/SnRouter'
import {
  BrowserRouter as Router
} from "react-router-dom";
import Nav from './components/Navbar/Nav'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';






function App() {
  // const [darkmode , setDarkMode] = React.useState(true);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');



  // const theme = useMemo(
  //   () =>
  //     createMuiTheme({
  //       primary: {
  //         // light: will be calculated from palette.primary.main,
  //         main: '#ff4400',
  //         // dark: will be calculated from palette.primary.main,
  //         // contrastText: will be calculated to contrast with palette.primary.main
  //       },
  //       secondary: {
  //         light: '#0066ff',
  //         main: '#0044ff',
  //         // dark: will be calculated from palette.secondary.main,
  //         contrastText: '#ffcc00',
  //       },
  //     }),
  //   [prefersDarkMode],
  // );
 
 
  return (
    <Router>
      <ThemeProvider theme={skappTheme}>
      <SnLoader/>
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
  )
}
export default App
