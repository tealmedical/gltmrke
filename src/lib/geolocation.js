import { useEffect, useState } from 'react';

/**
 * Tries to return the users location using the navigator geolocation API
 * 
 * null otherwise
 * 
 * set `skipIf: true` to avoid asking for geolocation
 */
export function useGeolocation({ skipIf }) {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (skipIf || !navigator.geolocation) return;
    const onError = ({ message }) => console.error(message);
    const onSuccess = ({ coords }) => setCoords(coords);

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);
  return coords;
}