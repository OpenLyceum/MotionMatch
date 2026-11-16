import { MOTION_MATCH_PREFERENCES_NODE_SETTINGS } from "../MotionMatchConstants.js";
/**
 * MotionMatchPreferencesNode.ts
 *
 * The Preferences → Simulation tab.
 *
 * Teacher-facing controls for match tolerance, optional motion hints, the
 * sensor's sample rate, and raw sensor diagnostics.
 *
 * Note the text colour: the Preferences dialog is always light, whatever colour
 * profile the sim is in, so labels here use `controlSurfaceTextColorProperty`
 * and never `textColorProperty`.
 */

import { Node, Text, VBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import { Checkbox } from "scenerystack/sun";
import type { Tandem } from "scenerystack/tandem";
import { StringManager } from "../i18n/StringManager.js";
import MotionMatchColors from "../MotionMatchColors.js";
import { POSITION_TOLERANCE_RANGE_M, SENSOR_SAMPLE_RATE_RANGE_HZ } from "../MotionMatchConstants.js";
import MotionMatchNamespace from "../MotionMatchNamespace.js";
import type { MotionMatchPreferencesModel } from "./MotionMatchPreferencesModel.js";

const LABEL_FONT = new PhetFont(MOTION_MATCH_PREFERENCES_NODE_SETTINGS.LABEL_FONT_SIZE);
const DESCRIPTION_FONT = new PhetFont(MOTION_MATCH_PREFERENCES_NODE_SETTINGS.DESCRIPTION_FONT_SIZE);
const CONTENT_WIDTH: number = MOTION_MATCH_PREFERENCES_NODE_SETTINGS.CONTENT_WIDTH;

export class MotionMatchPreferencesNode extends Node {
  public constructor(preferences: MotionMatchPreferencesModel, tandem?: Tandem) {
    const strings = StringManager.getInstance().getPreferences();

    const toleranceControl = new NumberControl(
      strings.matchToleranceStringProperty,
      preferences.positionToleranceProperty,
      POSITION_TOLERANCE_RANGE_M,
      {
        delta: MOTION_MATCH_PREFERENCES_NODE_SETTINGS.TOLERANCE_CONTROL_DELTA,
        titleNodeOptions: { font: LABEL_FONT, fill: MotionMatchColors.controlSurfaceTextColorProperty },
        numberDisplayOptions: {
          decimalPlaces: MOTION_MATCH_PREFERENCES_NODE_SETTINGS.TOLERANCE_CONTROL_DECIMAL_PLACES,
          textOptions: { font: LABEL_FONT },
        },
        sliderOptions: { constrainValue: (value: number) => Math.round(value * 20) / 20 },
        ...(tandem ? { tandem: tandem.createTandem("toleranceControl") } : {}),
      },
    );

    const toleranceDescription = new Text(strings.matchToleranceDescriptionStringProperty, {
      font: DESCRIPTION_FONT,
      fill: MotionMatchColors.controlSurfaceTextColorProperty,
      maxWidth: CONTENT_WIDTH,
    });

    // Whole hertz only: the rate is a device setting, and a slider that lands on
    // 23.7 Hz would suggest a precision neither transport can honour.
    const sampleRateControl = new NumberControl(
      strings.sensorSampleRateStringProperty,
      preferences.sensorSampleRateProperty,
      SENSOR_SAMPLE_RATE_RANGE_HZ,
      {
        delta: 1,
        titleNodeOptions: { font: LABEL_FONT, fill: MotionMatchColors.controlSurfaceTextColorProperty },
        numberDisplayOptions: { decimalPlaces: 0, textOptions: { font: LABEL_FONT } },
        sliderOptions: { constrainValue: (value: number) => Math.round(value) },
        ...(tandem ? { tandem: tandem.createTandem("sampleRateControl") } : {}),
      },
    );

    const sampleRateDescription = new Text(strings.sensorSampleRateDescriptionStringProperty, {
      font: DESCRIPTION_FONT,
      fill: MotionMatchColors.controlSurfaceTextColorProperty,
      maxWidth: CONTENT_WIDTH,
    });

    const diagnosticsCheckbox = new Checkbox(
      preferences.showDiagnosticsProperty,
      new Text(strings.showDiagnosticsStringProperty, {
        font: LABEL_FONT,
        fill: MotionMatchColors.controlSurfaceTextColorProperty,
        maxWidth: CONTENT_WIDTH - MOTION_MATCH_PREFERENCES_NODE_SETTINGS.DIAGNOSTICS_CHECKBOX_MAX_WIDTH_OFFSET,
      }),
      {
        accessibleName: strings.showDiagnosticsStringProperty,
        ...(tandem ? { tandem: tandem.createTandem("diagnosticsCheckbox") } : {}),
      },
    );

    const motionDescriptionsCheckbox = new Checkbox(
      preferences.showMotionDescriptionsProperty,
      new Text(strings.showMotionDescriptionsStringProperty, {
        font: LABEL_FONT,
        fill: MotionMatchColors.controlSurfaceTextColorProperty,
        maxWidth: CONTENT_WIDTH - MOTION_MATCH_PREFERENCES_NODE_SETTINGS.MOTION_DESCRIPTIONS_CHECKBOX_MAX_WIDTH_OFFSET,
      }),
      {
        accessibleName: strings.showMotionDescriptionsStringProperty,
        ...(tandem ? { tandem: tandem.createTandem("motionDescriptionsCheckbox") } : {}),
      },
    );

    super({
      children: [
        new VBox({
          align: "left",
          spacing: MOTION_MATCH_PREFERENCES_NODE_SETTINGS.CONSTRUCTOR_SPACING,
          children: [
            toleranceControl,
            toleranceDescription,
            motionDescriptionsCheckbox,
            sampleRateControl,
            sampleRateDescription,
            diagnosticsCheckbox,
          ],
        }),
      ],
    });
  }
}

MotionMatchNamespace.register("MotionMatchPreferencesNode", MotionMatchPreferencesNode);
