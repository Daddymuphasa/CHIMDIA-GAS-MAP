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

// Custom gas station / pipeline markers
const StationIcon = (color: string) => L.divIcon({
  className: 'custom-station-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 6px ${color};"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface MapProps {
  userToken: string;
  userRoles: string[];
  stations: any[];
  pipelines: any[];
  onStationCreated: (station: any) => void;
  onPipelineCreated: (pipeline: any) => void;
}

export default function Map({
  userToken,
  userRoles,
  stations,
  pipelines,
  onStationCreated,
  onPipelineCreated,
}: MapProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'station' | 'pipeline'>('view');
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  
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

  return (
    <div className="flex flex-col lg:flex-row w-full h-[600px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-2xl">
      
      {/* 1. Map Render View */}
      <div className="flex-1 h-[400px] lg:h-full relative z-10">
        <MapContainer 
          center={defaultCenter} 
          zoom={14} 
          style={{ width: '100%', height: '100%' }}
          className="z-10"
        >
          {/* CartoDB Dark Matter basemap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapEvents />

          {/* Render Saved Stations */}
          {stations.map((station) => {
            const [lng, lat] = station.location.coordinates;
            const markerColor = station.type === 'CITY_GATE' ? '#ec4899' : station.type === 'CUSTOMER' ? '#06b6d4' : '#f59e0b';
            return (
              <Marker 
                key={station.id} 
                position={[lat, lng]} 
                icon={StationIcon(markerColor)}
              >
                <Popup>
                  <div className="text-slate-900 p-1 font-sans">
                    <h3 className="font-bold text-sm border-b pb-1 mb-1">{station.name}</h3>
                    <p className="text-xs"><strong>Code:</strong> {station.code}</p>
                    <p className="text-xs"><strong>Type:</strong> {station.type}</p>
                    <p className="text-xs"><strong>Capacity:</strong> {station.capacity_m3_h} m³/h</p>
                    <p className="text-xs"><strong>Pressure:</strong> {station.pressure_rating_bar} bar</p>
                    <p className="text-xs"><strong>Status:</strong> {station.status}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render Saved Pipelines */}
          {pipelines.map((pipeline) => {
            // Convert GeoJSON LineString coordinates [[lng, lat]] to Leaflet [[lat, lng]] format
            const path: [number, number][] = pipeline.geom.coordinates.map((c: number[]) => [c[1], c[0]]);
            const lineColor = pipeline.type === 'TRUNK' ? '#3b82f6' : '#10b981';
            return (
              <Polyline 
                key={pipeline.id} 
                positions={path} 
                color={lineColor} 
                weight={4}
                opacity={0.8}
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
                <Marker key={i} position={pt} icon={StationIcon('#a855f7')} />
              ))}
            </>
          )}

          {/* Render Temp Station Click Marker */}
          {clickedCoords && activeTab === 'station' && (
            <Marker position={[clickedCoords[1], clickedCoords[0]]} icon={StationIcon('#ef4444')} />
          )}

        </MapContainer>
      </div>

      {/* 2. Side Panel Control Form */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition duration-150 ${activeTab === 'view' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Network Overview
            </button>
            {canEdit && (
              <>
                <button
                  onClick={() => { setActiveTab('station'); setTempPipelinePoints([]); }}
                  className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition duration-150 ${activeTab === 'station' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  + Plot Station
                </button>
                <button
                  onClick={() => { setActiveTab('pipeline'); setClickedCoords(null); }}
                  className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition duration-150 ${activeTab === 'pipeline' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  + Draw Pipeline
                </button>
              </>
            )}
          </div>

          {/* Tab 1: Network Overview List */}
          {activeTab === 'view' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Infrastructure</h3>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <div className="text-xs text-slate-400 mb-1">{stations.length} Stations registered</div>
                {stations.map(station => (
                  <div key={station.id} className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-200">{station.name}</div>
                      <div className="text-xs text-slate-500">{station.code} • {station.type}</div>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
                      {station.status}
                    </span>
                  </div>
                ))}
                
                <div className="text-xs text-slate-400 mt-4 mb-1">{pipelines.length} Pipeline Segments</div>
                {pipelines.map(pipe => (
                  <div key={pipe.id} className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-200">{pipe.name}</div>
                      <div className="text-xs text-slate-500">{pipe.code} • {parseFloat(pipe.length_km).toFixed(2)} km</div>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-blue-400">
                      {pipe.material}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Add Station Form */}
          {activeTab === 'station' && (
            <form onSubmit={handleStationSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300">Station Geometry Setup</h4>
              
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-slate-400">
                {clickedCoords ? (
                  <div>
                    <p className="text-emerald-400 font-medium mb-1">✓ Coordinates Picked</p>
                    <p>Lng: {clickedCoords[0].toFixed(6)}</p>
                    <p>Lat: {clickedCoords[1].toFixed(6)}</p>
                  </div>
                ) : (
                  <p className="animate-pulse text-cyan-400 font-medium">⚠️ Click anywhere on the map to set the Station point.</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Station Name</label>
                <input 
                  type="text" 
                  value={stationName} 
                  onChange={e => setStationName(e.target.value)} 
                  required
                  placeholder="e.g. Ibafo Main Gate"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Station Code</label>
                  <input 
                    type="text" 
                    value={stationCode} 
                    onChange={e => setStationCode(e.target.value)} 
                    required
                    placeholder="e.g. CG-IBA-01"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Type</label>
                  <select 
                    value={stationType} 
                    onChange={e => setStationType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="CITY_GATE">City Gate</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="REGULATOR">Regulator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Capacity (m³/h)</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={e => setCapacity(e.target.value)} 
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Pressure Rating (bar)</label>
                  <input 
                    type="number" 
                    value={pressureRating} 
                    onChange={e => setPressureRating(e.target.value)} 
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!clickedCoords}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 transition font-bold text-slate-950 text-xs uppercase"
              >
                Register Station Location
              </button>
            </form>
          )}

          {/* Tab 3: Draw Pipeline Form */}
          {activeTab === 'pipeline' && (
            <form onSubmit={handlePipelineSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300">Pipeline Route Setup</h4>
              
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-2">
                <p>Click sequentially on the map to define the route nodes.</p>
                <div className="flex items-center justify-between">
                  <span>Nodes Drawn: {tempPipelinePoints.length}</span>
                  {tempPipelinePoints.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTempPipelinePoints([])}
                      className="text-red-400 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-cyan-400 animate-pulse font-medium">
                  Auto-snapping is ACTIVE. Click near any station to snap line endpoints.
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Pipeline Name</label>
                <input 
                  type="text" 
                  value={pipelineName} 
                  onChange={e => setPipelineName(e.target.value)} 
                  required
                  placeholder="e.g. Ibafo Trunk A"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Code</label>
                  <input 
                    type="text" 
                    value={pipelineCode} 
                    onChange={e => setPipelineCode(e.target.value)} 
                    required
                    placeholder="e.g. PL-IBA-A"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Type</label>
                  <select 
                    value={pipelineType} 
                    onChange={e => setPipelineType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="TRUNK">Trunk line</option>
                    <option value="SPUR">Spur line</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs text-slate-400">Dia (inch)</label>
                  <input 
                    type="number" 
                    value={diameter} 
                    onChange={e => setDiameter(e.target.value)} 
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <label className="text-xs text-slate-400">Material</label>
                  <select 
                    value={material} 
                    onChange={e => setMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="STEEL">Steel</option>
                    <option value="HDPE">HDPE</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-1">
                  <label className="text-xs text-slate-400">Pres. (bar)</label>
                  <input 
                    type="number" 
                    value={pipePressure} 
                    onChange={e => setPipePressure(e.target.value)} 
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={tempPipelinePoints.length < 2}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 transition font-bold text-slate-950 text-xs uppercase"
              >
                Register Pipeline Segment
              </button>
            </form>
          )}

        </div>
        
        <div className="text-[10px] text-slate-600 mt-6 border-t border-slate-800/80 pt-4">
          Clicking registers nodes locally. Save commits to spatial backend with geometry integrity validation.
        </div>
      </div>

    </div>
  );
}
