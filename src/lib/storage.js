import { useState } from 'react';

/**
 * Emulates useState but with a sessionStorage backend
 * 
 * Takes care from parsing/stringifying
 * 
 * Clears key on parse error
 * 
 * Pass a validator, which decides when to clear value
 *  (in case you change the structure of the value)
 */
export function useSessionStorage(key, initialValue, validator) {
  // parse or remove item from storage
  let value = null;
  try {
    const serialized = sessionStorage.getItem(key);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (validator && !validator(parsed)) {
        throw new Error("Session value didn't pass validator")
      }
      value = parsed;
    }
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(key);
    console.log("cleared value in session storage")
  }

  // sync with react state
  const [internal, setInternal] = useState(value || initialValue);

  function setState(newValue) {
    sessionStorage.setItem(key, JSON.stringify(newValue));
    setInternal(newValue);
  }

  return [internal, setState]
}