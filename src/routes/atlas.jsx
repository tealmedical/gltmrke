import { useLoaderData, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";

import { useGeolocation, validateLatLng } from "../lib/location";
import { useSessionStorage } from "../lib/storage";
import { urlify } from "../lib/url";
import { fetchSalling } from "../lib/salling";

import MapCenterTracker from "../components/map_center_tracker";
import MapBrandMarker from "../components/map_brand_marker";

const SUPPORTED_BRANDS = ["foetex", "netto", "bilka"];
const CENTRAL_COPENHAGEN = {
  lat: 55.67389271215473,
  lng: 12.568196510606882,
}
const ZOOM_FAR = 13;
const ZOOM_NEAR = 15;

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

  function handleStoreClick(event) {
    // this value comes from the `data` prop on <Marker>
    const store = event.target.options.data;
    // update sessionStorage (will be used when returning to map)
    setSessionLocation(store.latLng);
    // trigger navigation to store page
    navigate(`/${urlify(store.name)}/${store.id}`);
  }

  return (
    <div className="atlas">
      <h2>VELKOMMEN TIL GULTMÆRKE.DK</h2>
      <h3>Vælg butik</h3>
      <MapContainer center={center} zoom={zoom}>
        <MapCenterTracker center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {supportedStores.map((store) => (
          <MapBrandMarker
            key={store.id}
            brand={store.brand}
            position={store.latLng}
            data={store}
            eventHandlers={{ click: handleStoreClick }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
