import { useLoaderData, useNavigate } from "react-router-dom";

import { useGeolocation, validateLatLng } from "../lib/location";
import { useSessionStorage } from "../lib/storage";
import { urlify } from "../lib/url";
import { fetchSalling } from "../lib/salling";

import LeafletMap from "../components/leaflet_map";

// see https://vitejs.dev/guide/assets.html#static-asset-handling
import bilkaIcon from '../assets/images/bilka.png'
import føtexIcon from '../assets/images/føtex.png'
import nettoIcon from '../assets/images/netto.png'

export const ICONS = {
  bilka: bilkaIcon,
  foetex: føtexIcon,
  netto: nettoIcon,
};

const SUPPORTED_BRANDS = ["foetex", "netto", "bilka"];
const CENTRAL_COPENHAGEN = {
  lat: 55.67389271215473,
  lng: 12.568196510606882,
}
const ZOOM_FAR = 13;
const ZOOM_NEAR = 16;

// see https://reactrouter.com/en/main/start/tutorial#loading-data
export async function loader() {
  const stores = await fetchSalling("/v2/stores", {
    fields: "coordinates,name,id,brand",
    per_page: "10000"
  })
  // make sure store coordinates are available as a dict instead of array
  return stores.map(store => ({
    latLng: { lat: store.coordinates[1], lng: store.coordinates[0] },
    ...store,
  }));
}

export default function Atlas() {
  // see https://reactrouter.com/en/main/hooks/use-loader-data
  const stores = useLoaderData();

  // see https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [sessionLocation, setSessionLocation] = useSessionStorage("mapPosition", null, validateLatLng);
  // don't ask for geolocation if we have session location
  const geolocation = useGeolocation({ skipIf: Boolean(sessionLocation) });

  // priority: sessionStorage, then geolocation, fallback to default position
  const center = sessionLocation || geolocation || CENTRAL_COPENHAGEN;
  // slightly zoomed out when using default position
  const zoom = center == CENTRAL_COPENHAGEN ? ZOOM_FAR : ZOOM_NEAR;

  // filter out unsupported stores
  const supportedStores = stores.filter((store) => SUPPORTED_BRANDS.includes(store.brand));

  function handleMarkerClick(event) {
    // this value comes from the `data` prop on <Marker>
    const store = event.propagatedFrom.options.data;
    // update sessionStorage (will be used when returning to map)
    setSessionLocation(store.latLng);
    // trigger navigation to store page
    navigate(`/${urlify(store.name)}/${store.id}`);
  }

  const markerOptions = supportedStores.map(store => ({
    latLng: store.latLng,
    icon: { iconUrl: ICONS[store.brand], iconSize: [50, 50] },
    data: store,
  }));

  return (
    <div className="atlas">
      <h2>VELKOMMEN TIL GULTMÆRKE.DK</h2>
      <h3>Vælg butik</h3>
      <LeafletMap
        center={center}
        zoom={zoom}
        markerOptions={markerOptions}
        onMarkerClick={handleMarkerClick}
      />
    </div >
  );
}
