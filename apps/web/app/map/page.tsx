'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { Viewer } from '../../lib/safe-photo-sphere-viewer';
import { api } from '../../lib/api';
import type { Poi } from '../../lib/types';

const DEFAULT_CENTER: [number, number] = [75.5658, 26.8437];
const DEFAULT_PANORAMA = 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg';

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<InstanceType<typeof Viewer> | null>(null);

  const [pois, setPois] = useState<Poi[]>([]);
  const [selected, setSelected] = useState<Poi | null>(null);

  useEffect(() => {
    api
      .pois()
      .then((data) => {
        setPois(data);
        if (data.length > 0) {
          setSelected(data[0]);
        }
      })
      .catch((error) => {
        console.error('Failed to load points of interest', error);
      });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: 'OpenStreetMap Light',
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-base',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: DEFAULT_CENTER,
      zoom: 16,
      maxZoom: 19,
      minZoom: 4,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.once('load', () => {
      map.resize();
    });
    map.on('error', (event) => {
      console.error('MapLibre error', event.error);
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = pois.map((poi) => {
      const marker = new maplibregl.Marker({ color: '#38bdf8' })
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        map.flyTo({ center: [poi.longitude, poi.latitude], zoom: 17, essential: true });
        setSelected(poi);
      });

      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [pois]);

  useEffect(() => {
    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!viewerContainerRef.current) {
      return;
    }

    if (selected && mapRef.current) {
      mapRef.current.flyTo({
        center: [selected.longitude, selected.latitude],
        zoom: 17,
        essential: true,
      });
    }

    if (!viewerRef.current) {
      viewerRef.current = new Viewer({
        container: viewerContainerRef.current,
        panorama: DEFAULT_PANORAMA,
        navbar: ['zoom', 'fullscreen'],
      });
    }

    if (selected) {
      viewerRef.current
        .setPanorama(DEFAULT_PANORAMA, { caption: selected.name })
        .catch((error: unknown) => console.warn('Unable to set panorama', error));
    }
  }, [selected]);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Campus Map</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', maxWidth: '720px' }}>
          Explore campus landmarks and preview immersive 360 degree scenes. Click any marker or card to jump to a location.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        }}
      >
        <div
          ref={mapContainerRef}
          style={{
            minHeight: '420px',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,0.2)',
            position: 'relative',
            background: 'radial-gradient(circle at top, rgba(30, 58, 138, 0.35), rgba(15, 23, 42, 0.9))',
          }}
        />

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="card" style={{ minHeight: '120px' }}>
            {selected ? (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>{selected.name}</h2>
                <p style={{ color: 'rgba(226,232,240,0.78)' }}>{selected.summary}</p>
                <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.85rem' }}>{selected.description}</p>
              </div>
            ) : (
              <p>Select a point of interest to view details.</p>
            )}
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div ref={viewerContainerRef} style={{ width: '100%', height: '260px', borderRadius: '1rem', overflow: 'hidden' }} />
          </div>
        </div>
      </div>

      <div className="card-grid">
        {pois.map((poi) => (
          <button
            key={poi.id}
            onClick={() => setSelected(poi)}
            style={{
              textAlign: 'left',
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{poi.name}</h3>
              <p style={{ color: 'rgba(226,232,240,0.78)' }}>{poi.summary}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.85)' }}>
                {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
