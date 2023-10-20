import "leaflet/dist/leaflet.css";

import "./map.css";
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  useMapEvent,
} from "react-leaflet";
import { Icon } from "leaflet";
import { SALLING_TOKEN } from "./constants";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}


const iconSize = [50, 50];
const icons = {
  bilka: new Icon({
    iconUrl: "./bilka.png",
    iconSize,
  }),
  foetex: new Icon({
    iconUrl: "./foetex.png",
    iconSize,
  }),
  netto: new Icon({
    iconUrl: "./netto.png",
    iconSize,
  }),
};
const supportedBrands = ["foetex", "netto", "bilka"];
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `bearer ${SALLING_TOKEN}`,
    },
  }).then((res) => res.json());

export default function MapPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("https://api.sallinggroup.com/v2/stores?fields=coordinates,name,id,brand&per_page=10000", {
      headers: {
        Authorization: `bearer ${SALLING_TOKEN}`,
      },
    }).then(async (res) => {
      const data = await res.json()
      setData(data);
    });
  }, [])

  const [lng, setLng] = useState(12.568196510606882);
  const [lat, setLat] = useState(55.67389271215473);
  
  useEffect(() => {
    const onError = (pars) => {
      console.log("navigator error")
    };
    const onSuccess = (pars) => {
      console.log("pos fromm navigator")
      setLat(pars.coords.latitude);
      setLng(pars.coords.longitude);
    };
    let latLocal = sessionStorage.getItem("lat");
    let lngLocal = sessionStorage.getItem("lng");

    if (!(latLocal === null) && !(lngLocal === null)) {
      console.log("pos from sessionstorage");

      setLat(latLocal);
      setLng(lngLocal);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
    }
  }, []);

  const mapRef = useRef();

  if (!data) return null;
 

  return (
    <>
      <div>
        <h1 style={{ fontSize: "3vh", textAlign: "center" }}>
          VELKOMMEN TIL GULTMÆRKE.DK
        </h1>
        <h2 style={{ fontSize: "2vh", textAlign: "center" }}>Vælg butik</h2>
        <MapContainer center={[lat, lng]} zoom={13}>
        <ChangeView center={[lat, lng]} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {data
            .filter((val) => supportedBrands.includes(val.brand))
            .map((val) => (
              <Marker
                icon={icons[val.brand]}
                key={val.id}
                position={[val.coordinates[1], val.coordinates[0]]}
                data={[val.coordinates[1], val.coordinates[0]]}
                eventHandlers={{
                  click: (e) => {
                    console.log(e.sourceTarget.options.data);
                    sessionStorage.setItem(
                      "lat",
                      e.sourceTarget.options.data[0]
                    );
                    sessionStorage.setItem(
                      "lng",
                      e.sourceTarget.options.data[1]
                    );
                   
                    //setLat(e.sourceTarget.options.data[0])
                    window.location=`/stores/${val.id}`
                  },
                }}
              ></Marker>
            ))}
        </MapContainer>
      </div>
    </>
  );
}
