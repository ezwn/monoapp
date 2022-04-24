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

export interface NumberRange {
    min: number,
    max: number
}

export interface MapGenerator {
    imagePath: string;
    size: { width: number, height: number };
    count: number;
    scale: NumberRange;
    rotation: NumberRange;
}

export interface Map {
    elements: MapElement[];
    generators?: MapGenerator[];
}

// tools

export interface MapArea {
    leftTopPoint: number[];
    rightBottomPoint: number[];
}
