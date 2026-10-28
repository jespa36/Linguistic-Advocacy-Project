import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Chicago center
export const CHICAGO_CENTER: [number, number] = [41.8781, -87.6298];

// Custom color-coded pin icons
function makePinIcon(color: string, isHighlighted = false) {
  const size = isHighlighted ? 44 : 36;
  const anchor = isHighlighted ? 22 : 18;
  const swatch = isHighlighted ? 38 : 28;
  return L.divIcon({
    className: 'llm-pin',
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:3px solid #ffffff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 3px 8px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="
          width:${swatch - 6}px;height:${swatch - 6}px;
          background:#ffffff;border-radius:50%;
          transform:rotate(45deg);
          opacity:${isHighlighted ? 1 : 0};
        "></div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, size],
    popupAnchor: [0, -size + 6],
  });
}

export const officialIcon = makePinIcon('#1d4ed8');
export const grassrootsIcon = makePinIcon('#d97706');
export const officialIconActive = makePinIcon('#1d4ed8', true);
export const grassrootsIconActive = makePinIcon('#d97706', true);

// Map tile layer — clean research-style CartoDB Positron tiles
export const tileLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  }
);
