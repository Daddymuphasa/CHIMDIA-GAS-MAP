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

        if (stationsRes.ok) {
          const stationsData = await stationsRes.json();
          setStations(stationsData);
        }
        if (pipelinesRes.ok) {
          const pipelinesData = await pipelinesRes.json();
          setPipelines(pipelinesData);
        }
      } catch (err) {
        console.error('Error fetching GIS infrastructure layers:', err);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleStationCreated = (newStation: any) => {
    setStations((prev) => [...prev, newStation]);
  };

  const handlePipelineCreated = (newPipeline: any) => {
    setPipelines((prev) => [...prev, newPipeline]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Initializing GasGrid IAM Gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white selection:bg-cyan-500 selection:text-slate-900">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            GG
          </div>
          <span className="font-semibold text-lg tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            GASGRID PLATFORM
          </span>
        </div>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">{user.username}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button 
              onClick={logout} 
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition duration-200 border border-slate-700/50"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-6 max-w-7xl w-full mx-auto justify-center">
        {!isAuthenticated ? (
          <div className="self-center w-full max-w-xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden my-12">
            
            {/* Subtle Ambient Light Gradients */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
                NGML GasGrid Portal
              </h1>
              
              <p className="text-slate-400 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
                Secure enterprise management system for gas distribution, real-time IoT monitoring, and GIS spatial layers.
              </p>

              <button
                onClick={login}
                className="w-full py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] transition duration-250 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-slate-950"
              >
                Enter Identity Gateway
              </button>
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Secured by Keycloak OIDC Provider
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 my-6">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
                  Ibafo City Gate Network GIS Canvas
                </h1>
                <p className="text-slate-400 text-sm">
                  Operational console for spatial asset registries, network segments, and mapping validation.
                </p>
              </div>

              {/* Roles Badge List */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Access Groups:</span>
                {user?.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span key={role} className="bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded text-cyan-400 text-[10px]">
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">none</span>
                )}
              </div>
            </div>

            {/* Map Canvas wrapper */}
            {isFetchingData ? (
              <div className="w-full h-[600px] border border-slate-800 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold uppercase tracking-wider">Fetching spatial network layers...</p>
                </div>
              </div>
            ) : (
              <MapWrapper 
                userToken={user?.token || ''}
                userRoles={user?.roles || []}
                stations={stations}
                pipelines={pipelines}
                onStationCreated={handleStationCreated}
                onPipelineCreated={handlePipelineCreated}
              />
            )}

          </div>
        )}
      </main>

      {/* Footer System Notices */}
      <footer className="border-t border-slate-800/40 bg-slate-950/20 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} Nigerian Gas Marketing Limited (NGML). All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Ibafo Network Node
          </span>
          <span>Version 1.0.0 (Phase 4 Build)</span>
        </div>
      </footer>

    </div>
  );
}
