import { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  CHICAGO_CENTER,
  tileLayer,
  officialIcon,
  grassrootsIcon,
  officialIconActive,
  grassrootsIconActive,
} from '@/lib/leaflet-setup';
import type { Sign } from '@/lib/supabase';

interface MapViewProps {
  signs: Sign[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  /** pixel height of the map container (default 600) */
  height?: number;
  className?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function MapView({
  signs,
  activeId,
  onSelect,
  height = 600,
  className = '',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: CHICAGO_CENTER,
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false,
    });
    tileLayer.addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render markers when signs change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);

    signs.forEach((sign) => {
      const isActive = sign.id === activeId;
      const icon =
        sign.category === 'official'
          ? isActive
            ? officialIconActive
            : officialIcon
          : isActive
            ? grassrootsIconActive
            : grassrootsIcon;

      const marker = L.marker([sign.latitude, sign.longitude], { icon });
      const langLabel = escapeHtml(sign.languages.join(', '));
      const noteHtml = sign.note
        ? `<div style="font-size:13px;color:#4b5563;margin-bottom:6px">${escapeHtml(sign.note)}</div>`
        : '';
      marker.bindPopup(
        `<div style="font-family:Inter,system-ui,sans-serif;min-width:200px;max-width:240px">
          <img src="${escapeHtml(sign.photo_url)}" alt="Sign photo" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;display:block" />
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;color:${sign.category === 'official' ? '#1d4ed8' : '#d97706'}">${sign.category}</div>
          <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px">${langLabel}</div>
          ${noteHtml}
          <div style="font-size:11px;color:#9ca3af">${formatDate(sign.created_at)}</div>
        </div>`,
        { maxWidth: 260 }
      );
      marker.on('click', () => onSelect(sign.id));
      marker.addTo(layer);
    });

    return () => {
      layer.remove();
    };
  }, [signs, activeId, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-2xl overflow-hidden ${className}`}
    />
  );
}
