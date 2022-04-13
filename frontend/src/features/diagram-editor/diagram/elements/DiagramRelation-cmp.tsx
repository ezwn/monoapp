import classNames from 'classnames';
import React from 'react';
import { usePointingContext } from '../../shared/Pointing-ctx';
import { Diagram, DiagramElement, DiagramRect, DiagramRelation, DiagramRelationEnd } from '../Diagram-mdl';
import { useDiagramInteractionContext } from '../DiagramInteraction-ctx';

import './DiagramRelation-cmp.css';

import emptyTriangleImg from './EmptyTriangle.svg';
import fullTriangleImg from './FullTriangle.svg';
import emptyRectangleImg from './EmptyRectangle.svg';
import fullRectangleImg from './FullRectangle.svg';

const decorations = {
  EMPTY_TRIANGLE: {
    width: 32,
    height: 32,
    image: emptyTriangleImg
  },
  FULL_TRIANGLE: {
    width: 32,
    height: 32,
    image: fullTriangleImg
  },
  EMPTY_RECTANGLE: {
    width: 32,
    height: 32,
    image: emptyRectangleImg
  },
  FULL_RECTANGLE: {
    width: 32,
    height: 32,
    image: fullRectangleImg
  }
};

const getAttachPoint = (diagram: Diagram, end: DiagramRelationEnd) => {
  const { target, attachPointNumber } = end;

  const element = diagram.elements["notes"]
    .find(element => element.id === target);

  if (!element) {
    throw new Error(`Rect not found for id=${target}`);
  }

  const rect = element as DiagramRect;

  const bounds = rect.bounds!;

  const [x, y, w, h] = bounds;

  switch (attachPointNumber) {
    case 0:
      return [x + w * 2 / 4, y];
    case 1:
      return [x + w * 3 / 4, y];
    case 2:
      return [x + w, y + h * 1 / 4];
    case 3:
      return [x + w, y + h * 2 / 4];
    case 4:
      return [x + w, y + h * 3 / 4];
    case 5:
      return [x + w * 3 / 4, y + h];
    case 6:
      return [x + w * 2 / 4, y + h];
    case 7:
      return [x + w * 1 / 4, y + h];
    case 8:
      return [x, y + h * 3 / 4];
    case 9:
      return [x, y + h * 2 / 4];
    case 10:
      return [x, y + h * 1 / 4];
    case 11:
      return [x + w * 1 / 4, y];
    default:
      return [x + w / 2, y + h / 2];
  }
}

const calculateCenter = (relation: DiagramRelation, diagram: Diagram): number[] => {
  const { ends } = relation;

  const attachPoints = ends.map(end => getAttachPoint(diagram, end));

  switch (relation.shape) {
    case "RIGHT_ANGLE_1":
      return [attachPoints[0][0], attachPoints[1][1]];
    case "RIGHT_ANGLE_2":
      return [attachPoints[1][0], attachPoints[0][1]];
    case "CENTROID":
    default:
      const sum = attachPoints.reduce(([xSum, ySum], [x, y]) => ([xSum + x, ySum + y]), [0, 0]);
      return [sum[0] / attachPoints.length, sum[1] / attachPoints.length];
  }
}

export const DiagramRelationCmp: React.FC<DiagramElement> = (props) => {
  const { diagram } = useDiagramInteractionContext();
  const { pointedElement } = usePointingContext();

  if (!diagram)
    return <></>;

  const relation = props as DiagramRelation;
  const { id, ends } = relation;

  const center = calculateCenter(relation, diagram);

  return (
    <g className={classNames({ relation: true, pointed: id === pointedElement })}>
      {ends.map((end, i) => <DiagramRelationLineCmp key={i} end={end} center={center} />)}
    </g>
  );
};

const getRotation = (aX: number, aY: number, bX: number, bY: number): number => {
  const rad = Math.atan2(0, -1) - Math.atan2(bX - aX, bY - aY);
  return rad / Math.PI * 180.0;
}

const getLength = (aX: number, aY: number, bX: number, bY: number): number => {
  return Math.sqrt(Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2));
}

export const DiagramRelationLineCmp: React.FC<{ end: DiagramRelationEnd, center: number[] }> = ({ center, end }) => {
  const { diagram } = useDiagramInteractionContext();
  const { setPointedElement, pointedElement } = usePointingContext();

  if (!diagram)
    return <></>;

  const { id } = end;

  const onMouseEnter = () => {
    setPointedElement(id);
  };

  const onMouseLeave = () => {
    setPointedElement(null);
  };

  const attachPoint = getAttachPoint(diagram, end);
  const decoration = end.decoration ? decorations[end.decoration] : undefined;

  const rotation = getRotation(center[0], center[1], attachPoint[0], attachPoint[1])
  const length = getLength(center[0], center[1], attachPoint[0], attachPoint[1]);

  return (
    <g transform={`translate(${center[0]} ${center[1]}) rotate(${rotation})`}>
      <line
        strokeLinecap="round"
        className={classNames({ "relation-end": true, pointed: id === pointedElement })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        x1={0}
        y1={0}
        x2={0}
        y2={-length - 4 + (decoration ? decoration.height : 0)}
      />
      {decoration && <image x={-decoration.width / 2} y={-length} width={decoration.width} height={decoration.height} href={decoration.image} />}
    </g>
  );
};
