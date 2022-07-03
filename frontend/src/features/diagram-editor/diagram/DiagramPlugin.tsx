import React, { useEffect, useState } from 'react';
import { usePointingContext } from '../shared/Pointing-ctx';
import { useSelectionContext } from '../../../lib/Selection-ctx';
import { DiagramRelation, DiagramText, EndDecoration, instanceOfDiagramRelation, instanceOfDiagramText, RelationShape } from './Diagram-mdl';
import { useDiagramInteractionContext } from './DiagramInteraction-ctx';
import { useDiagramRelationInteractionContext } from './elements/DiagramRelationInteraction-ctx';
import { Command, CommandProvider } from '../../../lib/commands/Command-ctx';
import { pushState, pushStateShortDebounced } from '../../../lib/git';
import { useNavigatorPersistenceContext } from '../../../lib/file-browsing/NavigatorPersistence-ctx';


export const DiagramPlugin: React.FC<{}> = ({ children }) => {
  const { pointedLocation, pointedElement } = usePointingContext();
  const { selection } = useSelectionContext();
  const { keepElements, mapElements, selectElements } = useDiagramInteractionContext();
  const { createRelation, selectRelation } = useDiagramRelationInteractionContext();
  const { currentFile } = useNavigatorPersistenceContext();

  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {

    const pointedDiagramElement = selectElements(element => element.id === pointedElement)[0];

    const isRelationEnd = !!pointedElement && !pointedDiagramElement;

    const changeRelationEndDecoration = (shortcut: string, decoration?: EndDecoration) => ({
      group: 'd{et|ft|er|fr|xx}',
      shortcut,
      title: <>d&#123;et|ft|er|fr|xx&#125;. Change decoration</>,
      isAvailable: () => isRelationEnd,
      execute: async () => {
        if (pointedElement) {
          await mapElements(
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

          pushState(currentFile, 'Change relation end decoration');
        }
      }
    });

    const changeRelationShape = (shortcut: string, shape: RelationShape) => ({
      group: 's{c|r1|r2}',
      shortcut,
      title: <>sd&#123;c|r1|r2&#125;. Change shape</>,
      isAvailable: () => pointedDiagramElement && instanceOfDiagramRelation(pointedDiagramElement),
      execute: async () => {
        if (pointedElement) {
          await mapElements(
            (element) => {
              if (element.id !== pointedElement)
                return element;

              return {
                ...element,
                shape
              };
            }
          );

          pushState(currentFile, 'Change relation shape');
        }
      }
    });

    const referredFromRelation = !!pointedElement && selectElements(element =>
      instanceOfDiagramRelation(element) && (element as DiagramRelation).ends.some(end => end.target === pointedElement)).length > 0;

    const newCommands: Command[] = [
      {
        shortcut: 'd',
        title: <>d. Delete</>,
        isAvailable: () => !!pointedDiagramElement && !referredFromRelation,
        execute: async () => {
          if (pointedElement) {
            await keepElements(
              (element) => element.id !== pointedElement
            );

            pushState(currentFile, 'Delete element');
          }
        }
      },
      {
        shortcut: 'l',
        title: <>l. Larger text</>,
        isAvailable: () => !!pointedDiagramElement && instanceOfDiagramText(pointedDiagramElement),
        execute: async () => {
          if (pointedElement) {
            await mapElements(
              (element) => {
                if (element.id !== pointedElement)
                  return element;

                const fontSize = (element as DiagramText).fontSize || 20;

                return { ...element, fontSize: fontSize + 2 };
              }
            );

            pushStateShortDebounced(currentFile, 'Larger text');
          }
        }
      },
      {
        shortcut: 's',
        title: <>s. Smaller text</>,
        isAvailable: () => !!pointedDiagramElement && instanceOfDiagramText(pointedDiagramElement),
        execute: async () => {
          if (pointedElement) await mapElements(
            (element) => {
              if (element.id !== pointedElement)
                return element;

              const fontSize = (element as DiagramText).fontSize || 20;

              return { ...element, fontSize: fontSize - 2 };
            }
          );

          pushStateShortDebounced(currentFile, 'Smaller text');
        }
      },
      {
        shortcut: 'r',
        title: <>r. Create relation</>,
        isAvailable: () => !isRelationEnd && selection.length > 1,
        execute: async () => {
          await createRelation();
          pushState(currentFile, 'Create relation');
        }
      },
      {
        shortcut: 'r',
        title: <>r. Select relation</>,
        isAvailable: () => isRelationEnd,
        execute: selectRelation
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
        execute: async () => {
          if (pointedElement) {
            await mapElements(
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

            pushState(currentFile, 'Change relation end attach point');
          }
        }
      }
    ];

    for (let i = 0; i < 12; i++) {
      newCommands.push({
        group: 'm[00-11]',
        shortcut: i < 10 ? `m0${i}` : `m${i}`,
        title: <>m[00-11]. Attach to...</>,
        isAvailable: () => isRelationEnd,
        execute: async () => {
          if (pointedElement) {
            await mapElements(
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

            pushState(currentFile, 'Change relation end attach point');
          }
        }
      });
    }

    setCommands(newCommands);

  }, [createRelation, mapElements, selectRelation, keepElements, pointedLocation, pointedElement, selection, selectElements, currentFile]);

  return <CommandProvider commands={commands}>{children}</CommandProvider>;
};
