import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    const onError = ({ message }) => console.error(message);
    const onSuccess = ({ coords }) => setCoords(coords);

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);
  return coords;
}