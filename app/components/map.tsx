
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import seedColor from 'seed-color';
import useJalanStore from '../stores/jalan_store';
// import 'react-leaflet-markercluster/styles';

export const Map = () => {

    const { roads: dataKondisiJalan } = useJalanStore();

    const icons = useMemo(() => {
        const result: Record<number, L.DivIcon> = {};

        for (let jalan of dataKondisiJalan) {
        console.log(jalan);  
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

    return <MapContainer 
            className="markercluster-map w-100 h-100" 
            style={{ height: '100vh' }} 
            center={[-7.650123, 112.812345]}
            zoom={12}
            maxZoom={18}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
                {/* menampilkan marker kondisi jalan  */}
                <MarkerClusterGroup>
                    {
                        dataKondisiJalan.map((jalan: any) => {
                            const ruas = jalan.road.ruas;

                            return ruas.map((rua: any, idx: number) => {
                                return <Marker key={idx} position={[rua.latitude, rua.longitude]} icon={icons[jalan.road.id]} />;
                            });
                        })
                    }
                </MarkerClusterGroup>
                {/* end menampilkan marker kondisi jalan  */}
            </MapContainer>;
}