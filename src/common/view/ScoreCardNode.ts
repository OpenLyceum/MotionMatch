/**
 * ScoreCardNode.ts
 *
 * A live score during a run that gains a strong outline when the result becomes
 * final. It lives apart from the controls so it reads as an outcome.
 */

import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { Node, Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { StringManager } from "../../i18n/StringManager.js";
import MotionMatchColors from "../../MotionMatchColors.js";
import { MotionMatchPanel } from "../MotionMatchPanel.js";
import type { MotionMatchModel } from "../model/MotionMatchModel.js";
import { PositionSourceType } from "../model/PositionSource.js";
import { RunState } from "../model/RunState.js";

const SCORE_CARD_WIDTH = 230;
const SCORE_FONT = new PhetFont({ size: 34, weight: "bold" });

export class ScoreCardNode extends Node {
  private readonly disposeScoreCardNode: () => void;

  public constructor(model: MotionMatchModel) {
    const strings = StringManager.getInstance();
    const scoreNumberProperty = new DerivedProperty([model.scoreProperty], (score) => score ?? 0);
    const scoreStringProperty = new PatternStringProperty(strings.getRunStrings().scorePatternStringProperty, {
      score: scoreNumberProperty,
    });
    const letterProperty = new DerivedProperty([model.profileProperty], (profile) => profile.letter);
    const scoredPatternProperty =
      model.sourceType === PositionSourceType.MOTION_SENSOR
        ? strings.getMotionSensorA11yStrings().currentDetails.scoredStringProperty
        : strings.getSimulationA11yStrings().currentDetails.scoredStringProperty;
    const finalAnnouncementProperty = new PatternStringProperty(scoredPatternProperty, {
      letter: letterProperty,
      score: scoreNumberProperty,
    });
    const liveVisibleProperty = new DerivedProperty([model.runStateProperty], (state) => state === RunState.RECORDING);
    const finalVisibleProperty = new DerivedProperty([model.runStateProperty], (state) => state === RunState.SCORED);

    const createContent = () =>
      new VBox({
        align: "center",
        preferredWidth: SCORE_CARD_WIDTH,
        children: [
          new Text(scoreStringProperty, {
            font: SCORE_FONT,
            fill: MotionMatchColors.accentColorProperty,
            maxWidth: SCORE_CARD_WIDTH - 32,
          }),
        ],
      });

    const livePanel = new MotionMatchPanel(createContent(), {
      visibleProperty: liveVisibleProperty,
      xMargin: 16,
      yMargin: 16,
    });
    const finalPanel = new MotionMatchPanel(createContent(), {
      visibleProperty: finalVisibleProperty,
      stroke: MotionMatchColors.accentColorProperty,
      lineWidth: 4,
      xMargin: 16,
      yMargin: 16,
    });

    super({ children: [livePanel, finalPanel] });

    const announceFinalScore = (state: string) => {
      if (state === RunState.SCORED) {
        this.addAccessibleResponse(finalAnnouncementProperty.value);
      }
    };
    model.runStateProperty.lazyLink(announceFinalScore);

    this.disposeScoreCardNode = () => {
      model.runStateProperty.unlink(announceFinalScore);
      scoreStringProperty.dispose();
      finalAnnouncementProperty.dispose();
      letterProperty.dispose();
      scoreNumberProperty.dispose();
      liveVisibleProperty.dispose();
      finalVisibleProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeScoreCardNode();
    super.dispose();
  }
}
