"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically load the Map component, ensuring it is only executed in the client browser
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] border border-slate-800 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Leaflet Map canvas...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  userToken: string;
  userRoles: string[];
  stations: any[];
  pipelines: any[];
  onStationCreated: (station: any) => void;
  onPipelineCreated: (pipeline: any) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
