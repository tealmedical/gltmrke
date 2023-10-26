import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";

import { SALLING_HOST, SALLING_TOKEN } from "../constants";
import { useGeolocation } from "../lib/geolocation";
import { useSessionStorage } from "../lib/storage";
import { urlify } from "../lib/url";

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

// see https://reactrouter.com/en/main/start/tutorial#loading-data
export async function loader() {
  const response = await fetch(`${SALLING_HOST}/v2/stores?fields=coordinates,name,id,brand&per_page=10000"`, {
    headers: { Authorization: `bearer ${SALLING_TOKEN}` }
  });

  return await response.json();
}

export default function MapPage() {
  // see https://reactrouter.com/en/main/hooks/use-loader-data
  const stores = useLoaderData();

  // see https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [sessionLocation, setSessionLocation] = useSessionStorage("mapPosition", null);
  const geolocation = useGeolocation();

  // priority: sessionStorage, then geolocation, fallback to default position
  const initialCenter = sessionLocation || geolocation || CENTRAL_COPENHAGEN;
  // slightly zoomed out when using default position
  const initialZoom = initialCenter == DEFAULT_POSITION ? 13 : 15;

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
        center={[initialCenter.latitude, initialCenter.longitude]}
        zoom={initialZoom}
      >
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
