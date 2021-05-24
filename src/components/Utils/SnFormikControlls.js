import React from 'react';
import { Formik, Form, useField, useFormikContext } from 'formik';
import Select from 'react-select';
import TagsInput from "react-tagsinput";
import '../SubmitApp/taginput.css';
import { TextareaAutosize, InputBase, Box, Switch  } from '@material-ui/core';
import { fade, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#fff", 1),
    "&:hover": {
      backgroundColor: fade("#fff", 0.9),
    },
    marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    // color: "#8B9DA5",
    boxShadow: "0px 1px 2px #15223214",
    // border: "1px solid #7070701A;",
    border: "1px solid rgba(0, 0, 0, 0.8);",
    // hieght: '41px',
    marginLeft: "16px!important",
    "@media (max-width: 1650px)": {
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // color: "#B4C6CC",
  },
  lightInputRoot: {
    // color: "inherit",
    width: '100%',
    color: '#2A2C34!important',
  },
  darkInputRoot: {
    color: '#fff!important',
    background: '#2A2C34',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
    paddingTop: "10px",
    paddingBottom: "10px",
    "@media (max-width: 1660px)": {
      width: "100%",
    },
    "@media (max-width: 1460px)": {
      width: "100%",
    },
  },

  pageHeading: {
    color: "#131523",
    fontSize: "28px",
  },
  smallText: {
    alignSelf: "flex-end",
    color: "#5A607F",
    paddingLeft: "1rem",
    fontWeight: "400",
  },
  Media1249: {
    // width: "calc(100% - 230px)",
    marginLeft: "auto!important",
    marginRight: 0,
    "@media only screen and (max-width: 890px)": {
      width: "100%",
    },
  },
  margnBottomMediaQuery: {
    /* '& .MuiSvgIcon-root': {
    background: '#fff',
    }, */
    "@media only screen and (max-width: 1249px)": {
      marginBottom: ".75rem",
    },
  },
  // PerfectScrollbarContainer: {
  //     padding: '1rem 1.4rem',
  //     paddingBottom: '0',
  //     height: 'calc(100vh - 64px)',
  //     '@media only screen and (max-width: 575px)': {
  //         padding: '.5rem',
  //     },
  // },
  // mobileSave: {
  //     padding: '1rem 1.4rem',
  //     paddingBottom: '0',
  //     height: 'calc(100vh - 64px)',
  //     overflow: "auto",
  //     '@media only screen and (max-width: 575px)': {
  //         padding: '.5rem',
  //     },
  // },
  secondNavRow2: {
    "@media only screen and (max-width: 890px)": {
      justifyContent: "space-between",
    },
    "@media only screen and (max-width: 575px) and (min-width: 509px)": {
      marginBottom: ".6rem",
    },
    "@media only screen and (max-width: 510px)": {
      flexWrap: "wrap",
      "& > div": {
        width: "50%",
        minWidth: "50%",
        maxWidth: "50%",
        marginBottom: ".75rem",
      },
      "& > div:nth-child(odd)": {
        paddingRight: "1rem",
      },
    },
  },
  MobileFontStyle: {
    "@media only screen and (max-width: 575px) ": {
      marginBottom: ".7rem",
      marginTop: ".4rem",
      "& h1": {
        fontSize: "18px",
      },
    },
  },
  // '.css-1uccc91-singleValue': {
  //   color: '#fff!important'
  // }
}))

const darkText = {
  color: '#8B9DA5',
}

const darkInput = {
  color: '#fff',
  backgroundColor: fade('#2A2C34', 1),
  border: '1px solid #48494E'
}

export const SnTextInput = ({ toggle, label, className, showError, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  return (
    <>
      <label style={toggle ? darkText : {}} htmlFor={props.id || props.name}>{label}</label>
      <input style={toggle ? darkInput : {}} className={className} {...field} {...props} />
      {(showError ?? true) && submitCount>0 && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : null}
    </>
  );
};


export const SnSwitch = ({ label, className, showError, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <Switch defaultChecked={field.value} {...field} {...props} />
      {(showError ?? true) && submitCount>0 && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : null}
    </>
  );
};

export const SnTextArea = ({ label, className, showError, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <TextareaAutosize
        {...field} {...props}
        className={className}
        rowsMin={4}
      />
      {(showError ?? true) && submitCount>0 && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : null}
    </>
  );
};

export const SnInputWithIcon = ({ icon, label, className, showError, toggle, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  const classes = useStyles();
    
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <div  className={`${classes.search} ${classes.Media1249} ${classes.margnBottomMediaQuery}`}>
        <Box>
          <div className={classes.searchIcon}>
            {icon}
          </div>
        </Box>
        <InputBase
          {...field} {...props}
          classes={{
            root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
            input: classes.inputInput
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
      {(showError ?? true) && submitCount>0 && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : null}
    </>
  );
};
          
export const SnTextInputTag = ({ label, className, showError, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { touched, error, value } = meta;
  const { setValue } = helpers;
  const { submitCount } = useFormikContext();

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <TagsInput
        {...field} {...props}
          onChange={(tags) => setValue(tags)}
          instanceId={props.iid}
          className={className}
        />
        {(showError ?? true) && submitCount>0 && meta.error ? (
          <div className="required-field">{meta.error}</div>
        ) : null}
    </>  
  );
};

const lightReactSelectStyles = {
  control: styles => ({
    ...styles, 
    height: 55, 
    boxShadow: 0, 
    borderRadius: 8,
    '@media only screen and (max-width: 1440px)': {
      height: 50,
      // width: '100%',
      fontSize: 16,
      backgroundColor: "white",
      borderColor: '#D9E1EC'
    },
    '@media only screen and (max-width: 575px)': {
      height: 43,
      // width: '100%',
      fontSize: 14,
      backgroundColor: "white",
      borderColor: '#D9E1EC'
    },
    '&:hover': {
      borderColor: '#1DBF73'
    }
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles, 
    backgroundColor: isSelected ? '#1DBF73' : '#fff',
    '&:hover': {
      backgroundColor: '#1DBF73',
      color: '#fff'
    },
    '&:foucs': {
      backgroundColor: '#1DBF73'
    }
  }),
};

const darkReactSelectStyles = {
  control: styles => ({
    ...styles, 
    height: 55, 
    boxShadow: 0,
    borderRadius: 8,
    '@media only screen and (min-width: 300px)': {
      height: 50,
      // width: '100%',
      fontSize: 16,
      color: "white!important",
      backgroundColor: '#1E2029',
      // borderColor: '#48494E'
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '@media only screen and (max-width: 1440px)': {
      height: 50,
      // width: '100%',
      fontSize: 16,
    },
    '@media only screen and (max-width: 575px)': {
      height: 43,
      // width: '100%',
      fontSize: 14,
    },
    '&:hover': {
      borderColor: '#1DBF73'
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles, 
      backgroundColor: isSelected ? '#1DBF73' : '#1E2029',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#1DBF73',
      },
      '&:foucs': {
        backgroundColor: '#1DBF73',
      }
  }),
};

export const SnSelect1 = ({ label, className, showError, options, toggle, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <>
      <Select {...field} {...props}
        options={options}
        styles={toggle ? darkReactSelectStyles : lightReactSelectStyles}
      />
      </> 
      {(showError ?? true) && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : <></>}
    </>
  );
};

export const SnSelect = ({ label, className, showError, options, toggle, darkCustomSelectStyling, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { touched, error, value } = meta;
  const { setValue } = helpers;
  const { submitCount } = useFormikContext();
  return (

    <div>
      <Select
        value={{ label: field.value, value: field.value } }
        options={options}
        name={field.name}
        onChange={(option) => setValue(option.value)}
        instanceId={props.iid}
        className={toggle ? darkCustomSelectStyling : ''}
        styles={toggle ? darkReactSelectStyles : lightReactSelectStyles}
      />

      {(showError ?? true) && submitCount>0 && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : <></>}
    </div>
  );
};
