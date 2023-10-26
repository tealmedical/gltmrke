import { useMap } from "react-leaflet";

/**
 * Updates the containing map to focus on center whenever it changes
 */
export default function MapCenterTracker({ center, zoom }) {
  const map = useMap();
  map.setView([center.latitude, center.longitude], zoom);
  return null;
}
