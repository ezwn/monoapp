import React, { useEffect, useState } from 'react';
import { useDiagramUIContext } from '../shared/DiagramUI-ctx';
import { usePointingContext } from '../shared/Pointing-ctx';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { DiagramRect, DiagramRelation, DiagramText, EndDecoration, instanceOfDiagramRelation, instanceOfDiagramText, RelationShape } from './Diagram-mdl';
import { useDiagramInteractionContext } from './DiagramInteraction-ctx';
import { useDiagramRelationInteractionContext } from './elements/DiagramRelationInteraction-ctx';
import { Command, CommandProvider } from '../shared/commands/Command-ctx';


export const DiagramPlugin: React.FC<{}> = ({ children }) => {
  const { pointedLocation, pointedElement } = usePointingContext();
  const { selection } = useSelectionContext();
  const { mode, setHasDragged } = useDiagramUIContext();
  const { keepElements, mapElements, selectElements } = useDiagramInteractionContext();
  const { createRelation, selectRelation } = useDiagramRelationInteractionContext();

  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {

    const pointedDiagramElement = selectElements(element => element.id === pointedElement)[0];

    const isRelationEnd = !!pointedElement && !pointedDiagramElement;

    const changeRelationEndDecoration = (shortcut: string, decoration?: EndDecoration) => ({
      group: 'd[et|ft|er|fr|xx]',
      shortcut,
      title: <>d[et|ft|er|fr]. Change decoration</>,
      isAvailable: () => isRelationEnd,
      execute: () => {
        if (pointedElement) {
          mapElements(
            (element) => {
              if (!instanceOfDiagramRelation(element))
                return element;

              const relation = element as DiagramRelation;

              return {
                ...relation, ends: relation.ends.map(
                  end => end.id === pointedElement ? {
                    ...end,
                    decoration
                  } : end
                )
              };
            }
          );
        }
      }
    });


    const changeRelationShape = (shortcut: string, shape: RelationShape) => ({
      group: 's[c|r1|r2]',
      shortcut,
      title: <>s[c|r1|r2]. Change shape</>,
      isAvailable: () => pointedDiagramElement && instanceOfDiagramRelation(pointedDiagramElement),
      execute: () => {
        if (pointedElement) {
          mapElements(
            (element) => {
              if (element.id !== pointedElement)
                return element;

              return {
                ...element,
                shape
              };
            }
          );
        }
      }
    });

    const newCommands: Command[] = [
      {
        shortcut: 'd',
        title: <>d. Delete</>,
        isAvailable: () => !!pointedDiagramElement,
        execute: () => {
          if (pointedElement) {
            keepElements(
              (element) => element.id !== pointedElement
            );
          }
        }
      },
      {
        shortcut: 'l',
        title: <>l. Larger text</>,
        isAvailable: () => !!pointedDiagramElement && instanceOfDiagramText(pointedDiagramElement),
        execute: () => {
          if (pointedElement) {
            mapElements(
              (element) => {
                if (element.id !== pointedElement)
                  return element;

                const fontSize = (element as DiagramText).fontSize || 20;

                return { ...element, fontSize: fontSize + 2 };
              }

            );
          }
        }
      },
      {
        shortcut: 's',
        title: <>s. Smaller text</>,
        isAvailable: () => !!pointedDiagramElement && instanceOfDiagramText(pointedDiagramElement),
        execute: () => {
          if (pointedElement) mapElements(
            (element) => {
              if (element.id !== pointedElement)
                return element;

              const fontSize = (element as DiagramText).fontSize || 20;

              return { ...element, fontSize: fontSize - 2 };
            }
          );
        }
      },
      {
        shortcut: 'r',
        title: <>r. Create relation</>,
        isAvailable: () => !isRelationEnd && selection.length > 1,
        execute: () => {
          createRelation();
        }
      },
      {
        shortcut: 'r',
        title: <>r. Select relation</>,
        isAvailable: () => isRelationEnd,
        execute: () => {
          selectRelation();
        }
      },
      changeRelationShape('sc', 'CENTROID'),
      changeRelationShape('sr1', 'RIGHT_ANGLE_1'),
      changeRelationShape('sr2', 'RIGHT_ANGLE_2'),
      changeRelationEndDecoration('det', 'EMPTY_TRIANGLE'),
      changeRelationEndDecoration('dft', 'FULL_TRIANGLE'),
      changeRelationEndDecoration('der', 'EMPTY_RECTANGLE'),
      changeRelationEndDecoration('dfr', 'FULL_RECTANGLE'),
      changeRelationEndDecoration('dxx', undefined),
      {
        shortcut: 'm99',
        title: <>m99. Attach to center</>,
        isAvailable: () => isRelationEnd,
        execute: () => {
          if (pointedElement) {
            mapElements(
              (element) => {
                if (!instanceOfDiagramRelation(element))
                  return element;

                const relation = element as DiagramRelation;

                return {
                  ...relation, ends: relation.ends.map(
                    end => end.id === pointedElement ? {
                      ...end,
                      attachPointNumber: 99
                    } : end
                  )
                };
              }
            );
          }
        }
      }
    ];

    for (let i = 0; i < 12; i++) {
      newCommands.push({
        group: 'm00-12',
        shortcut: i < 10 ? `m0${i}` : `m${i}`,
        title: <>m00-12. Attach to...</>,
        isAvailable: () => isRelationEnd,
        execute: () => {
          if (pointedElement) {
            mapElements(
              (element) => {
                if (!instanceOfDiagramRelation(element))
                  return element;

                const relation = element as DiagramRelation;

                return {
                  ...relation, ends: relation.ends.map(
                    end => end.id === pointedElement ? {
                      ...end,
                      attachPointNumber: i
                    } : end
                  )
                };
              }
            );
          }
        }
      });
    }

    setCommands(newCommands);

  }, [createRelation, mapElements, selectRelation, keepElements, pointedLocation, pointedElement, selection, selectElements]);

  // TODO: react to event instead of trying to detect it here.
  useEffect(() => {
    const [, , dX, dY] = pointedLocation;

    if (mode === "DRAG" && (dX !== 0 || dY !== 0) && selection.length > 0) {

      let onWasDragged = false;
      mapElements((element) => {
        if (selection.includes(element.id)) {
          onWasDragged = true;

          const rect = element as DiagramRect;
          const [left, top, width] = rect.userBounds;

          return {
            ...element,
            userBounds: [left + dX, top + dY, width]
          };
        }

        return element;
      });

      if (onWasDragged && (Math.abs(dX) > 2 || Math.abs(dY) > 2))
        setHasDragged(true);
    }
  }, [mode, selection, pointedLocation]);

  return <CommandProvider commands={commands}>{children}</CommandProvider>;
};
