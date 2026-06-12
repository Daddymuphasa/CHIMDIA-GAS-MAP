"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MapWrapper from '../components/MapWrapper';

export default function Home() {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  
  // GIS data states
  const [stations, setStations] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Seed sample stations if database is empty or during loading
  const seedSampleData = () => {
    const samples = [
      {
        id: '18',
        name: 'SANGO STATION',
        code: 'Station #18',
        type: 'CUSTOMER',
        status: 'ACTIVE',
        capacity_m3_h: 4500,
        pressure_rating_bar: 18.2,
        location: { type: 'Point', coordinates: [3.4150, 6.8450] },
        metadata: { meter_type: 'Ultrasonic', contracted_volume: '4.5 MMSCFD', operating_pressure: '18 bar', last_maintenance: '10 Apr 2026', inlet_pressure: '17.8 bar', flow: '3.9 MMSCFD', uptime: '99.1%' }
      },
      {
        id: '19',
        name: 'OTA DISTRIBUTION NODE',
        code: 'Station #19',
        type: 'REGULATOR',
        status: 'ACTIVE',
        capacity_m3_h: 6000,
        pressure_rating_bar: 22.0,
        location: { type: 'Point', coordinates: [3.4650, 6.8380] },
        metadata: { meter_type: 'Turbine', contracted_volume: '6.0 MMSCFD', operating_pressure: '21 bar', last_maintenance: '12 Apr 2026', inlet_pressure: '20.5 bar', flow: '5.2 MMSCFD', uptime: '99.6%' }
      },
      {
        id: '20',
        name: 'ALAGBOLE CITY GATE',
        code: 'Station #20',
        type: 'CITY_GATE',
        status: 'ACTIVE',
        capacity_m3_h: 8000,
        pressure_rating_bar: 25.0,
        location: { type: 'Point', coordinates: [3.3850, 6.8280] },
        metadata: { meter_type: 'Ultrasonic', contracted_volume: '8.0 MMSCFD', operating_pressure: '24 bar', last_maintenance: '08 Apr 2026', inlet_pressure: '23.4 bar', flow: '7.1 MMSCFD', uptime: '99.8%' }
      },
      {
        id: '21',
        name: 'OLAM NIG. LTD.',
        code: 'Station #21',
        type: 'CUSTOMER',
        status: 'ACTIVE',
        capacity_m3_h: 5000,
        pressure_rating_bar: 20.0,
        location: { type: 'Point', coordinates: [3.4402, 6.8378] },
        metadata: { meter_type: 'Ultrasonic', contracted_volume: '5.0 MMSCFD', operating_pressure: '19 bar', last_maintenance: '14 Apr 2026', inlet_pressure: '18.6 bar', flow: '4.2 MMSCFD', uptime: '99.4%' }
      },
      {
        id: '22',
        name: 'AJUWON REGULATOR',
        code: 'Station #22',
        type: 'REGULATOR',
        status: 'ACTIVE',
        capacity_m3_h: 4000,
        pressure_rating_bar: 15.0,
        location: { type: 'Point', coordinates: [3.4450, 6.8080] },
        metadata: { meter_type: 'Rotary', contracted_volume: '3.5 MMSCFD', operating_pressure: '14 bar', last_maintenance: '05 Apr 2026', inlet_pressure: '13.2 bar', flow: '3.1 MMSCFD', uptime: '98.9%' }
      },
      {
        id: '23',
        name: 'OFADA TAP-OFF',
        code: 'Station #23',
        type: 'CUSTOMER',
        status: 'ACTIVE',
        capacity_m3_h: 3000,
        pressure_rating_bar: 16.0,
        location: { type: 'Point', coordinates: [3.4550, 6.7780] },
        metadata: { meter_type: 'Ultrasonic', contracted_volume: '3.0 MMSCFD', operating_pressure: '15 bar', last_maintenance: '11 Apr 2026', inlet_pressure: '14.5 bar', flow: '2.6 MMSCFD', uptime: '99.2%' }
      }
    ];
    setStations(samples);
    setSelectedStation(samples[3]); // Default to OLAM NIG. LTD.
  };

  // Fetch GIS data when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        
        const [stationsRes, pipelinesRes] = await Promise.all([
          fetch(`${apiUrl}/gis/stations`),
          fetch(`${apiUrl}/gis/pipelines`),
        ]);

        let hasData = false;
        if (stationsRes.ok) {
          const stationsData = await stationsRes.json();
          if (stationsData && stationsData.length > 0) {
            setStations(stationsData);
            setSelectedStation(stationsData[0]);
            hasData = true;
          }
        }
        if (pipelinesRes.ok) {
          const pipelinesData = await pipelinesRes.json();
          setPipelines(pipelinesData);
        }

        if (!hasData) {
          seedSampleData();
        }
      } catch (err) {
        console.error('Error fetching GIS infrastructure layers:', err);
        seedSampleData();
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleStationCreated = (newStation: any) => {
    setStations((prev) => [...prev, newStation]);
    setSelectedStation(newStation);
  };

  const handlePipelineCreated = (newPipeline: any) => {
    setPipelines((prev) => [...prev, newPipeline]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#022c16] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-200 text-sm font-medium tracking-wide">Initializing GasGrid IAM Gateway...</p>
        </div>
      </div>
    );
  }

  // Filter stations based on search query
  const filteredStations = searchQuery 
    ? stations.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : stations;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-sans">
      
      {/* 1. LEFT SIDEBAR (NNPC Branding) */}
      <aside className="w-64 bg-[#01381d] text-white flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 flex items-center gap-3 border-b border-emerald-900/50">
            {/* Custom CSS NNPC Logo */}
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-400 rounded-tr-xl rounded-bl-xl transform -rotate-12"></div>
              <div className="absolute inset-1 bg-emerald-700 rounded-tr-lg rounded-bl-lg transform rotate-12 flex items-center justify-center">
                <span className="text-white text-[10px] font-black tracking-tighter">NNPC</span>
              </div>
            </div>
            <div>
              <h1 className="text-xs font-black leading-none text-amber-400 tracking-wider">NNPC</h1>
              <p className="text-[9px] text-slate-200 font-bold uppercase tracking-tight leading-tight">Gas Marketing Limited</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg bg-[#002a14] text-amber-400 border-l-4 border-amber-400 font-semibold transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Map
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Stations
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              IoT Monitoring
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-emerald-100 hover:bg-[#002a14]/50 hover:text-amber-400 font-medium transition duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </a>
          </nav>
        </div>

        {/* Footer Brand Label */}
        <div className="p-4 border-t border-emerald-900/50 bg-[#002713] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            GasGrid
          </div>
          <p className="text-[10px] text-emerald-200">Gas Distribution Management Platform</p>
        </div>
      </aside>

      {/* 2. MAIN SECTION (Header + Map Area) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-10 shrink-0">
          {/* Search Box */}
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search stations..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:bg-white focus:border-[#01381d] transition-all"
            />
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-4">
            {/* Active Alerts */}
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
              2 alerts
            </div>

            {/* Buttons */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload CSV
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#01381d] text-white rounded-lg text-xs font-semibold hover:bg-[#002713] transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Station
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export PDF
            </button>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-[#01381d] font-bold flex items-center justify-center text-xs shadow-xs">
                  NG
                </div>
                <button onClick={logout} className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={login} className="text-xs font-bold text-[#01381d] hover:underline">
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Area */}
        <main className="flex-1 flex overflow-hidden relative">
          {!isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-100">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center">
                <h2 className="text-2xl font-bold text-[#01381d] mb-2">NGML GasGrid</h2>
                <p className="text-slate-500 text-sm mb-6">Access the Gas Distribution Management Portal via secure IAM Gateway.</p>
                <button onClick={login} className="w-full py-2.5 bg-[#01381d] hover:bg-[#002713] text-white rounded-lg font-semibold transition shadow-sm">
                  Sign In with Keycloak
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Map Container */}
              <div className="flex-1 h-full relative z-10">
                {isFetchingData ? (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center z-30">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-150 flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-[#01381d]">Loading Spatial Layers...</span>
                    </div>
                  </div>
                ) : null}
                <MapWrapper 
                  userToken={user?.token || ''}
                  userRoles={user?.roles || []}
                  stations={filteredStations}
                  pipelines={pipelines}
                  onStationCreated={handleStationCreated}
                  onPipelineCreated={handlePipelineCreated}
                  onStationSelected={setSelectedStation}
                  selectedStation={selectedStation}
                />
              </div>

              {/* Right Station Details Sidepanel */}
              {selectedStation && (
                <aside className="w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg z-25 overflow-y-auto">
                  {/* Panel Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      {/* Green circle with flame icon */}
                      <div className="w-10 h-10 rounded-full bg-[#01381d] flex items-center justify-center text-white shrink-0">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.317.766-.699 1.719-1.01 2.593a40.39 40.39 0 00-1.01-2.593c-.167-.403-.356-.785-.57-1.116-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.247.37-.417.847-.468 1.397-.05.549.03 1.19.23 1.874.402 1.37 1.203 2.923 2.115 4.148-.716.148-1.417.472-2.007.973-.59.5-1.002 1.168-1.193 1.944-.191.776-.118 1.63.228 2.404a5.976 5.976 0 002.13 2.422c.98.665 2.155 1.022 3.36 1.022s2.38-.357 3.36-1.022a5.976 5.976 0 002.13-2.422c.346-.774.419-1.628.228-2.404a5.978 5.978 0 00-1.193-1.944c-.59-.5-1.291-.825-2.007-.973.912-1.225 1.713-2.778 2.115-4.148.2-.684.28-1.325.23-1.874-.051-.55-.22-1.027-.468-1.397zM10 18a4 4 0 01-4-4c0-1.453.766-2.576 1.716-3.238A6.035 6.035 0 0010 12c.94 0 1.782-.24 2.284-.476C13.234 11.424 14 12.547 14 14a4 4 0 01-4 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 leading-tight">{selectedStation.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{selectedStation.code}</span>
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            {selectedStation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedStation(null)}
                      className="text-slate-400 hover:text-slate-600 transition p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Panel Body */}
                  <div className="flex-1 p-4 space-y-5">
                    
                    {/* Information Table */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Coordinates
                        </span>
                        <span className="font-medium text-slate-800">
                          {selectedStation.location?.coordinates ? `${selectedStation.location.coordinates[1].toFixed(5)} N ${selectedStation.location.coordinates[0].toFixed(5)} E` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          Meter type
                        </span>
                        <span className="font-medium text-slate-800">{selectedStation.metadata?.meter_type || 'Ultrasonic'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" /></svg>
                          Contracted volume
                        </span>
                        <span className="font-medium text-slate-800">{selectedStation.metadata?.contracted_volume || '5.0 MMSCFD'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Operating pressure
                        </span>
                        <span className="font-medium text-slate-800">{selectedStation.metadata?.operating_pressure || `${selectedStation.pressure_rating_bar} bar`}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                          Last maintenance
                        </span>
                        <span className="font-medium text-slate-800">{selectedStation.metadata?.last_maintenance || '14 Apr 2026'}</span>
                      </div>
                    </div>

                    {/* Sparkline / Line Chart Placeholder */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Flow (MMSCFD)</span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Live
                        </span>
                      </div>
                      {/* SVG line chart */}
                      <div className="h-24 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path 
                            d="M 0 15 Q 15 12 25 18 T 50 10 T 75 14 T 100 16" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="1.5" 
                            strokeLinecap="round"
                          />
                          {/* Dot at the end */}
                          <circle cx="100" cy="16" r="2.5" fill="#10b981" />
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-400 mt-1">
                          <span>00:00</span>
                          <span>08:00</span>
                          <span>16:00</span>
                          <span>24:00</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Summary Cards Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-semibold uppercase leading-tight">Inlet Pressure</span>
                        <div className="my-1 text-sm font-black text-slate-800">
                          {selectedStation.metadata?.inlet_pressure || '18.6 bar'}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Normal
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-semibold uppercase leading-tight">Flow Rate</span>
                        <div className="my-1 text-sm font-black text-slate-800">
                          {selectedStation.metadata?.flow || '4.2 MMSCFD'}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Normal
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-semibold uppercase leading-tight">Uptime</span>
                        <div className="my-1 text-sm font-black text-slate-800">
                          {selectedStation.metadata?.uptime || '99.4%'}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Panel Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <a href="#" className="flex items-center justify-between text-xs font-bold text-[#01381d] hover:text-[#002713] transition group">
                      View full station details
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </a>
                  </div>
                </aside>
              )}
            </>
          )}
        </main>

      </div>

    </div>
  );
}
