import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionSensorSource } from "../../../src/common/model/MotionSensorSource.js";
import type { TMotionSensorDevice } from "../../../src/sensor/model/MotionSensorDevice.js";

describe("MotionSensorSource streaming", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("falls back to polling when a stream goes silent after a sample", async () => {
    vi.useFakeTimers();
    const source = new MotionSensorSource();
    let onSample: (echoTimeMicroseconds: number) => void = () => undefined;
    const readEchoTime = vi.fn().mockResolvedValue(1000);
    const stopStreaming = vi.fn().mockResolvedValue(undefined);
    const device: TMotionSensorDevice = {
      isConnected: true,
      name: "test sensor",
      connect: async () => undefined,
      disconnect: async () => undefined,
      readEchoTime: readEchoTime,
      setRange: async () => undefined,
      setSamplePeriod: async () => undefined,
      startStreaming: (_period, callback) => {
        onSample = callback;
        return Promise.resolve();
      },
      stopStreaming: stopStreaming,
    };
    (source as unknown as { device: TMotionSensorDevice }).device = device;

    source.startSampling();
    onSample(1000);
    await vi.advanceTimersByTimeAsync(900);
    onSample(1000);
    await vi.advanceTimersByTimeAsync(900);
    expect(stopStreaming).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(stopStreaming).toHaveBeenCalledOnce();
    expect(readEchoTime).toHaveBeenCalled();
    source.dispose();
  });
});
