import React from 'react';
import { Formik, Form, useField } from 'formik';

 export const SnTextInput = ({ label, className, showError, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className={className} {...field} {...props} />
        {(showError ?? true) && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
  };