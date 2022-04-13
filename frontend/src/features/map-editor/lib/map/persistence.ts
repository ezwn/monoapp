// model

export type MapPoint = number[];

export interface Peak {
    radius: number;
    centralElevation: number;
    peripheralElevation: number;
}

export interface MapElement {
    type: string;
    title: string;
    point: MapPoint;
    peak?: Peak;
}

export interface Map {
    elements: MapElement[];
}

// tools

export interface MapArea {
    leftTopPoint: number[];
    rightBottomPoint: number[];
}
