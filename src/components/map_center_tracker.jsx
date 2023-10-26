import { useMap } from "react-leaflet";

export default function MapCenterTracker({ center, zoom }) {
  const map = useMap();
  map.setView([center.latitude, center.longitude], zoom);
  return null;
}
