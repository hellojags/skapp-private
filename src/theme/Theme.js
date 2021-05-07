// import React from 'react'
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export const skappTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#1DBF73",
      contrastText: "#ffffff",
    },
    error: {
      main: red[400],
      contrastText: "#ffffff",
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: "'Nunito', sans-serif",
    body1: {
      lineHeight: "1.25",
    },
  },
});
