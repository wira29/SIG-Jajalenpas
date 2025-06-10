import { Tooltip as ComponentTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from 'flowbite-react';
import L, { Icon, latLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiHelpCircle } from "react-icons/fi";
import { MdClose, MdLayers, MdLayersClear } from 'react-icons/md';
import { CircleMarker, MapContainer, Marker, Pane, Polygon, Polyline, Tooltip, useMap, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import seedColor from 'seed-color';
import useCurrentPositionStore from '../stores/current_position_store';
import useJalanStore from '../stores/jalan_store';
import useLayersStore from '../stores/layers_store';
import useProjectStore from '../stores/project_store';
import useSelectedFeatureStore from '../stores/selected_feature_store';
import useSelectedRuasStore from '../stores/selected_ruas_store';
import useSelectedStaStore from '../stores/selected_sta_store';
import { colorFromKondisi, swapLngLat } from '../utils/helpers';
import { AutoLocateControl } from './autoLocateControl';
import BaseLayer from './baseLayer';
import ProjectDialog from './dialog/projectDialog';

// healt road icon 
const healthIcon = new Icon({
    iconUrl:
      "https://static.vecteezy.com/system/resources/previews/009/267/136/non_2x/location-icon-design-free-png.png",
    iconSize: [25, 35], // size of the icon
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location,
    tooltipAnchor: [0, -35 - 4],
  });
// end healt road icon 

// autoBound to ruas 
const AutoboundToRuas = () => {
    const map = useMap();
    const selectedRuas = useSelectedRuasStore((state) => state.selected);
    useEffect(() => {
      const coordinates = selectedRuas?.sta.reduce((acc: any[], curr: any) => {
        return [...acc, ...(curr.coordinates as any)[0]];
    }, []);
      const bounds = L.latLngBounds(swapLngLat(coordinates as any) as any);
  
      if (selectedRuas?.sta) {
        setTimeout(() => {
          map.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1,
          });
        }, 500);
      } else {
        setTimeout(() => {
            map.flyTo(latLng(-7.786, 112.8582), 11);
          }, 500);
      }
    }, [selectedRuas, map]);
    return null;
  };
// end auto bound to ruas 

// invalidate map size 
const AutoInvalidateMapSize = () => {
    const map = useMap();
  
    // resize map whenever sidebar is toggled
    const isLayerSidebar = useLayersStore((state) => state.isVisible);
    const isFeatureSidebar = useSelectedFeatureStore(
      (state) => state.selectedFeature
    );
  
    useEffect(() => {
      setTimeout(() => {
        console.log("invalidate map size");
        map.invalidateSize();
      }, 500);
    }, [map, isLayerSidebar, isFeatureSidebar]);
  
    return null;
  };
// end invalidate map size 


export default function Map() {

    // state
    const [map, setMap] = useState<any>(null); 
    const [markerClusterKey, setMarkerClusterKey] = useState(0);
    const [currentZoom, setCurrentZoom] = useState(11);
    const [projectDialog, setProjectDialog] = useState(false);
    const [project, setProject] = useState<any>(null);

    const onZoom = useCallback(() => {
        setCurrentZoom(map.getZoom());
      }, [map]);
    
      useEffect(() => {
        if (map) {
          map.on("zoom", onZoom);
        }
      }, [map, onZoom]);

    // stores 
    const {
        layers: layersInformation,
        isLayerVisible,
        isVisible : isSidebarLayerVisible,
        toggleVisibility: toggleSidebarLayerVisibility,
      } = useLayersStore();
    const { roads: dataKondisiJalan } = useJalanStore();

    const { projects, isProjectVisible } = useProjectStore();
    const { position, updatePosition } = useCurrentPositionStore();

    // end stores
    useEffect(() => {
        setMarkerClusterKey(markerClusterKey + 1);
    }, [dataKondisiJalan]);

    useEffect(() => {
        updatePosition();
      }, [updatePosition]);

    // selected state 
    const selectedRuas = useSelectedRuasStore((state) => state.selected);
    const setSelectedRuas = useSelectedRuasStore((state) => state.set);
    const selectedSta = useSelectedStaStore((state) => state.selected);
    const setSelectedSta = useSelectedStaStore((state) => state.set);
    const selectedFeature = useSelectedFeatureStore((state) => state.selectedFeature);
    const setSelectedFeature = useSelectedFeatureStore((state) => state.setSelectedFeature);
    // end selected state 

    // create marker data kondisi jalan 
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
    // end create marker data kondisi jalan

    const projectIcon = new L.DivIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 0],
        html: `<span style="${markerHtmlStyles}" />`,
    })

    const projectMarkers = useMemo(() => {
        return projects.map((project: any, index: number) => {
            const offset = 0.0001 * index;
            return <Marker eventHandlers={{ 
                    click: () => {
                        setProjectDialog(true);
                        setProject(project);
                    }
                 }} key={"project-" + project.id} position={[project.latitude! + offset, project.longtitude! + offset]} icon={projectIcon}/>
        })
    }, [projects])

    const classByType: Record<string, string> = {
        road: "w-4 h-1",
        bridge: "w-2 h-2 rounded-full",
        area: "w-4 h-4 rounded-sm",
      };

    return (
        <MapContainer 
            ref={setMap}
            center={[-7.786, 112.8582]}
            zoom={11}
            className="h-full w-full absolute bg-white"
            zoomControl={false}
            style={{ backgroundColor: "white" }}
            renderer={L.canvas({
            tolerance: 500,
            })}>
                <BaseLayer />

                {/* button legenda  */}
                <button
                    onClick={() => toggleSidebarLayerVisibility()}
                    className="float-right z-[500] relative p-4 rounded-lg bg-slate-200 text-xl text-green-900 shadow-lg border-green-900 border-2 hover:bg-slate-300 hover:text-slate-800 m-4"
                >
                    {isSidebarLayerVisible ? <MdLayersClear /> : <MdLayers />}
                </button>
                {/* end button legenda  */}

                {/* button tutup selected ruas / sta  */}
                {selectedRuas && (
                <button
                    onClick={() => {
                        setSelectedRuas(null)
                        setSelectedSta(null)
                    }}
                    className="float-right z-[500] relative p-4 rounded-lg bg-slate-200 text-xl text-green-900 shadow-lg border-green-900 border-2 hover:bg-slate-300 hover:text-slate-800 mt-4"
                    >
                        <MdClose />
                    </button>
                )}
                {/* end button tutup selected ruas / sta  */}

                {/* end menampilkan marker kondisi jalan  */}
                {/* Zoom Control and Auto Locate  */}
                <ZoomControl position="bottomright" />
                <AutoLocateControl position="bottomright" />
                {/* End Zoom Control and Auto Locate  */}

                {/* auto bound to ruas  */}
                <AutoboundToRuas />
                <AutoInvalidateMapSize />
                {/* end auto bound to ruas  */}

                <Card className="hidden md:flex absolute bottom-0 left-0 z-[500] rounded-lg bg-white text-xl text-green-900 shadow-lg  m-4">
                    <div className="flex flex-col">
                        <h6 className="text-sm py-1">Legenda</h6>
                        <TooltipProvider>
                        <ul className="">
                            {dataKondisiJalan.map((road: any) => {
                                return  (
                                    <li key={road.id} className="flex flex-row items-center">
                                        
                                        <div className="w-8 flex items-center justify-center">
                                        <svg width="100" height="4">
                                            <line
                                                x1="0"
                                                y1="2"
                                                x2="100"
                                                y2="2"
                                                stroke={road.color}
                                                strokeWidth="2"
                                                strokeDasharray={[road.dashLength , road.dash].join(",")} // 10px dash, 5px gap
                                            />
                                            </svg>
                                        </div>
                                        <div className="d-flex flex-row items-center gap-2">
                                            <span className="ms-4 me-2 flex-grow text-xs">{road.name}</span>
                                            <ComponentTooltip>
                                                <TooltipTrigger>
                                                    <FiHelpCircle className="text-sm" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{road.desc_kewenangan ?? ""}</p>
                                                </TooltipContent>
                                            </ComponentTooltip>
                                        </div>
                                    </li>
                                )
                            })}
                            {layersInformation.map((layer) => {
                                return (
                                    <li key={layer.layer.id} className="flex flex-row items-center">
                                        <div className="w-8 flex items-center justify-center">
                                            <span
                                            className={`inline-block mx-2 ${classByType[layer.layer.type]}`}
                                            style={{ backgroundColor: layer.layer.color }}
                                            ></span>
                                        </div>
                                        <span className="ms-4 flex-grow text-xs">{layer.layer.name}</span>
                                        
                                    </li>
                                )
                            })}
                            <hr className='my-3' />
                            <li className="flex flex-row items-center">
                                <div className="w-8 flex items-center justify-center">
                                    <span
                                    className="w-4 h-1"
                                    style={{ backgroundColor: "#00ff00" }}
                                    ></span>
                                </div>
                                <span className="ms-4 me-2 flex-grow text-xs">Kondisi Baik</span>
                                
                            </li>
                            <li className="flex flex-row items-center">
                                <div className="w-8 flex items-center justify-center">
                                    <span
                                    className="w-4 h-1"
                                    style={{ backgroundColor: "#ffff00" }}
                                    ></span>
                                </div>
                                <span className="ms-4 me-2 flex-grow text-xs">Kondisi Sedang</span>
                                
                            </li>
                            <li className="flex flex-row items-center">
                                <div className="w-8 flex items-center justify-center">
                                    <span
                                    className="w-4 h-1"
                                    style={{ backgroundColor: "#ff9900" }}
                                    ></span>
                                </div>
                                <span className="ms-4 me-2 flex-grow text-xs">Kondisi Rusak Ringan</span>
                                
                            </li>
                            <li className="flex flex-row items-center">
                                <div className="w-8 flex items-center justify-center">
                                    <span
                                    className="w-4 h-1"
                                    style={{ backgroundColor: "#ff0000" }}
                                    ></span>
                                </div>
                                <span className="ms-4 me-2 flex-grow text-xs">Kondisi Rusak Berat</span>
                                
                            </li>
                        </ul>
                        </TooltipProvider>
                    </div>
                </Card>

                {/* Pane  */}
                <Pane name="sta" style={{ zIndex: 504 }} />
                <Pane name="bridge" style={{ zIndex: 503 }} />
                <Pane name="road" style={{ zIndex: 502 }} />
                <Pane name="area" style={{ zIndex: 501 }} />
                {/* End Pane  */}

                {/* jika ada ruas dipilih  */}
                {selectedRuas &&
                selectedRuas.sta.map((sta:any) => {
                return (
                    <Polyline
                    key={`sta-line-${sta.id}`}
                    pane="sta"
                    positions={swapLngLat(sta.coordinates as any) as any}
                    pathOptions={{
                        color: colorFromKondisi(sta.kondisi),
                        // color: selectedFeature == road ? "red" : "black",
                        weight: selectedSta?.id == sta.id ? 10 : 3,
                    }}
                    eventHandlers={{
                        click: (e) => {
                        setSelectedSta(sta);
                        },
                    }}
                    ></Polyline>
                );
                })}

                {selectedRuas &&
                    selectedRuas.sta.map((sta:any) => {
                    const coordinates = (sta.coordinates as any)[0];
                    const lastCoordinate = coordinates[coordinates.length - 1];
                    return (
                        <Marker
                        key={`sta-marker-${sta.id}`}
                        position={[lastCoordinate[1], lastCoordinate[0]]}
                        icon={healthIcon}
                        eventHandlers={{
                            click: (e) => {
                            setSelectedSta(sta);
                            },
                        }}
                        >
                        <Tooltip direction="top" offset={[0, 0]} opacity={1} permanent>
                            {sta.sta}
                        </Tooltip>
                        </Marker>
                    );
                    })}
                {/* end jika ada ruas dipilih  */}

                {/* jika tidak ada ruas dipilih  */}
                {!selectedRuas && (
                    <>
                    {
                        dataKondisiJalan.map((jalan: any, i: number) => {

                            if (!jalan.visible) 
                                return null 


                            return Array.isArray(jalan.road) && jalan.road.map((ruas: any, idx: number) => {
                                return <Polyline
                                                key={`road-line-${idx}`}
                                                pane="road"
                                                positions={swapLngLat(ruas.coordinates as any) as any}
                                                pathOptions={{
                                                    color: jalan.color,
                                                    weight: 3 + (currentZoom - 11),
                                                    dashArray: [jalan.dashLength , jalan.dash].join(","),
                                                }}
                                                eventHandlers={{
                                                    click: (e) => {
                                                    setSelectedRuas(ruas);
                                                    },
                                                }}
                                                ></Polyline>
                            })
                        })
                    }
                    {/* menampilkan projek  */}
                    {
                        (isProjectVisible) ? (
                            <>
                            <MarkerClusterGroup>
                                {
                                    projectMarkers
                                }
                            </MarkerClusterGroup>
                            <ProjectDialog isOpen={projectDialog} setOpen={setProjectDialog} project={project}/>
                            </>
                        ) : null
                    }
                    {/* end menampilkan projek  */}
                    {/* menampilkan marker kondisi jalan  */}

                    {/* menampilkan layers  */}
                    {layersInformation.map((information, i) => {
                        if (!isLayerVisible(information.id)) return null;
                        switch (information.layer.type) {
                        case "bridge":
                            return information.layer.feature.map((feature:any, i:any) => (
                            <CircleMarker
                                key={i}
                                pane="bridge"
                                center={
                                swapLngLat(
                                    feature?.geometry[0]?.coordinates as any
                                ) as any
                                }
                                radius={2}
                                pathOptions={{
                                color: "black",
                                weight: 1,
                                fill: true,
                                fillColor: information.layer.color,
                                fillOpacity: 0.5,
                                }}
                                eventHandlers={{
                                click: () => {
                                    setSelectedFeature(feature);
                                },
                                }}
                            ></CircleMarker>
                            ));
                        case "area":
                            return information.layer.feature.map((feature:any, i:any) => (
                            <Polygon
                                key={i}
                                pane="area"
                                positions={
                                swapLngLat(
                                    feature?.geometry[0]?.coordinates as any
                                ) as any
                                }
                                pathOptions={{
                                color: information.layer.color,
                                fillColor: seedColor(feature.id.toString()).toHex(),
                                opacity: 0.5,
                                weight: information.layer.weight!,
                                fillOpacity: 0.25,
                                }}
                                eventHandlers={{
                                click: () => {
                                    setSelectedFeature(feature);
                                },
                                }}
                            ></Polygon>
                            ));
                        default:
                            return null;
                        }
                    })}
                    {/* end menampilkan layers  */}
                    </>
                )}
                {/* end jika tidak ada ruas dipilih  */}

                {/* current position  */}
                {position && (
                    <CircleMarker
                    center={[position.coords.latitude, position.coords.longitude]}
                    radius={5}
                    pathOptions={{
                        color: "blue",
                        weight: 2,
                        fill: true,
                        fillColor: "#0000FF",
                        fillOpacity: 0.7,
                        stroke: true,
                    }}
                    ></CircleMarker>
                )}
                {/* end current position   */}
                
        </MapContainer>
    )
}