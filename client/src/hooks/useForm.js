import { useCallback, useRef, useState } from 'react';

/** Minimal controlled-form state: values, field errors and a shared change handler. */
export function useForm(initialValues) {
  const initialValuesRef = useRef(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }, []);

  const reset = useCallback((nextValues = initialValuesRef.current) => {
    setValues(nextValues);
    setErrors({});
  }, []);

  return { values, setValues, errors, setErrors, handleChange, reset };
}
