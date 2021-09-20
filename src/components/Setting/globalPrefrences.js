import { Box, Button, makeStyles, Snackbar } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";
import { setUserPreferencesAction } from "../../redux/action-reducers-epic/SnUserPreferencesAction";
import { setPreferences } from "../../service/SnSkappService";
import { SnSelect, SnSwitch } from "../Utils/SnFormikControlls";

const useStyles = makeStyles((theme) => ({
  lightProfileRoot: {
    backgroundColor: '#fff',
    boxShadow: '0px 2px 5px #15223214',
    borderRadius: 6,
    padding: '50px 30px',
    '@media only screen and (max-width: 575px)': {
        padding: '20px 10px',
    },
    '& h2': {
      color: '#242F57',
      marginBottom: '1rem',
      '@media only screen and (max-width: 575px)': {
          fontSize: 22,
      },
    }
  },
  darkProfileRoot: {
    backgroundColor: '#1E2029',
    boxShadow: '0px 2px 5px #12141D',
    borderRadius: 6,
    padding: '50px 30px',
    '@media only screen and (max-width: 575px)': {
        padding: '20px 10px',
  },
  '& h2': {
      color: '#fff',
      marginBottom: '1rem',
      '@media only screen and (max-width: 575px)': {
          fontSize: 22,
      },
    }
  },
  textInfo: {
    color: "#000",
    fontSize: 14,
    "@media only screen and (max-width: 575px)": {
      fontSize: 13,
    },
  },
  submitBtn: {
    background: "#1DBF73!important",
    color: "#fff",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    display: "inlin-flex",
    alignItems: "center",
    float: "right",
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
  siteLogo: {
    background: "#fff",
    cursor: "pointer",
    height: 150,
    width: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D9E1EC",
    borderRadius: "50%",
    marginBottom: 10,
    marginTop: 10,
    "@media only screen and (max-width: 575px)": {
      width: 75,
      height: 75,
      // maxWidth: 340,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  label: {
    display: "block",
    color: "#5A607F",
    marginBottom: 8,
    fontSize: 18,
    "@media only screen and (max-width: 575px)": {
      fontSize: 16,
    },
  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    background: "#EFF5F7",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    "& svg": {
      fontSize: 89,
      // marginTop: '2.9rem',
      color: "#B4C6CC",
    },
    "@media only screen and (max-width: 575px)": {
      width: 75,
      height: 75,
      "& svg": {
        fontSize: 45,
        // marginTop: '2.9rem',
        color: "#B4C6CC",
      },
    },
  },
  btnUpload: {
    backgroundColor: "#869EA6!important",
    color: "#fff",
    fontSize: 14,
    minWidth: 150,
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
      height: 40,
    },
    "& svg": {
      marginRight: 7,
    },
  },
  textHelper: {
    fontSize: 13,
    color: "#5C757D",
    marginTop: 5,
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  form: {
    marginTop: 20,
  },
  inputGuide: {
    color: "#5C757D",
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  input: {
    background: "#fff",
    border: "1px solid #D9E1EC",
    borderRadius: 8,
    height: 55,
    width: "100%",
    fontSize: 18,
    padding: 20,
    "@media only screen and (max-width: 1440px)": {
      height: 50,
      // width: '100%',
      fontSize: 16,
      padding: 15,
    },
    "@media only screen and (max-width: 575px)": {
      height: 43,
      // width: '100%',
      fontSize: "14px !important",
      padding: 10,
    },
  },
  inputContainer: {
    "& > label": {
      display: "block",
      color: "#5A607F",
      marginBottom: 7,
    },
    "& input:focus, & select:focus": {
      outline: "none!important",
      border: "1px solid #1DBF73",
    },
    marginTop: "25px",
    "&": {
      marginRight: "1rem",
    },
    "& input, & input": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 575px)": {
      marginTop: "16px",
      marginRight: "10px",
    },
  },
  firstInput: {
    marginTop: 5,
    "@media only screen and (max-width: 575px)": {
      marginBottom: 10,
    },
  },
}));

const portalOptions = [
  { value: "https://siasky.net/", label: "https://siasky.net/" },
  { value: "https://skyportal.xyz", label: "https://skyportal.xyz" },
];
const initailValueFormikObGB = {
  darkmode: true,
  portal: "https://siasky.net",
};

const GlobalPrefrences = ({toggle}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formikObjGB, setFormikObGB] = useState(initailValueFormikObGB); // to store Formik Form data
  const classes = useStyles();
  const userPreferences = useSelector((state) => state.snUserPreferences);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormikObGB({
      darkmode: userPreferences?.darkmode,
      portal: userPreferences?.portal,
    });
  }, [userPreferences]);

  const submitGlobalPreferencesForm = async (values) => {
    dispatch(setLoaderDisplay(true));
    let preferencesJSON = {
      darkmode: values.darkmode,
      portal: values.portal,
    };
    await setPreferences(preferencesJSON);
    dispatch(setUserPreferencesAction(preferencesJSON));
    setIsSuccess(true);
    dispatch(setLoaderDisplay(false));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };

//console.log(formikObjGB);

  return (
    <div className={toggle ? classes.darkProfileRoot : classes.lightProfileRoot}>
      <Box>
        {isSuccess && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isSuccess}
            autoHideDuration={5000}
          >
            <Alert onClose={handleClose} severity="success">
              User Preferences Successfully Saved!
            </Alert>
          </Snackbar>
        )}
        {isError && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isError}
            autoHideDuration={5000}
          >
            <Alert onClose={handleClose} severity="error">
              Error Occurred while saving User Preferences!
            </Alert>
          </Snackbar>
        )}
        {
          <Formik
            initialValues={formikObjGB}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
            onSubmit={submitGlobalPreferencesForm}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <h2>
                  Global User Prefrences{" "}
                  <Button
                    className={classes.submitBtn}
                    onClick={formik.handleSubmit}
                  >
                    <Add /> Save Changes{" "}
                  </Button>
                </h2>
                <Box
                  display="flex"
                  className={`${classes.formRow} formSiteRow`}
                >
                  <Box className={`${classes.inputContainer}`} flex={1}>
                    <SnSwitch label="Dark Mode" name="darkmode" />
                  </Box>
                  <Box className={`${classes.inputContainer}`} flex={1}>
                    <label>Skynet Portal</label>
                    <Box>
                      <SnSelect
                        toggle={toggle}
                        label="Skynet Portal"
                        name="portal"
                        options={portalOptions}
                      />
                    </Box>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        }
      </Box>
    </div>
  );
};

export default GlobalPrefrences;
