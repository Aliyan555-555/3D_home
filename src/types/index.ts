
export interface MiniMapProps {
    url: string;
    setPoint:(data:number) => void;
    cursor: string;
    currentPosition: { x: number; z: number };
    scale?: number;
    offsetX?: number;
    point:number;
    offsetY?: number;
  }
 export interface MiniMapState {
    transform:string;
  }
export interface FootprintInterface {
    position: BABYLON.Vector3;
    rotation: number;
    size: number;
    point: number;
  }
  