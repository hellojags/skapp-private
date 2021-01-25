export const getInitValAndValidationSchemaFromSnFormikObj = snFormikObj => 
        Object.entries(snFormikObj).reduce((accumulator, [key, [initialValues, validation]], idx)=>{
                accumulator.initialValues[key]=initialValues;
                accumulator.validationSchema[key]=validation;
                return accumulator;
            }, 
        {initialValues:{}, validationSchema:{}});