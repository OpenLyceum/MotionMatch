/**
 * MotionMatchScreenIcons.ts
 *
 * Programmatic home-screen / navigation-bar icons for each screen, drawn on the
 * standard PhET 548 × 373 canvas using MotionMatchColors.
 *
 * Both icons show the same arch (profile H) so the two screens read as the same
 * activity; the sensor screen adds the sensor and its cone to say where the
 * motion comes from.
 */
import { Shape } from "scenerystack/kite";
import { Circle, Node, Path, Rectangle, type TColor } from "scenerystack/scenery";
import { ScreenIcon } from "scenerystack/sim";
import MotionMatchColors from "../MotionMatchColors.js";
import { MOTION_MATCH_SCREEN_ICONS_SETTINGS } from "../MotionMatchConstants.js";

const W = 548;
const H = 373;

function background(): Rectangle {
  return new Rectangle(0, 0, W, H, { fill: MotionMatchColors.backgroundColorProperty });
}

/** The arch of profile H, scaled to fill most of the icon canvas. */
function archPath(stroke: TColor, lineDash: number[]): Path {
  const shape = new Shape();
  const steps: number = MOTION_MATCH_SCREEN_ICONS_SETTINGS.STEPS;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = 60 + t * (W - 120);
    // 4t(1-t) peaks at 1 in the middle, giving the same arch shape as profile H.
    const y = H - 70 - 4 * t * (1 - t) * (H - 160);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return new Path(shape, {
    stroke: stroke,
    lineWidth: MOTION_MATCH_SCREEN_ICONS_SETTINGS.ARCH_PATH_LINE_WIDTH,
    lineCap: "round",
    lineDash: lineDash,
  });
}

function iconFrom(content: Node): ScreenIcon {
  return new ScreenIcon(content, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1,
    fill: MotionMatchColors.backgroundColorProperty,
  });
}

export function createSimulationIcon(): ScreenIcon {
  return iconFrom(
    new Node({
      children: [
        background(),
        archPath(MotionMatchColors.targetCurveColorProperty, [24, 16]),
        // A pointer-drawn trace: close to the target, not on it.
        new Path(
          new Shape()
            .moveTo(MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_SIMULATION_ICON_X, H - 90)
            .quadraticCurveTo(
              W / 2,
              MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_SIMULATION_ICON_CONTROL_Y,
              W - 60,
              H - 60,
            ),
          {
            stroke: MotionMatchColors.traceColorProperty,
            lineWidth: MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_SIMULATION_ICON_LINE_WIDTH,
            lineCap: "round",
          },
        ),
      ],
    }),
  );
}

export function createMotionSensorIcon(): ScreenIcon {
  return iconFrom(
    new Node({
      children: [
        background(),
        archPath(MotionMatchColors.targetCurveColorProperty, [24, 16]),
        // The sensor at the origin, with its ultrasound cone opening along the track.
        new Path(
          new Shape()
            .moveTo(MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_X, H - 60)
            .lineTo(W - 40, H - 150)
            .lineTo(W - 40, H - 20)
            .close(),
          {
            fill: MotionMatchColors.sensorBeamColorProperty,
          },
        ),
        new Rectangle(
          MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_X_SEGMENT_2,
          H - 96,
          MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_WIDTH,
          MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_HEIGHT,
          MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_CORNER_X,
          MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_CORNER_Y,
          { fill: MotionMatchColors.sensorBodyColorProperty },
        ),
        new Circle(MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_RADIUS, {
          fill: MotionMatchColors.backgroundColorProperty,
          centerX: MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_CENTER_X,
          centerY: H - MOTION_MATCH_SCREEN_ICONS_SETTINGS.CREATE_MOTION_SENSOR_ICON_CENTER_Y_OFFSET,
        }),
      ],
    }),
  );
}
