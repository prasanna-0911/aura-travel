declare module 'leaflet' {
  export interface LatLngExpression {
    lat: number;
    lng: number;
  }
  
  export interface IconOptions {
    iconUrl: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    shadowUrl?: string;
    shadowSize?: [number, number];
  }
  
  export class Icon {
    constructor(options: IconOptions);
  }
  
  export function icon(options: IconOptions): Icon;
  
  export interface DivIconOptions {
    html?: string;
    className?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
  }
  
  export class DivIcon {
    constructor(options: DivIconOptions);
  }
  
  export function divIcon(options: DivIconOptions): DivIcon;
}

declare module 'react-leaflet' {
  import type { CSSProperties, ReactElement, ReactNode } from 'react';
  import type { DivIcon, Icon, Map } from 'leaflet';
  
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: CSSProperties;
    className?: string;
    scrollWheelZoom?: boolean;
    children?: ReactNode;
  }
  
  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }
  
  export interface MarkerProps {
    position: [number, number];
    icon?: Icon | DivIcon;
    eventHandlers?: Record<string, (...args: unknown[]) => void>;
    children?: ReactNode;
  }
  
  export interface PopupProps {
    children?: ReactNode;
  }
  
  export interface PolylineProps {
    positions: [number, number][];
    color?: string;
    weight?: number;
    opacity?: number;
    dashArray?: string;
  }
  
  export function MapContainer(props: MapContainerProps): ReactElement;
  export function TileLayer(props: TileLayerProps): ReactElement;
  export function Marker(props: MarkerProps): ReactElement;
  export function Popup(props: PopupProps): ReactElement;
  export function Polyline(props: PolylineProps): ReactElement;
  export function useMap(): Map;
}
