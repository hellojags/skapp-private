import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import GlobalPrefrences from "./globalPrefrences";
// import { Add } from '@material-ui/icons'
import Profile from "./Profile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  lightRoot: {
    backgroundColor: "transparent",
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
    },
    "& .MuiTab-root": {
      fontWeight: 600,
      minWidth: 85,
      color: "#869EA6",
      "&.Mui-selected": {
        color: "#2A2C34",
      },
    },
  },
  darkRoot: {
    backgroundColor: "transparent",
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
    },
    "& .MuiTab-root": {
      fontWeight: 600,
      minWidth: 85,
      color: "#869EA6",
      "&.Mui-selected": {
        color: "#fff",
      },
    },
  },
  h1: {
    fontSize: "28px",
    "@media only screen and (max-width: 575px)": {
      fontSize: 18,
    },
  },
  submitBtn: {
    background: "#1DBF73!important",
    color: "#fff",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    display: "inlin-flex",
    alignItems: "center",
    minWidth: 130,
    "& svg": {
      fontSize: "19px",
      marginRight: "5px",
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: "12px",

      paddingLeft: ".5rem",
      paddingRight: ".5rem",
      minWidth: 70,
    },
  },
  lightTabNavigation: {
    backgroundColor: '#1E2029',
    boxShadow: "none",
  },
  darkTabNavigation: {
    boxShadow: "none",
  },
}));

const Settings = ({toggle}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

  return (
    <Fragment>
      {/* <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                <h1 className={classes.h1}>Settings</h1>
                <Box className={classes.btnBox}>
                    <Button className={classes.submitBtn}>Save Changes</Button>
                </Box>
            </Box> */}

      <div className={toggle ? classes.darkRoot : classes.lightRoot}>
        <AppBar
          className={toggle ? classes.lightTabNavigation: classes.darkTabNavigation}
          position="static"
          color="default"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="User Profile" {...a11yProps(0)} />
            <Tab label="User Preferences" {...a11yProps(1)} />
            {/* <Tab label="Billing" {...a11yProps(2)} /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Profile toggle={toggle} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GlobalPrefrences toggle={toggle} />
        </TabPanel>
      </div>
    </Fragment>
  );
};
export default Settings;
