/**
 * Fleet-standard memory-leak regression suite (SceneryStackTemplate / QubitSketch pattern).
 *
 * Creates a disposable model object inside a function boundary, disposes it, forces
 * garbage collection via global.gc (--expose-gc in vitest.config.ts), then asserts via
 * WeakRef that the object was collected. V8 requires a function boundary (not merely
 * a block scope) so local strong references die when the helper returns.
 */

import { BooleanProperty, Property } from "scenerystack/axon";
import { describe, expect, it } from "vitest";
import { MotionMatchModel } from "../src/common/model/MotionMatchModel.js";
import { MotionSensorSource } from "../src/common/model/MotionSensorSource.js";
import { PointerPositionSource } from "../src/common/model/PointerPositionSource.js";
import { PositionSourceType } from "../src/common/model/PositionSource.js";
import { MotionDiagramNode } from "../src/common/view/MotionDiagramNode.js";
import { PlayAreaNode } from "../src/common/view/PlayAreaNode.js";
import { ScoreCardNode } from "../src/common/view/ScoreCardNode.js";
import { MotionMatchPreferencesModel } from "../src/preferences/MotionMatchPreferencesModel.js";
import { MotionSensorModel } from "../src/sensor/model/MotionSensorModel.js";
import { MotionSensorScreenSummaryContent } from "../src/sensor/view/MotionSensorScreenSummaryContent.js";
import { SimulationModel } from "../src/simulation/model/SimulationModel.js";
import { SimulationScreenSummaryContent } from "../src/simulation/view/SimulationScreenSummaryContent.js";
import { describeDisposalLeaks, forceGC } from "./helpers/memoryLeak.js";

function createAndDisposeModel(): WeakRef<object> {
  const model = new MotionMatchModel({
    sourceType: PositionSourceType.POINTER,
    source: new PointerPositionSource(),
  });
  const ref = new WeakRef<object>(model);
  model.dispose();
  return ref;
}

describe("Memory leak regression", () => {
  it("MotionMatchModel is collected after dispose", async () => {
    const ref = createAndDisposeModel();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("double dispose() does not throw", () => {
    const model = new MotionMatchModel({
      sourceType: PositionSourceType.POINTER,
      source: new PointerPositionSource(),
    });
    model.dispose();
    expect(() => model.dispose()).not.toThrow();
  });

  it("repeated create/dispose cycles leave no survivors", async () => {
    const refs: WeakRef<object>[] = [];
    for (let i = 0; i < 10; i++) {
      refs.push(createAndDisposeModel());
    }
    await forceGC(refs);
    const survivors = refs.filter((r) => r.deref() !== undefined).length;
    expect(survivors).toBe(0);
  });
});

const preferences = new MotionMatchPreferencesModel();
const pointerModel = new MotionMatchModel({
  sourceType: PositionSourceType.POINTER,
  source: new PointerPositionSource(),
});
const simulationModel = new SimulationModel(preferences);
const sensorModel = new MotionSensorModel(preferences);
const diagramVisibleProperty = new BooleanProperty(true);
const showVelocityVectorsProperty = new BooleanProperty(false);
const walkerNameProperty = new Property("Walker");
const walkerHelpProperty = new Property("Drag the walker");

describeDisposalLeaks([
  { name: "MotionSensorSource", create: () => new MotionSensorSource() },
  { name: "PointerPositionSource", create: () => new PointerPositionSource() },
  {
    name: "SimulationScreenSummaryContent",
    create: () => new SimulationScreenSummaryContent(simulationModel),
    keepAlive: () => [simulationModel],
  },
  {
    name: "MotionSensorScreenSummaryContent",
    create: () => new MotionSensorScreenSummaryContent(sensorModel),
    keepAlive: () => [sensorModel],
  },
  {
    name: "ScoreCardNode",
    create: () => new ScoreCardNode(pointerModel),
    keepAlive: () => [pointerModel],
  },
  {
    name: "MotionDiagramNode",
    create: () => new MotionDiagramNode(pointerModel, 400, diagramVisibleProperty, showVelocityVectorsProperty),
    keepAlive: () => [pointerModel, diagramVisibleProperty, showVelocityVectorsProperty],
  },
  {
    name: "PlayAreaNode",
    create: () =>
      new PlayAreaNode({
        width: 500,
        positionProperty: pointerModel.source.positionProperty,
        walkerAccessibleName: walkerNameProperty,
        walkerAccessibleHelpText: walkerHelpProperty,
      }),
    keepAlive: () => [pointerModel, walkerNameProperty, walkerHelpProperty],
  },
]);
