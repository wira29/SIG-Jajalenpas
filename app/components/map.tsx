import L, { Icon, latLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MdClose, MdLayers, MdLayersClear, MdMyLocation } from 'react-icons/md';
import { CircleMarker, MapContainer, Marker, Pane, Polygon, Polyline, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import seedColor from 'seed-color';
import useCurrentPositionStore from '../stores/current_position_store';
import useJalanStore from '../stores/jalan_store';
import useLayersStore from '../stores/layers_store';
import useProjectStore from '../stores/project_store';
import useSelectedFeatureStore from '../stores/selected_feature_store';
import useSelectedRuasStore from '../stores/selected_ruas_store';
import useSelectedStaStore from '../stores/selected_sta_store';
import { swapLngLat } from '../utils/helpers';
import BaseLayer from './baseLayer';
import ProjectDialog from './dialog/projectDialog';

// health road icon 
const healthIcon = new Icon({
    iconUrl: "https://static.vecteezy.com/system/resources/previews/009/267/136/non_2x/location-icon-design-free-png.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
    tooltipAnchor: [0, -35 - 4],
});

// autoBound to ruas 
const AutoboundToRuas = () => {
    const map = useMap();
    const selectedRuas = useSelectedRuasStore((state) => state.selected);
    useEffect(() => {
      if (!selectedRuas?.sta || selectedRuas.sta.length === 0) {
        setTimeout(() => {
            map.flyTo(latLng(-7.786, 112.8582), 11);
          }, 500);
        return;
      }

      try {
        const coordinates = selectedRuas.sta.reduce((acc: any[], curr: any) => {
          const coords = curr.coordinates;
          const segment = Array.isArray(coords[0][0]) ? coords[0] : coords;
          return [...acc, ...segment];
        }, []);
        
        if (coordinates.length > 0) {
          const bounds = L.latLngBounds(swapLngLat(coordinates as any) as any);
          setTimeout(() => {
            map.flyToBounds(bounds, {
              padding: [50, 50],
              duration: 1,
            });
          }, 500);
        }
      } catch (err) {
        console.error("Autobound error:", err);
      }
    }, [selectedRuas, map]);
    return null;
};

// invalidate map size 
const AutoInvalidateMapSize = () => {
    const map = useMap();
    const isLayerSidebar = useLayersStore((state) => state.isVisible);
    const isFeatureSidebar = useSelectedFeatureStore((state) => state.selectedFeature);
  
    useEffect(() => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize();
        }, 500);
      }
    }, [map, isLayerSidebar, isFeatureSidebar]);
  
    return null;
};

export default function Map() {
    const [map, setMap] = useState<L.Map | null>(null); 
    const [currentZoom, setCurrentZoom] = useState(11);
    const [projectDialog, setProjectDialog] = useState(false);
    const [project, setProject] = useState<any>(null);

    const onZoom = useCallback(() => {
        if (map) {
          setCurrentZoom(map.getZoom());
        }
    }, [map]);
    
    useEffect(() => {
        if (map) {
          map.on("zoom", onZoom);
          return () => { map.off("zoom", onZoom); };
        }
    }, [map, onZoom]);

    const {
        layers: layersInformation,
        isLayerVisible,
        isVisible : isSidebarLayerVisible,
        toggleVisibility: toggleSidebarLayerVisibility,
    } = useLayersStore();
    const { roads: dataKondisiJalan } = useJalanStore();
    const { projects, isProjectVisible } = useProjectStore();
    const { position, updatePosition } = useCurrentPositionStore();

    useEffect(() => {
        updatePosition();
    }, [updatePosition]);

    const selectedRuas = useSelectedRuasStore((state) => state.selected);
    const setSelectedRuas = useSelectedRuasStore((state) => state.setByNoRuas);
    const selectedSta = useSelectedStaStore((state) => state.selected);
    const setSelectedSta = useSelectedStaStore((state) => state.set);
    const setSelectedFeature = useSelectedFeatureStore((state) => state.setSelectedFeature);

    const markerHtmlStyles = `
            background-color: orange;
            width: 16px;
            height: 16px;
            display: block;
            left: -8px;
            top: -8px;
            position: relative;
            border-radius: 3rem 3rem 0;  
            transform: rotate(45deg);
            border: 1px solid #FFFFFF`;

    const projectIcon = useMemo(() => new L.DivIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 0],
        html: `<span style="${markerHtmlStyles}" />`,
    }), [markerHtmlStyles]);

    const projectMarkers = useMemo(() => {
        return projects.map((project: any, index: number) => {
            if (!project.latitude || !project.longtitude) return null;
            const offset = 0.0001 * index;
            return <Marker 
                key={"project-" + project.id} 
                position={[Number(project.latitude) + offset, Number(project.longtitude) + offset]} 
                icon={projectIcon}
                eventHandlers={{ 
                    click: () => {
                        setProjectDialog(true);
                        setProject(project);
                    }
                 }} 
            />
        }).filter(Boolean);
    }, [projects, projectIcon]);

    const roadLayers = useMemo(() => {
        return dataKondisiJalan.flatMap((jalan: any) => {
            if (!jalan.visible || !Array.isArray(jalan.road)) return [];
            
            return jalan.road.map((ruas: any, idx: number) => {
                if (!ruas.coordinates || ruas.coordinates.length === 0) return null;
                return <Polyline
                    key={`road-line-${ruas.id || idx}`}
                    pane="road"
                    positions={swapLngLat(ruas.coordinates as any) as any}
                    pathOptions={{
                        color: jalan.color || "blue",
                        weight: Math.max(1, 3 + (currentZoom - 11)),
                        dashArray: [jalan.dashLength , jalan.dash].join(","),
                    }}
                    eventHandlers={{
                        click: () => {
                            setSelectedRuas(ruas.nomorRuas);
                        },
                    }}
                ></Polyline>
            }).filter(Boolean);
        });
    }, [dataKondisiJalan, currentZoom, setSelectedRuas]);

    const additionalLayers = useMemo(() => {
        return layersInformation.flatMap((information) => {
            if (!isLayerVisible(information.id) || !information.layer?.feature) return [];
            
            return information.layer.feature.map((feature:any, i:any) => {
                const geom = feature?.geometry?.[0];
                if (!geom || !geom.coordinates) return null;

                switch (information.layer.type) {
                case "bridge":
                    return (
                    <CircleMarker
                        key={`bridge-${feature.id}-${i}`}
                        pane="bridge"
                        center={swapLngLat(geom.coordinates as any) as any}
                        radius={2}
                        pathOptions={{
                            color: "black",
                            weight: 1,
                            fill: true,
                            fillColor: information.layer.color,
                            fillOpacity: 1,
                        }}
                        eventHandlers={{
                            click: () => { setSelectedFeature(feature); },
                        }}
                    ></CircleMarker>
                    );
                case "area":
                    return (
                    <Polygon
                        key={`area-${feature.id}-${i}`}
                        pane="area"
                        positions={swapLngLat(geom.coordinates as any) as any}
                        pathOptions={{
                            color: information.layer.color,
                            fillColor: seedColor(feature.id.toString()).toHex(),
                            opacity: 0.5,
                            weight: information.layer.weight || 1,
                            fillOpacity: 0.25,
                        }}
                        eventHandlers={{
                            click: () => { setSelectedFeature(feature); },
                        }}
                    ></Polygon>
                    );
                default:
                    return null;
                }
            }).filter(Boolean);
        });
    }, [layersInformation, isLayerVisible, setSelectedFeature]);

    return (
        <MapContainer 
            ref={setMap}
            center={[-7.786, 112.8582]}
            zoom={11}
            className="h-full w-full absolute bg-white"
            zoomControl={false}
            style={{ backgroundColor: "white" }}>
                <BaseLayer />

                {/* UI Control Overlay - Top Right (Shifts when sidebar open) */}
                <div 
                    className={`absolute top-4 transition-all duration-500 z-[2001] flex flex-col gap-3 ${
                        isSidebarLayerVisible 
                        ? "right-[calc(20%+1rem)] md:right-[calc(33.33%+1rem)] xl:right-[calc(25%+1rem)] 2xl:right-[calc(20%+1rem)]" 
                        : "right-4"
                    }`}
                >
                    <button
                        onClick={() => toggleSidebarLayerVisibility()}
                        className={`p-3.5 rounded-2xl shadow-2xl border-2 transition-all active:scale-95 ${
                            isSidebarLayerVisible 
                            ? "bg-green-700 border-green-800 text-white" 
                            : "bg-white/90 backdrop-blur-md border-slate-200 text-green-800 hover:bg-white"
                        }`}
                        title="Toggle Legend"
                    >
                        {isSidebarLayerVisible ? <MdLayersClear size={24} /> : <MdLayers size={24} />}
                    </button>

                    {selectedRuas && (
                        <button
                            onClick={() => {
                                setSelectedRuas(null);
                                setSelectedSta(null);
                            }}
                            className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md text-red-600 shadow-2xl border-2 border-slate-200 hover:bg-red-50 transition-all active:scale-95 animate-in zoom-in duration-300"
                            title="Tutup Detail"
                        >
                            <MdClose size={24} />
                        </button>
                    )}
                </div>

                {/* Unified Map Controls - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-[1010] flex flex-col gap-3 items-end">
                    <button
                        onClick={() => {
                            map?.locate();
                            map?.once("locationfound", (e: any) => {
                                map?.setView(e.latlng, 11);
                            });
                        }}
                        className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md text-green-700 shadow-2xl border-2 border-slate-200 hover:bg-green-50 transition-all active:scale-95"
                        title="Lokasi Saya"
                    >
                        <MdMyLocation size={24} />
                    </button>
                    
                    <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
                        <button 
                            onClick={() => map?.zoomIn()}
                            className="p-3.5 hover:bg-slate-100 text-slate-600 border-b border-slate-100 transition-colors active:bg-slate-200"
                            title="Zoom In"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button 
                            onClick={() => map?.zoomOut()}
                            className="p-3.5 hover:bg-slate-100 text-slate-600 transition-colors active:bg-slate-200"
                            title="Zoom Out"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>
                </div>

                <AutoboundToRuas />
                <AutoInvalidateMapSize />

                <Pane name="sta" style={{ zIndex: 504 }} />
                <Pane name="bridge" style={{ zIndex: 503 }} />
                <Pane name="road" style={{ zIndex: 502 }} />
                <Pane name="area" style={{ zIndex: 501 }} />

                {selectedRuas && selectedRuas.sta && selectedRuas.sta.map((sta:any) => {
                    if (!sta.coordinates || sta.coordinates.length === 0) return null;
                    const coords = Array.isArray(sta.coordinates[0][0]) ? sta.coordinates[0] : sta.coordinates;
                    const lastPoint = coords[coords.length - 1];
                    
                    return (
                        <React.Fragment key={`sta-group-${sta.id}`}>
                            <Polyline
                                pane="sta"
                                positions={swapLngLat(sta.coordinates as any) as any}
                                pathOptions={{
                                    color: "red",
                                    weight: selectedSta?.id == sta.id ? 10 : 3,
                                }}
                                eventHandlers={{
                                    click: () => { setSelectedSta(sta); },
                                }}
                            />
                            <Marker
                                position={[lastPoint[1], lastPoint[0]]}
                                icon={healthIcon}
                                eventHandlers={{
                                    click: () => { setSelectedSta(sta); },
                                }}
                            >
                                <Tooltip direction="top" offset={[0, 0]} opacity={1} permanent>
                                    {sta.sta}
                                </Tooltip>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {!selectedRuas && (
                    <>
                        {roadLayers}
                        {isProjectVisible && projects.length > 0 && (
                            <>
                                <MarkerClusterGroup>
                                    {projectMarkers}
                                </MarkerClusterGroup>
                                <ProjectDialog isOpen={projectDialog} setOpen={setProjectDialog} project={project}/>
                            </>
                        )}
                        {additionalLayers}
                    </>
                )}

                {position && (
                    <CircleMarker
                        center={[position.coords.latitude, position.coords.longitude]}
                        radius={8}
                        pathOptions={{
                            color: "white",
                            weight: 3,
                            fill: true,
                            fillColor: "#3b82f6",
                            fillOpacity: 0.8,
                            stroke: true,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                            Lokasi Anda
                        </Tooltip>
                    </CircleMarker>
                )}
        </MapContainer>
    );
}
