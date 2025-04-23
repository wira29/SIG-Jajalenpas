import React from "react";
import { TileLayer } from "react-leaflet";
import useBaseLayerStore, { BaseLayerType } from "../stores/base_layer_store";

const layers: Record<BaseLayerType, React.ReactNode> = {
  esri: (
    <TileLayer url="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
  ),
  openstreetmap: (
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  ),
  stadia: (
    <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
  ),
};

export default function BaseLayer() {
  const layer = useBaseLayerStore((state) => state.baseLayer);

  if (!layer) return null;

  return layers[layer];
}
