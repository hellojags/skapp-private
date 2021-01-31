import React from 'react';
import { Formik, Form, useField } from 'formik';
import Select from 'react-select';

export const SnTextInput = ({ label, className, showError, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className={className} {...field} {...props} />
      {(showError ?? true) && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : null}
    </>
  );
};


const reactSelectStyles = {
  control: styles => ({
      ...styles, backgroundColor: 'white', height: 55, boxShadow: 0, borderColor: '#D9E1EC', color: '#000', borderRadius: 8,
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
      }
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles, backgroundColor: isSelected ? '#1DBF73' : '#fff',
      '&:foucs': {
          backgroundColor: '#1DBF73'
      }
  }),
};

export const SnSelect1 = ({ label, className, showError, options, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <>
      <Select {...field} {...props}
        options={options}
        styles={reactSelectStyles}
      />
      </> 
      {(showError ?? true) && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : <></>}
    </>
  );
};

export const SnSelect = ({ label, className, showError, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { touched, error, value } = meta;
  const { setValue } = helpers;

  return (
    <div>
      <Select
        options={options}
        name={field.name}
        onChange={(option) => setValue(option.value)}
        instanceId={props.iid}
        styles={reactSelectStyles}
      />

      {(showError ?? true) && meta.error ? (
        <div className="required-field">{meta.error}</div>
      ) : <></>}
    </div>
  );
};
