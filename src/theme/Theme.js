// import React from 'react'
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export const skappTheme = createMuiTheme({
    typography: {
        htmlFontSize: 16,
        fontFamily: "'Nunito', sans-serif",
        body1: {

            lineHeight: '1.25'
        },
        palette: {
            type: 'light',
        },
    },
  },
);
