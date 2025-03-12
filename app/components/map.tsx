import L, { Icon, latLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { MdClose, MdLayers, MdLayersClear } from 'react-icons/md';
import { CircleMarker, MapContainer, Marker, Pane, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import seedColor from 'seed-color';
import useJalanStore, { JalanInformation } from '../stores/jalan_store';
import useLayersStore from '../stores/layers_store';
import useSelectedFeatureStore from '../stores/selected_feature_store';
import useSelectedRuasStore from '../stores/selected_ruas_store';
import useSelectedStaStore from '../stores/selected_sta_store';
import { colorFromKondisi, swapLngLat } from '../utils/helpers';
import { AutoLocateControl } from './autoLocateControl';
import FeaturePropertyDetailPopup from './feature/featurePropertyPopup';


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
    const [markerClusterKey, setMarkerClusterKey] = useState(0);

    // stores 
    const {
        layers: layersInformation,
        isLayerVisible,
        isVisible : isSidebarLayerVisible,
        toggleVisibility: toggleSidebarLayerVisibility,
      } = useLayersStore();
    const { roads: dataKondisiJalan } = useJalanStore();

    // end stores
    useEffect(() => {
        setMarkerClusterKey(markerClusterKey + 1);
    }, [dataKondisiJalan]);

    // selected state 
    const selectedRuas = useSelectedRuasStore((state) => state.selected);
    const setSelectedRuas = useSelectedRuasStore((state) => state.set);
    const selectedSta = useSelectedStaStore((state) => state.selected);
    const setSelectedSta = useSelectedStaStore((state) => state.set);
    const selectedFeature = useSelectedFeatureStore((state) => state.selectedFeature);
    const setSelectedFeature = useSelectedFeatureStore((state) => state.setSelectedFeature);
    // end selected state 

    // create marker data kondisi jalan 
    const icons = useMemo(() => {
        const result: Record<number, L.DivIcon> = {};

        for (let jalan of dataKondisiJalan) {
        const color = seedColor(jalan.road.id.toString()).toHex();
        const markerHtmlStyles = `
            background-color: ${color};
            width: 16px;
            height: 16px;
            display: block;
            left: -8px;
            top: -8px;
            position: relative;
            border-radius: 3rem 3rem 0;
            transform: rotate(45deg);
            border: 1px solid #FFFFFF`;

        const icon = new L.DivIcon({
            className: "my-custom-pin",
            iconAnchor: [-8, 0],
            html: `<span style="${markerHtmlStyles}" />`,
        });

        result[jalan.road.id] = icon;
        }
        return result;
    }, [dataKondisiJalan]);
    // end create marker data kondisi jalan

    return (
        <MapContainer
            center={[-7.786, 112.8582]}
            zoom={11}
            className="h-full w-full absolute bg-white"
            zoomControl={false}
            style={{ backgroundColor: "white" }}
            renderer={L.canvas({
            tolerance: 500,
            })}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

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
                    onClick={() => setSelectedRuas(null)}
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
                    {/* menampilkan marker kondisi jalan  */}
                    <MarkerClusterGroup key={markerClusterKey}>
                        {
                            
                            dataKondisiJalan.map((jalan: JalanInformation) => {
                                const ruas = jalan.road.ruas;

                                if (!jalan.visible) return null;

                                return ruas.map((ruas: any, idx: number) => {
                                    return <Marker key={"ruas-" + ruas.nomorRuas} position={[ruas.latitude, ruas.longitude]} icon={icons[jalan.road.id]} eventHandlers={{ 
                                        click: () => {
                                            setSelectedRuas(ruas);
                                        }
                                     }} />;
                                });
                            })
                        }
                    </MarkerClusterGroup>

                    {/* menampilkan layers  */}
                    {layersInformation.map((information, i) => {
                        if (!isLayerVisible(information.id)) return null;
                        switch (information.layer.type) {
                        case "road":
                            return information.layer.feature.map((feature:any, i:any) => (
                            <Polyline
                                key={i}
                                pane="road"
                                positions={
                                    // [112.861319, -7.657763] as any
                                swapLngLat(
                                    feature?.geometry[0]?.coordinates as any
                                ) as any
                                }
                                pathOptions={{
                                color: information.layer.color ? information.layer.color : "black",
                                weight:
                                    selectedFeature?.id == feature.id
                                    ? information.layer.weight! + 2
                                    : information.layer.weight!,
                                dashArray: information.layer.dashed ? [7, 7] : [],
                                dashOffset: information.layer.dashed ? "10" : "15",
                                }}
                            >
                                <Popup>
                                <FeaturePropertyDetailPopup
                                    feature={feature}
                                    onDetail={() => {
                                    setSelectedFeature(feature);
                                    }}
                                />
                                </Popup>
                            </Polyline>
                            ));
                        case "bridge":
                            return information.layer.feature.map((feature:any, i:any) => (
                            <CircleMarker
                                key={i}
                                pane="bridge"
                                center={
                                    // [112.861319, -7.657763] as any
                                swapLngLat(
                                    feature?.geometry[0]?.coordinates as any
                                ) as any
                                }
                                radius={2}
                                // radius={
                                // selectedFeature?.id == feature.id
                                //     ? information.layer.radius! + 2
                                //     : information.layer.radius!
                                // }
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
                                // color: seedColor(feature.properties[0]).toHex(),
                                color: information.layer.color,
                                fillColor: seedColor(feature.id.toString()).toHex(),
                                // opacity: selectedFeature?.id == feature.id ? 1 : 0.5,
                                opacity: 0.5,
                                weight: information.layer.weight!,
                                // fillOpacity: selectedFeature?.id == feature.id ? 1 : 0.25,
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
        </MapContainer>
    )
}