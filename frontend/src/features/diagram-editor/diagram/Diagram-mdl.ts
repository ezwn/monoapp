export interface Diagram {
  title: string;
  elements: ElementMap;
}

export type ElementMap = { [key: string]: DiagramElement[] };

export interface DiagramElement {
  id: string;
}

export interface DiagramRect extends DiagramElement {
  userBounds: number[];
  bounds?: number[];
}

export interface DiagramText extends DiagramElement {
  content: string;
  fontSize?: number;
}

export function instanceOfDiagramText(object: any): object is DiagramText {
  return 'content' in object;
}

export type EndDecoration = 'EMPTY_TRIANGLE' | 'FULL_TRIANGLE' | 'EMPTY_RECTANGLE' | 'FULL_RECTANGLE';

export interface DiagramRelationEnd extends DiagramElement {
  target: string;
  attachPointNumber?: number;
  decoration?: EndDecoration;
}

export function instanceOfRelationEnd(object: any): object is DiagramRelationEnd {
  return 'attachPointNumber' in object;
}


export type RelationShape = 'CENTROID' | 'RIGHT_ANGLE_1' | 'RIGHT_ANGLE_2';

export interface DiagramRelation extends DiagramElement {
  shape: RelationShape;
  ends: DiagramRelationEnd[];
}

export function instanceOfDiagramRelation(object: any): object is DiagramRelation {
  return 'ends' in object;
}

