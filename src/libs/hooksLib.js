import { useState } from 'react';

export function useFormFields(initialState) {
  const [fields, setFields] = useState(initialState);

  return [
    fields,
    function (e) {
      setFields({
        ...fields,
        [e.target.id]: e.target.value,
      });
    },
  ];
}
