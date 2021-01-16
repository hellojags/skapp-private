import React, { useEffect, useState } from "react"
import "./App.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons"
import { createMuiTheme } from "@material-ui/core"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import SnLoader from "./components/tools/sn.loader"
import SnRouter from "./router/sn.router"
import { authOrigin, appDetails, userSession } from "./blockstack/constants"
import { MUI_THEME_LIGHT, MUI_THEME_DARK } from "./sn.constants"

library.add(
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV
)

const authOptions = {
  redirectTo: "/",
  manifestPath: "/manifest.json",
  authOrigin,
  userSession,
  finished: ({ userSession }) => {
    console.log(userSession.loadUserData())
  },
  appDetails,
}

// // Track when page is loaded
// const FathomTrack = () => {
//   useEffect(() => {
//     if (config.fathomSiteId) {
//       Fathom.load(config.fathomSiteId, {
//         url: config.fathomSiteUrl,
//       });
//       Fathom.trackPageview();
//     }
//   }, []);

//   return <React.Fragment />;
// };

// // Track on each page change
// Router.events.on('routeChangeComplete', () => {
//   Fathom.trackPageview();
// });

const App = () => {
  const [forLightGray, setforLightGray] = useState("#f7f7f7")
  const [forLinkColors, setForLinksColor] = useState("#656d70")
  const [whiteBgColorTheme, setwhiteBgColorTheme] = useState("#ffffff")
  const [activeDark, setActiveDark] = useState(false)

  const stDarkMode = useSelector((state) => state.snDarkMode)

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.log = function () {}
    }
  }, [])

  React.useEffect(() => {
    setActiveDark(stDarkMode)
  }, [stDarkMode])

  const handleDarkMode = (val) => {
    setActiveDark(val)
  }

  /*

  .MuiInput-underline::before {
    left: 0;
    right: 0;
    bottom: 0;
    content: "\00a0";
    position: absolute;
    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    pointer-events: none;
    border-bottom: 2px solid #1ed660;

    */

  const pallete = {}
  pallete[MUI_THEME_LIGHT] = {
    primary: {
      main: "#1ed660",
      textColor: "#636f70",
    },
    headerBgColor: "#ffffff",
    whiteBgColor: "#ffffff",
    linksColor: "#656d70",
    secondary: {
      main: "#636f70",
      textColor: "#c5c5c5",
    },
    sliderBg: "#ffffff",
    centerBar: "#ffffff",
    lightGray: "#f7f7f7",
    mediumGray: "#c5c5c5",
    lightGreen: "#daffe7",
    spacesTabsCount: "#EAEAEA",
  }
  pallete[MUI_THEME_DARK] = {
    primary: {
      main: "#1ed660",
      textColor: "#636f70",
    },
    sliderBg: "#141418",
    centerBar: "#343537",
    spacesTabsCount: "#000000",
    headerBgColor: "#1a1b1d",
    whiteBgColor: "#000000",
    linksColor: "#ffffff",
    secondary: {
      main: "#636f70",
      textColor: "#c5c5c5",
    },
    lightGray: "#1a1b1d",
    mediumGray: "#c5c5c5",
    lightGreen: "#daffe7",
  }

  const lightTheme = createMuiTheme({
    palette: pallete[MUI_THEME_LIGHT],
  })

  const darkTheme = createMuiTheme({
    overrides: {
      MuiDrawer: {
        root: {
          backgroundColor: pallete[MUI_THEME_DARK].whiteBgColor,
        },
      },
      MuiPaper: {
        root: {
          backgroundColor: pallete[MUI_THEME_DARK].headerBgColor,
        },
      },
      MuiTypography: {
        root: {
          color: "#ffffff78 !important",
        },
      },
      MuiFormLabel: {
        root: {
          color: "#ffffff78",
        },
      },
      MuiInput: {
        underline: {
          "&:before": {
            borderBottom: `2px solid ${pallete[MUI_THEME_DARK].linksColor}`,
          },
        },
      },
      WAMuiChipInput: {
        underline: {
          "&:before": {
            borderBottom: `2px solid ${pallete[MUI_THEME_DARK].linksColor}`,
          },
        },
      },
      MuiInputBase: {
        input: {
          color: pallete[MUI_THEME_DARK].linksColor,
        },
      },
      MuiFormHelperText: {
        root: {
          color: pallete[MUI_THEME_DARK].linksColor,
        },
      },
    },
    palette: pallete[MUI_THEME_DARK],
  })

  return (
    <MuiThemeProvider theme={activeDark ? darkTheme : lightTheme}>
      <SnLoader />
      <div>
        <SnRouter handleDarkMode={handleDarkMode} />
      </div>
    </MuiThemeProvider>
  )
}
export default App
