'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// @ts-expect-error: needed to override Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

type MapViewProps = {
  center?: [number, number]
  zoom?: number
}

export default function MapView({ center = [-6.2, 106.8], zoom = 13 }: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-64 w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>
          Lokasi Parkir Terkini
        </Popup>
      </Marker>
    </MapContainer>
  )
}
