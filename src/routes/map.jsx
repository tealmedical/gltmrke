import { useLoaderData, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";

import { useGeolocation } from "../lib/geolocation";
import { useSessionStorage } from "../lib/storage";
import { urlify } from "../lib/url";
import { fetchSalling } from "../lib/salling";

import MapCenterTracker from "../components/map_center_tracker";

// see https://vitejs.dev/guide/assets.html#static-asset-handling
import bilkaIcon from '../assets/images/bilka.png'
import føtexIcon from '../assets/images/føtex.png'
import nettoIcon from '../assets/images/netto.png'

import "leaflet/dist/leaflet.css";

const ICON_SIZE = [50, 50];
const ICONS = {
  bilka: new Icon({ iconUrl: bilkaIcon, iconSize: ICON_SIZE }),
  foetex: new Icon({ iconUrl: føtexIcon, iconSize: ICON_SIZE }),
  netto: new Icon({ iconUrl: nettoIcon, iconSize: ICON_SIZE }),
};
const SUPPORTED_BRANDS = ["foetex", "netto", "bilka"];
const CENTRAL_COPENHAGEN = {
  latitude: 55.67389271215473,
  longitude: 12.568196510606882,
}
const ZOOM_FAR = 13;
const ZOOM_NEAR = 15;

// see https://reactrouter.com/en/main/start/tutorial#loading-data
export async function loader() {
  return await fetchSalling("/v2/stores", {
    fields: "coordinates,name,id,brand",
    per_page: "10000"
  })
}

export default function MapPage() {
  // see https://reactrouter.com/en/main/hooks/use-loader-data
  const stores = useLoaderData();

  // see https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [sessionLocation, setSessionLocation] = useSessionStorage("mapPosition", null);
  // don't ask for geolocation if we have session location
  const geolocation = useGeolocation({ skipIf: Boolean(sessionLocation) });

  // priority: sessionStorage, then geolocation, fallback to default position
  const center = sessionLocation || geolocation || CENTRAL_COPENHAGEN;
  // slightly zoomed out when using default position
  const zoom = center == CENTRAL_COPENHAGEN ? ZOOM_FAR : ZOOM_NEAR;

  // filter out unsupported stores
  const supportedStores = stores.filter((store) => SUPPORTED_BRANDS.includes(store.brand));

  function handleStoreClick(event) {
    // this value comes from the `data` prop on <Marker>
    const store = event.target.options.data;
    // update sessionStorage (will be used when returning to map)
    const [longitude, latitude] = store.coordinates;
    setSessionLocation({ latitude, longitude });
    // trigger navigation to store page
    navigate(`/${urlify(store.name)}/${store.id}`);
  }

  return (
    <div className="map">
      <h2>VELKOMMEN TIL GULTMÆRKE.DK</h2>
      <h3>Vælg butik</h3>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
      >
        <MapCenterTracker center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {supportedStores.map((store) => (
          <Marker
            key={store.id}
            icon={ICONS[store.brand]}
            position={[store.coordinates[1], store.coordinates[0]]}
            data={store}
            eventHandlers={{ click: handleStoreClick }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
