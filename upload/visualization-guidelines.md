# Visualization Guidelines

## 1. Preferred Chart Types

Time series, timelines, network/relationship graphs, capability matrices, heatmaps, slope charts, lifecycle diagrams, ecosystem maps, product graphs, channel maps. Sankey diagrams are reserved for genuine flow data (e.g., actual funnel conversion volumes) — never used decoratively.

## 2. Mandatory Metadata on Every Visualization

Every chart/table/diagram must expose: `entity, perimeter, metric, definition, unit, period, source, confidence`. A visualization missing any of these is not publishable.

## 3. Comparability in Visuals

Never plot two entities on the same axis when their underlying metric definitions, accounting bases, or perimeters differ materially (see `comparability-methodology.md`). When comparability is only partial, the visualization must carry a visible "not directly comparable" annotation rather than a silent implied ranking.

## 4. Textual Equivalents

Every data visualization must have a textual equivalent (a table or descriptive paragraph conveying the same information) to satisfy accessibility requirements and to allow the underlying claim to be independently checked without relying on the chart's rendering.
