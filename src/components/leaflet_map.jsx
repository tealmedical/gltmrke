import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default function LeafletMap({ center, zoom, markerOptions, onMarkerClick, ...props }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let map = mapRef.current;
    if (map === null) {
      map = mapRef.current = L.map(containerRef.current);

      // add background tile layers
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // prepare markers
      const markers = markerOptions.map(({ latLng, icon, ...options }) => {
        return L.marker(latLng, {
          icon: L.icon(icon),
          ...options,
        });
      });

      // add markers as a cluster group
      const cluster = L.markerClusterGroup();
      cluster.addLayers(markers);
      cluster.on('click', onMarkerClick)
      map.addLayer(cluster);
    }

    // track center and zoom
    map.setView(center, zoom);

    return () => {
      if (mapRef.current === null) return;
      // technically we should destroy the map here
      // but I think it'll mess everything up
      /*mapRef.current.remove();
      mapRef.current = null;*/
    }
  }, [center, zoom, markerOptions, onMarkerClick]);

  return <div ref={containerRef} {...props} />;
}
