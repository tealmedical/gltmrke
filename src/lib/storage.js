import { useState } from 'react';

export function useSessionStorage(key, initialValue) {
  // parse or remove item from storage
  let value = null;
  try {
    value = JSON.parse(sessionStorage.getItem(key));
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(key);
  }

  // sync with react state
  const [internal, setInternal] = useState(value || initialValue);

  function setState(value) {
    sessionStorage.setItem(key, JSON.stringify(value));
    setInternal(value);
  }

  return [internal, setState]
}