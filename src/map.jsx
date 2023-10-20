import "leaflet/dist/leaflet.css";
import "./map.css";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { SALLING_TOKEN } from "./constants";
const iconSize = [50, 50]
const icons = {
  bilka: new Icon({
    iconUrl: "./bilka.png",
    iconSize
  }),
  foetex: new Icon({
    iconUrl: "./foetex.png",
    iconSize
  }),
  netto: new Icon({
    iconUrl: "./netto.png",
    iconSize
  }),
};
const supportedBrands = ["foetex", "netto", "bilka"];


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

  console.log("YOO")
  console.log(data)

  useEffect(() => {
    const onError = (pars) => { };
    const onSuccess = (pars) => {
      setLat(pars.coords.latitude);
      setLng(pars.coords.longitude);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
    }
  }, []);


  const [lng, setLng] = useState(12.568196510606882);
  const [lat, setLat] = useState(55.67389271215473);

  const mapRef = useRef();
  if (!data) return null;



  return (
    <>
      <div>
        <h1 style={{ fontSize: "3vh", textAlign: "center" }}>VELKOMMEN TIL GULTMÆRKE.DK</h1>
        <h2 style={{ fontSize: "2vh", textAlign: "center" }}>Vælg butik</h2>
        <MapContainer ref={mapRef} center={[lat, lng]} zoom={15}>
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

                eventHandlers={{
                  click: () => {
                    window.location = `/stores/${val.id}`;
                  },
                }}
              ></Marker>
            ))}
        </MapContainer>
      </div>
    </>
  );
}
