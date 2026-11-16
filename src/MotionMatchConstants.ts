/**
 * MotionMatchConstants.ts
 *
 * Central repository for every named numeric constant used across the
 * simulation. Bare numbers that carry semantic meaning (sizes, margins,
 * physics defaults, ranges) belong here rather than inline in model or view
 * code, so they are named, documented, and changed in one place.
 *
 * Conventions
 * ───────────
 *  - Physics / model values use SI units (metres, seconds, kilograms, …);
 *    note the unit in a comment on each value.
 *  - Layout / chrome values are in screen pixels.
 *  - Colour strings live in MotionMatchColors.ts, not here.
 *  - Computed expressions (e.g. `2 * Math.PI`) may stay inline.
 */

import { Range } from "scenerystack/dot";
import MotionMatchNamespace from "./MotionMatchNamespace.js";

// ── Layout / chrome (screen pixels) ───────────────────────────────────────────

/** Margin between the screen edge and edge-anchored controls (e.g. Reset All). */
export const SCREEN_VIEW_MARGIN = 20;

/** Corner radius shared by control panels and dialogs. */
export const PANEL_CORNER_RADIUS = 6;

/** Plot area of the match chart, excluding axis labels and tick labels. */
export const CHART_WIDTH = 560;
export const CHART_HEIGHT = 300;

/** Width and height of the sparkline drawn on each profile's combo-box item. */
export const SPARKLINE_WIDTH = 46;
export const SPARKLINE_HEIGHT = 26;

/** Width of the control column on the right of both screens. */
export const CONTROL_PANEL_WIDTH = 384;

/** Height of the walking track strip in the play area. */
export const TRACK_HEIGHT = 108;

/** Height of the walker figure, in pixels. */
export const WALKER_HEIGHT = 72;

// ── The run (SI units) ────────────────────────────────────────────────────────

/**
 * Length of one matching run, in seconds. Also the full width of the chart's
 * time axis — the window is fixed, never scrolling, so the student can see the
 * whole target curve before they start.
 */
export const RUN_DURATION_S = 10;

/**
 * Seconds of 3-2-1 countdown between pressing Start and the first recorded
 * sample, matching MatchGraph's own lead-in.
 */
export const COUNTDOWN_S = 3;

/**
 * Trace sampling rate, in hertz. The model samples the active source on its own
 * fixed clock at this rate, so a run has the same number of points and the same
 * spacing whether it came from the pointer or from the sensor.
 */
const SAMPLE_RATE_HZ = 20;

/** Derived from {@link SAMPLE_RATE_HZ}; the model's fixed timestep during a run. */
export const SAMPLE_PERIOD_S = 1 / SAMPLE_RATE_HZ;

/**
 * Number of samples in the centered window used to differentiate the position
 * trace into velocity. Must be odd. At 20 Hz, 5 samples spans ±0.1 s — short
 * enough to follow a real turnaround, long enough to suppress sensor jitter.
 */
export const DERIVATIVE_WINDOW_SAMPLES = 5;

// ── Axes (SI units) ───────────────────────────────────────────────────────────

/**
 * Position axis and activity area. Although the PS-3219 can measure farther,
 * 2 m is a practical maximum walking distance for a classroom activity.
 */
export const POSITION_RANGE_M = new Range(0, 2);

/** Velocity axis. The fastest rescaled profile peaks near 0.63 m/s. */
export const VELOCITY_RANGE_MPS = new Range(-0.75, 0.75);

/** Tick spacing on the two axes. */
export const TIME_TICK_SPACING_S = 1;
export const POSITION_TICK_SPACING_M = 0.5;
export const VELOCITY_TICK_SPACING_MPS = 0.25;

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Half-width of the position match band, in metres. A sample counts as matched
 * when it lies within this distance of the target curve.
 */
export const DEFAULT_POSITION_TOLERANCE_M = 0.125;

/**
 * Half-width of the velocity match band, in m/s. Wider than the position band
 * in proportional terms because velocity is differentiated from the position
 * trace and therefore noisier.
 */
export const DEFAULT_VELOCITY_TOLERANCE_MPS = 0.15;

/** Bounds accepted for the match-tolerance preference, in metres. */
export const POSITION_TOLERANCE_RANGE_M = new Range(0.05, 0.3);

// ── Profiles ──────────────────────────────────────────────────────────────────

/**
 * Width of the smoothstep blend applied across a velocity discontinuity, in
 * seconds. Profiles D, F and G are piecewise-linear in position, so their exact
 * derivative is a step; blending makes the velocity target continuous and
 * physically walkable. See doc/model.md.
 */
export const CORNER_SMOOTHING_S = 0.4;

// ── Sensor ────────────────────────────────────────────────────────────────────

/**
 * How often the Motion Sensor screen asks the device for a position, in hertz —
 * by polling, or by asking the device to keep its own clock where the transport
 * allows it. Faster than {@link SAMPLE_RATE_HZ} so a fresh reading is always
 * waiting when the model's fixed clock takes its sample.
 */
export const DEFAULT_SENSOR_SAMPLE_RATE_HZ = 25;

/**
 * Bounds accepted for the sensor sample-rate preference, in hertz. The floor is
 * below the model's own {@link SAMPLE_RATE_HZ}, which is the point: a link too
 * slow to keep up is worth being able to see rather than only to suspect.
 */
export const SENSOR_SAMPLE_RATE_RANGE_HZ = new Range(5, 50);

/**
 * Consecutive failed reads tolerated before the source declares an error. A
 * single dropped BLE round trip is normal; ten in a row is not.
 */
export const MAXIMUM_CONSECUTIVE_FAILURES = 10;

/** Human-readable name of the position derived from the raw echo-time sample. */
export const POSITION_MEASUREMENT = "Position";

/** Settings for common/MotionMatchPanel.ts. */
export const MOTION_MATCH_PANEL_SETTINGS = {
  /** Options x margin (px). */
  OPTIONS_X_MARGIN: 12,
  /** Options y margin (px). */
  OPTIONS_Y_MARGIN: 10,
} as const;

/** Settings for common/MotionMatchScreenIcons.ts. */
export const MOTION_MATCH_SCREEN_ICONS_SETTINGS = {
  CREATE_MOTION_SENSOR_ICON_CENTER_Y_OFFSET: 62, // px

  CREATE_MOTION_SENSOR_ICON_X_SEGMENT_2: 40, // px

  /** Steps (count). */
  STEPS: 48,
  /** Arch path line width (px). */
  ARCH_PATH_LINE_WIDTH: 14,
  /** Create simulation icon x (px). */
  CREATE_SIMULATION_ICON_X: 60,
  /** Create simulation icon control y (px). */
  CREATE_SIMULATION_ICON_CONTROL_Y: 40,
  /** Create simulation icon line width (px). */
  CREATE_SIMULATION_ICON_LINE_WIDTH: 14,
  /** Create motion sensor icon x (px). */
  CREATE_MOTION_SENSOR_ICON_X: 70,
  /** Create motion sensor icon width (px). */
  CREATE_MOTION_SENSOR_ICON_WIDTH: 46,
  /** Create motion sensor icon height (px). */
  CREATE_MOTION_SENSOR_ICON_HEIGHT: 68,
  /** Create motion sensor icon corner x (px). */
  CREATE_MOTION_SENSOR_ICON_CORNER_X: 8,
  /** Create motion sensor icon corner y (px). */
  CREATE_MOTION_SENSOR_ICON_CORNER_Y: 8,
  /** Create motion sensor icon radius (px). */
  CREATE_MOTION_SENSOR_ICON_RADIUS: 14,
  /** Create motion sensor icon center x (px). */
  CREATE_MOTION_SENSOR_ICON_CENTER_X: 63,
} as const;

/** Settings for common/model/MotionMatchModel.ts. */
export const MOTION_MATCH_MODEL_SETTINGS = {
  /** * A dt larger than this is a tab that was backgrounded, not a slow frame. Clamping stops the accumulator from firing hundreds of catch-up samples and recording a flat line for time the student was not actually there for. */
  MAXIMUM_DT_S: 0.25,
  /** * Slack for the countdown comparison. Three seconds of 0.05 s ticks sums to 2.9999999999999996, which without this would hold the countdown for one extra frame. */
  TIME_EPSILON_S: 1e-9,
} as const;

/** Settings for common/model/MotionSensorSource.ts. */
export const MOTION_SENSOR_SOURCE_SETTINGS = {
  /** * How long a stream may say nothing before the run gives up on it and polls instead. Long enough to cover a slow first sample at the lowest rate the preference allows, short enough that a run of ten seconds still gets a trace. */
  STREAM_SILENCE_TIMEOUT_MS: 1000,
} as const;

/** Settings for common/model/Trace.ts. */
export const TRACE_SETTINGS = {
  /** Five 20 Hz samples span the requested 200 ms smoothing interval. */
  SMOOTHING_WINDOW_SAMPLES: 5,
} as const;

/** Settings for common/model/scoring.ts. */
export const SCORING_SETTINGS = {
  /** Perfect score (dimensionless). */
  PERFECT_SCORE: 100,
} as const;

/** Settings for common/view/MatchChartNode.ts. */
export const MATCH_CHART_NODE_SETTINGS = {
  CONSTRUCTOR_LINE_DASH_DASH: 8, // px
  LAY_OUT_LABELS_TOP_OFFSET: 18, // px
  LAY_OUT_LABELS_RIGHT_OFFSET: 28, // px

  /** Pixel insets reserved for the tick labels around the plot rectangle. */
  LEFT_INSET: 44,
  /** Bottom inset (px). */
  BOTTOM_INSET: 36,
  /** Top inset (px). */
  TOP_INSET: 8,
  /** Right inset (px). */
  RIGHT_INSET: 10,
  /** Tick label font size (px). */
  TICK_LABEL_FONT_SIZE: 11,
  /** Axis label font size (px). */
  AXIS_LABEL_FONT_SIZE: 13,
  /** * Points used to draw the target curve and the band. 200 over a 10 s window is one point every 50 ms — the same rate the trace is sampled at, so the target and a perfect trace are drawn with identical fidelity. */
  CURVE_SAMPLE_COUNT: 200,
  /** Y grid lines line width (px). */
  Y_GRID_LINES_LINE_WIDTH: 0.5,
  /** X grid lines line width (px). */
  X_GRID_LINES_LINE_WIDTH: 0.5,
  /** Target plot line width (px). */
  TARGET_PLOT_LINE_WIDTH: 2.5,
  /** Trace plot line width (px). */
  TRACE_PLOT_LINE_WIDTH: 2.5,
  /** Constructor radius (px). */
  CONSTRUCTOR_RADIUS: 3.5,
} as const;

/** Settings for common/view/MotionDiagramNode.ts. */
export const MOTION_DIAGRAM_NODE_SETTINGS = {
  /** Height (px). */
  HEIGHT: 58,
  /** Edge inset (px). */
  EDGE_INSET: 26,
  /** Vector y offset (px). */
  VECTOR_Y_OFFSET: 9,
  /** Children corner x (px). */
  CHILDREN_CORNER_X: 6,
  /** Children corner y (px). */
  CHILDREN_CORNER_Y: 6,
  /** Children font size (px). */
  CHILDREN_FONT_SIZE: 11,
  /** Children left (px). */
  CHILDREN_LEFT: 10,
  /** Children top (px). */
  CHILDREN_TOP: 5,
  /** Update dots radius (px). */
  UPDATE_DOTS_RADIUS: 4.5,
  /** Update dots head width (px). */
  UPDATE_DOTS_HEAD_WIDTH: 7,
  /** Update dots head height (px). */
  UPDATE_DOTS_HEAD_HEIGHT: 7,
  /** Update dots tail width (px). */
  UPDATE_DOTS_TAIL_WIDTH: 2,
} as const;

/** Settings for common/view/MotionMatchScreenView.ts. */
export const MOTION_MATCH_SCREEN_VIEW_SETTINGS = {
  LEGEND_LEFT_OFFSET: 44, // px
  LEGEND_TOP_OFFSET: 6, // px
  CONSTRUCTOR_TOP_OFFSET: 10, // px
  CONSTRUCTOR_BOTTOM_OFFSET: 14, // px

  MOTION_DIAGRAM_CONTROL_ITEM_2_SPACING: 6, // px
  MOTION_DIAGRAM_CONTROL_ITEM_3_SPACING: 6, // px

  /** Legend font size (px). */
  LEGEND_FONT_SIZE: 12,
  /** Legend spacing (px). */
  LEGEND_SPACING: 24,
  /** Motion diagram checkbox max width (px). */
  MOTION_DIAGRAM_CHECKBOX_MAX_WIDTH: 300,
  /** Motion diagram labels checkbox max width (px). */
  MOTION_DIAGRAM_LABELS_CHECKBOX_MAX_WIDTH: 276,
  /** Velocity vectors checkbox max width (px). */
  VELOCITY_VECTORS_CHECKBOX_MAX_WIDTH: 276,
  /** Motion diagram control spacing (px). */
  MOTION_DIAGRAM_CONTROL_SPACING: 7,
  /** Motion diagram control width (px). */
  MOTION_DIAGRAM_CONTROL_WIDTH: 18,
  /** Control column spacing (px). */
  CONTROL_COLUMN_SPACING: 14,
  /** Create legend entry spacing (px). */
  CREATE_LEGEND_ENTRY_SPACING: 6,
  /** Create legend entry end x (px). */
  CREATE_LEGEND_ENTRY_END_X: 22,
  /** Create legend entry line width (px). */
  CREATE_LEGEND_ENTRY_LINE_WIDTH: 2.5,
  /** Create legend entry max width (px). */
  CREATE_LEGEND_ENTRY_MAX_WIDTH: 120,
} as const;

/** Settings for common/view/PlayAreaNode.ts. */
export const PLAY_AREA_NODE_SETTINGS = {
  CONSTRUCTOR_TOP_OFFSET: 10, // px
  SENSOR_BODY_Y_OFFSET: 14, // px

  /** Tick label font size (px). */
  TICK_LABEL_FONT_SIZE: 10,
  /** Pixels reserved at each end so the figure stays on the track at either limit. */
  EDGE_INSET: 26,
  /** Track corner x (px). */
  TRACK_CORNER_X: 6,
  /** Track corner y (px). */
  TRACK_CORNER_Y: 6,
  /** Sensor body x (px). */
  SENSOR_BODY_X: -10,
  /** Sensor body y (px). */
  SENSOR_BODY_Y: -14,
  /** Sensor body width (px). */
  SENSOR_BODY_WIDTH: 20,
  /** Sensor body height (px). */
  SENSOR_BODY_HEIGHT: 28,
  /** Sensor body corner x (px). */
  SENSOR_BODY_CORNER_X: 3,
  /** Sensor body corner y (px). */
  SENSOR_BODY_CORNER_Y: 3,
} as const;

/** Settings for common/view/ProfileControl.ts. */
export const PROFILE_CONTROL_SETTINGS = {
  TITLE_MAX_WIDTH_OFFSET: 40, // px

  /** Label font size (px). */
  LABEL_FONT_SIZE: 13,
  /** Combo box spacing (px). */
  COMBO_BOX_SPACING: 10,
  /** Combo box max width (px). */
  COMBO_BOX_MAX_WIDTH: 240,
  /** Position label max width (px). */
  POSITION_LABEL_MAX_WIDTH: 150,
  /** Velocity label max width (px). */
  VELOCITY_LABEL_MAX_WIDTH: 150,
  /** Graph mode toggle spacing (px). */
  GRAPH_MODE_TOGGLE_SPACING: 10,
  /** Title font size (px). */
  TITLE_FONT_SIZE: 14,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 10,
} as const;

/** Settings for common/view/RunControl.ts. */
export const RUN_CONTROL_SETTINGS = {
  COUNTDOWN_TEXT_MAX_WIDTH_OFFSET: 40, // px
  CONNECT_FIRST_TEXT_MAX_WIDTH_OFFSET: 40, // px

  /** Score font size (px). */
  SCORE_FONT_SIZE: 26,
  /** Message font size (px). */
  MESSAGE_FONT_SIZE: 14,
  /** Play pause button radius (px). */
  PLAY_PAUSE_BUTTON_RADIUS: 22,
  /** Try again button font size (px). */
  TRY_AGAIN_BUTTON_FONT_SIZE: 15,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 10,
} as const;

/** Settings for common/view/ScoreCardNode.ts. */
export const SCORE_CARD_NODE_SETTINGS = {
  CREATE_CONTENT_MAX_WIDTH_OFFSET: 32, // px

  /** Score card width (px). */
  SCORE_CARD_WIDTH: 230,
  /** Score font size (px). */
  SCORE_FONT_SIZE: 34,
  /** Live panel x margin (px). */
  LIVE_PANEL_X_MARGIN: 16,
  /** Live panel y margin (px). */
  LIVE_PANEL_Y_MARGIN: 16,
  /** Final panel line width (px). */
  FINAL_PANEL_LINE_WIDTH: 4,
  /** Final panel x margin (px). */
  FINAL_PANEL_X_MARGIN: 16,
  /** Final panel y margin (px). */
  FINAL_PANEL_Y_MARGIN: 16,
} as const;

/** Settings for common/view/SensorPanel.ts. */
export const SENSOR_PANEL_SETTINGS = {
  STATUS_ROW_MAX_WIDTH_OFFSET: 60, // px
  DEVICE_NAME_TEXT_MAX_WIDTH_OFFSET: 40, // px
  ERROR_TEXT_MAX_WIDTH_OFFSET: 40, // px
  UNAVAILABLE_TEXT_MAX_WIDTH_OFFSET: 40, // px
  DIAGNOSTICS_TEXT_MAX_WIDTH_OFFSET: 40, // px
  MEASUREMENT_LIST_TEXT_MAX_WIDTH_OFFSET: 40, // px
  RAW_READING_TEXT_MAX_WIDTH_OFFSET: 40, // px

  /** Label font size (px). */
  LABEL_FONT_SIZE: 13,
  /** Message font size (px). */
  MESSAGE_FONT_SIZE: 12,
  /** Status dot radius (px). */
  STATUS_DOT_RADIUS: 5,
  /** Status row spacing (px). */
  STATUS_ROW_SPACING: 8,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 8,
} as const;

/** Settings for common/view/WalkerNode.ts. */
export const WALKER_NODE_SETTINGS = {
  LIMBS_LINE_WIDTH_FACTOR: 0.07, // dimensionless

  /** Proportions of the figure, as fractions of WALKER_HEIGHT. */
  HEAD_RADIUS: 0.13,
  /** Shoulder y (px). */
  SHOULDER_Y: 0.3,
  /** Hip y (px). */
  HIP_Y: 0.62,
  /** Arm span (px). */
  ARM_SPAN: 0.16,
  /** Leg span (px). */
  LEG_SPAN: 0.15,
} as const;

/** Settings for common/view/profileSparkline.ts. */
export const PROFILE_SPARKLINE_SETTINGS = {
  /** Enough points that a sinusoid reads as a sinusoid at thumbnail size. */
  SAMPLE_COUNT: 40,
  /** Create profile sparkline line width (px). */
  CREATE_PROFILE_SPARKLINE_LINE_WIDTH: 1.5,
} as const;

/** Settings for preferences/MotionMatchPreferencesNode.ts. */
export const MOTION_MATCH_PREFERENCES_NODE_SETTINGS = {
  DIAGNOSTICS_CHECKBOX_MAX_WIDTH_OFFSET: 40, // px
  MOTION_DESCRIPTIONS_CHECKBOX_MAX_WIDTH_OFFSET: 40, // px

  /** Label font size (px). */
  LABEL_FONT_SIZE: 14,
  /** Description font size (px). */
  DESCRIPTION_FONT_SIZE: 12,
  /** Content width (px). */
  CONTENT_WIDTH: 440,
  /** Tolerance control delta (control/model units). */
  TOLERANCE_CONTROL_DELTA: 0.05,
  /** Tolerance control decimal places (digits). */
  TOLERANCE_CONTROL_DECIMAL_PLACES: 2,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 12,
} as const;

MotionMatchNamespace.register("MotionMatchConstants", {
  SCREEN_VIEW_MARGIN,
  PANEL_CORNER_RADIUS,
  CHART_WIDTH,
  CHART_HEIGHT,
  RUN_DURATION_S,
  COUNTDOWN_S,
  SAMPLE_RATE_HZ,
  SAMPLE_PERIOD_S,
  POSITION_RANGE_M,
  VELOCITY_RANGE_MPS,
  DEFAULT_POSITION_TOLERANCE_M,
  DEFAULT_VELOCITY_TOLERANCE_MPS,
  CORNER_SMOOTHING_S,
  DEFAULT_SENSOR_SAMPLE_RATE_HZ,
  SENSOR_SAMPLE_RATE_RANGE_HZ,
});
