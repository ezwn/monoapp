# diagram module

## Component tree

Diagram > DiagramPersistenceProvider > DiagramInteractionProvider > ContextualizedDiagram

## Components

* DiagramPersistence-ctx: handles loading/saving of raw date representing a single diagram.

* DiagramInteraction-ctx: handles ui component interaction with a single diagram.

* Diagram-cmp: displays a diagram and enables to interact with it through DiagramInteraction-ctx.
