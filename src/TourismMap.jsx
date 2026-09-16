import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COLIMA_CENTER = [19.25, -103.88];

export function hasCoordinates(item) {
  return (
    Number.isFinite(item?.lat) &&
    Number.isFinite(item?.lng) &&
    item.lat >= -90 &&
    item.lat <= 90 &&
    item.lng >= -180 &&
    item.lng <= 180
  );
}

export function googleMapsUrl(item) {
  if (!hasCoordinates(item)) return null;
  const query = encodeURIComponent(`${item.lat},${item.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

const MARKER_TYPE = {
  Turismo: "turismo",
  Tianguis: "tianguis",
  Mercados: "mercados",
  Eventos: "eventos",
};

export default function TourismMap({ items, compact = false, className = "" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: COLIMA_CENTER,
      zoom: 9,
      scrollWheelZoom: true,
      zoomControl: !compact,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);
    const frame = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      cancelAnimationFrame(frame);
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, [compact]);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();
    const positions = [];

    for (const item of items) {
      if (!item.active || !hasCoordinates(item)) continue;
      const position = [item.lat, item.lng];
      const mapsUrl = googleMapsUrl(item);
      const type = MARKER_TYPE[item.type] || "turismo";
      const icon = L.divIcon({
        html: '<span class="tourism-marker__pin" aria-hidden="true"></span>',
        className: `tourism-marker tourism-marker--${type}`,
        iconSize: [30, 38],
        iconAnchor: [15, 38],
      });

      const marker = L.marker(position, { icon, keyboard: true }).addTo(markers);
      const tooltip = document.createElement("span");
      tooltip.textContent = `${item.name} · ${item.municipality} — abrir en Google Maps`;
      marker.bindTooltip(tooltip, { direction: "top", offset: [0, -18] });
      marker.getElement()?.setAttribute("aria-label", `Ver ${item.name} en Google Maps`);
      marker.getElement()?.setAttribute("role", "link");
      marker.on("click", () => window.open(mapsUrl, "_blank", "noopener,noreferrer"));
      positions.push(position);
    }

    if (positions.length === 1) {
      map.setView(positions[0], compact ? 11 : 14);
    } else if (positions.length > 1) {
      map.fitBounds(positions, { padding: [35, 35], maxZoom: compact ? 10 : 13 });
    } else {
      map.setView(COLIMA_CENTER, 9);
    }
  }, [items, compact]);

  return (
    <div
      ref={containerRef}
      className={`tourism-map ${className}`}
      role="region"
      aria-label="Mapa de lugares de Colima"
    />
  );
}
