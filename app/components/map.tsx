
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import data from '../data/marker-data.json';
// import 'react-leaflet-markercluster/styles';

export const Map = () => {

    return <MapContainer className="markercluster-map w-100 h-100" style={{ height: '100vh' }} center={[-7.650123, 112.812345]}
    zoom={12}
    maxZoom={18}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <MarkerClusterGroup>
                {data.map((marker, idx) => {
                    return <Marker key={idx} position={[marker.lat, marker.lng]} />;
                })}
                {/* <Marker position={[-7.650123, 112.812345]} />
                <Marker position={[-7.623456, 112.845678]} />
                <Marker position={[-7.687890, 112.754321]} />
                <Marker position={[-7.612345, 112.834567]} />
                <Marker position={[-7.699012, 112.800000]} />
                <Marker position={[-7.745678, 112.866667]} />
                <Marker position={[-7.701234, 112.812345]} />
                <Marker position={[-7.689876, 112.789012]} />
                <Marker position={[-7.645678, 112.834567]} />
                <Marker position={[-7.687012, 112.799999]} /> */}
            </MarkerClusterGroup>
            </MapContainer>;
}