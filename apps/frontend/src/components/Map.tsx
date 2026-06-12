"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon asset paths
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom gas station / pipeline HTML DivIcon matching screenshot exactly
const CustomStationIcon = (label: string, isSelected: boolean) => L.divIcon({
  className: 'custom-station-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="
        background-color: ${isSelected ? '#eab308' : '#01381d'};
        width: ${isSelected ? '32px' : '28px'};
        height: ${isSelected ? '32px' : '28px'};
        border: 2px solid ${isSelected ? '#ffffff' : '#10b981'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${isSelected ? '#eab308' : '#10b981'};
        transition: all 0.2s ease-in-out;
      ">
        <svg style="width: 14px; height: 14px; color: ${isSelected ? '#01381d' : '#10b981'};" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.317.766-.699 1.719-1.01 2.593a40.39 40.39 0 00-1.01-2.593c-.167-.403-.356-.785-.57-1.116-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.247.37-.417.847-.468 1.397-.05.549.03 1.19.23 1.874.402 1.37 1.203 2.923 2.115 4.148-.716.148-1.417.472-2.007.973-.59.5-1.002 1.168-1.193 1.944-.191.776-.118 1.63.228 2.404a5.976 5.976 0 002.13 2.422c.98.665 2.155 1.022 3.36 1.022s2.38-.357 3.36-1.022a5.976 5.976 0 002.13-2.422c.346-.774.419-1.628.228-2.404a5.978 5.978 0 00-1.193-1.944c-.59-.5-1.291-.825-2.007-.973.912-1.225 1.713-2.778 2.115-4.148.2-.684.28-1.325.23-1.874-.051-.55-.22-1.027-.468-1.397zM10 18a4 4 0 01-4-4c0-1.453.766-2.576 1.716-3.238A6.035 6.035 0 0010 12c.94 0 1.782-.24 2.284-.476C13.234 11.424 14 12.547 14 14a4 4 0 01-4 4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div style="
        margin-top: 2px;
        background-color: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(51, 65, 85, 0.5);
        border-radius: 3px;
        padding: 1px 3px;
        font-size: 8px;
        font-weight: 900;
        color: #ffffff;
        white-space: nowrap;
      ">
        #${label}
      </div>
    </div>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 20],
});

interface MapProps {
  userToken: string;
  userRoles: string[];
  stations: any[];
  pipelines: any[];
  onStationCreated: (station: any) => void;
  onPipelineCreated: (pipeline: any) => void;
  onStationSelected: (station: any) => void;
  selectedStation: any | null;
}

export default function Map({
  userToken,
  userRoles,
  stations,
  pipelines,
  onStationCreated,
  onPipelineCreated,
  onStationSelected,
  selectedStation,
}: MapProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'station' | 'pipeline'>('view');
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  
  // Layer style switch state ('satellite' | 'map' | 'street')
  const [mapStyle, setMapStyle] = useState<'satellite' | 'map' | 'street'>('satellite');

  // Pipeline drawing state
  const [tempPipelinePoints, setTempPipelinePoints] = useState<[number, number][]>([]);
  
  // Station form state
  const [stationName, setStationName] = useState('');
  const [stationCode, setStationCode] = useState('');
  const [stationType, setStationType] = useState('CITY_GATE');
  const [capacity, setCapacity] = useState('5000');
  const [pressureRating, setPressureRating] = useState('50');

  // Pipeline form state
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineCode, setPipelineCode] = useState('');
  const [pipelineType, setPipelineType] = useState('TRUNK');
  const [diameter, setDiameter] = useState('12');
  const [material, setMaterial] = useState('STEEL');
  const [pipePressure, setPipePressure] = useState('50');

  const canEdit = userRoles.includes('admin') || userRoles.includes('operator');

  // Map click handler helper component
  function MapEvents() {
    useMapEvents({
      click(e) {
        if (!canEdit) return;
        
        if (activeTab === 'station') {
          setClickedCoords([e.latlng.lng, e.latlng.lat]);
        } else if (activeTab === 'pipeline') {
          // Snap helper: check if clicked near any station
          const clickLng = e.latlng.lng;
          const clickLat = e.latlng.lat;
          let snappedLng = clickLng;
          let snappedLat = clickLat;
          
          // Snapping threshold (0.0005 degrees ~ 55m)
          const threshold = 0.0005;
          stations.forEach(station => {
            const stCoords = station.location.coordinates;
            const dist = Math.sqrt(
              Math.pow(stCoords[0] - clickLng, 2) + Math.pow(stCoords[1] - clickLat, 2)
            );
            if (dist < threshold) {
              snappedLng = stCoords[0];
              snappedLat = stCoords[1];
            }
          });

          setTempPipelinePoints(prev => [...prev, [snappedLat, snappedLng]]);
        }
      },
    });
    return null;
  }

  const handleStationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickedCoords) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/gis/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name: stationName,
          code: stationCode,
          type: stationType,
          capacity_m3_h: parseFloat(capacity),
          pressure_rating_bar: parseFloat(pressureRating),
          coordinates: clickedCoords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save station');
      }

      const newStation = await response.json();
      onStationCreated(newStation);
      
      // Reset form
      setStationName('');
      setStationCode('');
      setClickedCoords(null);
      alert('Station plotted successfully!');
    } catch (err: any) {
      alert(`Error saving station: ${err.message}`);
    }
  };

  const handlePipelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPipelinePoints.length < 2) {
      alert('Please click at least 2 points on the map to define the pipeline route.');
      return;
    }

    // Convert coordinates from [lat, lng] back to [lng, lat] for GeoJSON spec
    const geoJsonCoords = tempPipelinePoints.map(p => [p[1], p[0]]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/gis/pipelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name: pipelineName,
          code: pipelineCode,
          type: pipelineType,
          nominal_diameter_inch: parseFloat(diameter),
          material: material,
          pressure_rating_bar: parseFloat(pipePressure),
          coordinates: geoJsonCoords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save pipeline');
      }

      const newPipeline = await response.json();
      onPipelineCreated(newPipeline);

      // Reset form
      setPipelineName('');
      setPipelineCode('');
      setTempPipelinePoints([]);
      alert('Pipeline segment registered successfully!');
    } catch (err: any) {
      alert(`Error saving pipeline: ${err.message}`);
    }
  };

  // Center on Ibafo City Gate default coordinates
  const defaultCenter: [number, number] = [6.8378, 3.4402];

  // Map Tile layer endpoints
  const tiles = {
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    map: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full min-h-[600px] border border-slate-200 rounded-none overflow-hidden bg-slate-900 shadow-2xl relative">
      
      {/* 1. Map Render View */}
      <div className="flex-1 h-full relative z-10">
        
        {/* Style Toggles matching screenshot exactly */}
        <div className="absolute top-4 left-4 z-40 bg-white rounded-lg shadow-md border border-slate-200 flex overflow-hidden">
          <button 
            onClick={() => setMapStyle('map')}
            className={`px-4 py-1.5 text-xs font-bold transition ${mapStyle === 'map' ? 'bg-[#01381d] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Map
          </button>
          <button 
            onClick={() => setMapStyle('satellite')}
            className={`px-4 py-1.5 text-xs font-bold border-l border-slate-200 transition ${mapStyle === 'satellite' ? 'bg-[#01381d] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Satellite
          </button>
          <button 
            onClick={() => setMapStyle('street')}
            className={`px-4 py-1.5 text-xs font-bold border-l border-slate-200 transition ${mapStyle === 'street' ? 'bg-[#01381d] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Street
          </button>
        </div>

        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ width: '100%', height: '100%' }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; GIS Databox / NGML Operations'
            url={tiles[mapStyle]}
          />
          
          <MapEvents />

          {/* Render Saved Stations */}
          {stations.map((station) => {
            const [lng, lat] = station.location.coordinates;
            // Parse a simple number identifier like 18, 19, 20 or extract digits from code
            const labelMatch = station.code.match(/\d+/);
            const label = labelMatch ? labelMatch[0] : station.id;
            const isSelected = selectedStation?.id === station.id;

            return (
              <Marker 
                key={station.id} 
                position={[lat, lng]} 
                icon={CustomStationIcon(label, isSelected)}
                eventHandlers={{
                  click: () => {
                    onStationSelected(station);
                  }
                }}
              />
            );
          })}

          {/* Render Saved Pipelines */}
          {pipelines.map((pipeline) => {
            const path: [number, number][] = pipeline.geom.coordinates.map((c: number[]) => [c[1], c[0]]);
            const lineColor = pipeline.type === 'TRUNK' ? '#eab308' : '#eab308'; // Orange dashed/solid path matching image
            return (
              <Polyline 
                key={pipeline.id} 
                positions={path} 
                color={lineColor} 
                weight={3}
                dashArray="6, 8"
                opacity={0.9}
              >
                <Popup>
                  <div className="text-slate-900 p-1 font-sans">
                    <h3 className="font-bold text-sm border-b pb-1 mb-1">{pipeline.name}</h3>
                    <p className="text-xs"><strong>Code:</strong> {pipeline.code}</p>
                    <p className="text-xs"><strong>Type:</strong> {pipeline.type}</p>
                    <p className="text-xs"><strong>Material:</strong> {pipeline.material}</p>
                    <p className="text-xs"><strong>Diameter:</strong> {pipeline.nominal_diameter_inch}"</p>
                    <p className="text-xs"><strong>Length:</strong> {parseFloat(pipeline.length_km).toFixed(3)} km</p>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

          {/* Render Temp Pipeline Drawing Points */}
          {tempPipelinePoints.length > 0 && (
            <>
              <Polyline positions={tempPipelinePoints} color="#a855f7" dashArray="5, 10" />
              {tempPipelinePoints.map((pt, i) => (
                <Marker key={i} position={pt} icon={CustomStationIcon('+', false)} />
              ))}
            </>
          )}

          {/* Render Temp Station Click Marker */}
          {clickedCoords && activeTab === 'station' && (
            <Marker position={[clickedCoords[1], clickedCoords[0]]} icon={CustomStationIcon('?', true)} />
          )}

        </MapContainer>
      </div>

      {/* 2. Side Panel Control Form (Plot Station / Draw Pipeline tool toggle button panel) */}
      {canEdit && activeTab !== 'view' && (
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 flex flex-col justify-between overflow-y-auto z-20 shadow-lg shrink-0">
          <div>
            {/* Header Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => { setActiveTab('station'); setTempPipelinePoints([]); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition duration-150 ${activeTab === 'station' ? 'border-[#01381d] text-[#01381d]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                + Plot Station
              </button>
              <button
                onClick={() => { setActiveTab('pipeline'); setClickedCoords(null); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition duration-150 ${activeTab === 'pipeline' ? 'border-[#01381d] text-[#01381d]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                + Draw Pipeline
              </button>
              <button
                onClick={() => { setActiveTab('view'); setClickedCoords(null); setTempPipelinePoints([]); }}
                className="pb-3 text-sm font-bold text-red-500 px-2"
              >
                Cancel
              </button>
            </div>

            {/* Plot Station Form */}
            {activeTab === 'station' && (
              <form onSubmit={handleStationSubmit} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Station Details</h4>
                
                <div className="p-3 bg-[#01381d]/5 border border-emerald-800/20 rounded-lg text-xs text-emerald-800">
                  {clickedCoords ? (
                    <div>
                      <p className="font-semibold mb-1 text-emerald-700">✓ Coordinates Picked</p>
                      <p>Lng: {clickedCoords[0].toFixed(6)}</p>
                      <p>Lat: {clickedCoords[1].toFixed(6)}</p>
                    </div>
                  ) : (
                    <p className="animate-pulse text-amber-600 font-semibold">⚠️ Click anywhere on the map to set the Station coordinates.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">Station Name</label>
                  <input 
                    type="text" 
                    value={stationName} 
                    onChange={e => setStationName(e.target.value)} 
                    required
                    placeholder="e.g. OLAM NIG. LTD."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Station Code</label>
                    <input 
                      type="text" 
                      value={stationCode} 
                      onChange={e => setStationCode(e.target.value)} 
                      required
                      placeholder="e.g. Station #21"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Type</label>
                    <select 
                      value={stationType} 
                      onChange={e => setStationType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    >
                      <option value="CITY_GATE">City Gate</option>
                      <option value="CUSTOMER">Customer</option>
                      <option value="REGULATOR">Regulator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Capacity (m³/h)</label>
                    <input 
                      type="number" 
                      value={capacity} 
                      onChange={e => setCapacity(e.target.value)} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Pressure Rating (bar)</label>
                    <input 
                      type="number" 
                      value={pressureRating} 
                      onChange={e => setPressureRating(e.target.value)} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!clickedCoords}
                  className="w-full py-2.5 rounded-lg bg-[#01381d] hover:bg-[#002713] active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 transition font-bold text-white text-xs uppercase"
                >
                  Register Station Location
                </button>
              </form>
            )}

            {/* Draw Pipeline Form */}
            {activeTab === 'pipeline' && (
              <form onSubmit={handlePipelineSubmit} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Details</h4>
                
                <div className="p-3 bg-[#01381d]/5 border border-emerald-800/20 rounded-lg text-xs text-emerald-800 space-y-2">
                  <p>Click sequentially on the map to define the route nodes.</p>
                  <div className="flex items-center justify-between">
                    <span>Nodes Drawn: {tempPipelinePoints.length}</span>
                    {tempPipelinePoints.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTempPipelinePoints([])}
                        className="text-red-500 hover:underline font-bold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold animate-pulse">
                    Auto-snapping is ACTIVE. Click near any station to snap line endpoints.
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">Pipeline Name</label>
                  <input 
                    type="text" 
                    value={pipelineName} 
                    onChange={e => setPipelineName(e.target.value)} 
                    required
                    placeholder="e.g. Ibafo Trunk A"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Code</label>
                    <input 
                      type="text" 
                      value={pipelineCode} 
                      onChange={e => setPipelineCode(e.target.value)} 
                      required
                      placeholder="e.g. PL-IBA-A"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Type</label>
                    <select 
                      value={pipelineType} 
                      onChange={e => setPipelineType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    >
                      <option value="TRUNK">Trunk line</option>
                      <option value="SPUR">Spur line</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs text-slate-500 font-medium">Dia (in)</label>
                    <input 
                      type="number" 
                      value={diameter} 
                      onChange={e => setDiameter(e.target.value)} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs text-slate-500 font-medium">Material</label>
                    <select 
                      value={material} 
                      onChange={e => setMaterial(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    >
                      <option value="STEEL">Steel</option>
                      <option value="HDPE">HDPE</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs text-slate-500 font-medium">Pres. (bar)</label>
                    <input 
                      type="number" 
                      value={pipePressure} 
                      onChange={e => setPipePressure(e.target.value)} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#01381d] rounded-lg p-2 text-sm text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={tempPipelinePoints.length < 2}
                  className="w-full py-2.5 rounded-lg bg-[#01381d] hover:bg-[#002713] active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 transition font-bold text-white text-xs uppercase"
                >
                  Register Pipeline Segment
                </button>
              </form>
            )}

          </div>
          
          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-4">
            Creating pipelines triggers backend spatial snaps verifying compliance metrics.
          </div>
        </div>
      )}

      {/* Floating Add/Draw Edit Control bar when in overview mode */}
      {canEdit && activeTab === 'view' && (
        <div className="absolute top-4 right-4 z-40 bg-white rounded-lg shadow-md border border-slate-200 p-1.5 flex gap-1">
          <button 
            onClick={() => setActiveTab('station')}
            className="px-3 py-1.5 bg-[#01381d] text-white rounded text-xs font-semibold hover:bg-[#002713] transition"
          >
            + Plot Station
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className="px-3 py-1.5 bg-[#01381d] text-white rounded text-xs font-semibold hover:bg-[#002713] transition"
          >
            + Draw Pipeline
          </button>
        </div>
      )}

    </div>
  );
}
