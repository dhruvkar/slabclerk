import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BigShoulders";

const mono = loadMono();
const display = loadDisplay();

const C = {
  paper: "#F5F4F0",
  card: "#FBFAF7",
  reportBg: "#EFEDE7",
  ink: "#1B2025",
  soft: "#59616A",
  faint: "#8A9099",
  rule: "#DAD8D1",
  ruleStrong: "#B9B7AE",
  stamp: "#B0392C",
};

const MONO = `${mono.fontFamily}, "Courier New", monospace`;
const DISPLAY = `${display.fontFamily}, "Arial Narrow", sans-serif`;

export type DemoItem = { text: string; detail: string };

export type DemoConfig = {
  mode: "compose" | "incoming";
  headerLeft: string;
  headerRight: string;
  fieldLabel: string; // "To:" or "From:"
  fieldValue: string;
  subject: string;
  chips: string[];
  bodyText: string;
  items: DemoItem[];
  stampText: string;
  switchLabel?: string;
  /** Grid tile: narrower card, same absolute type, so text stays legible when scaled down. */
  compact?: boolean;
};

export const timing = (config: DemoConfig) => {
  const switchDur = config.switchLabel ? 110 : 0;
  const scene1End = config.mode === "compose" ? 200 : 115;
  const firstItem = scene1End + 25;
  const lastItem = firstItem + (config.items.length - 1) * 33;
  const stampAt = lastItem + 35;
  return { switchDur, scene1End, firstItem, stampAt, duration: switchDur + stampAt + 60 };
};

const Chip: React.FC<{ label: string; appearAt: number }> = ({
  label,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 14 } });
  if (frame < appearAt) return null;
  return (
    <div
      style={{
        transform: `scale(${s})`,
        border: `1px solid ${C.ruleStrong}`,
        background: C.reportBg,
        color: C.ink,
        fontFamily: MONO,
        fontSize: 19,
        padding: "8px 16px",
        display: "inline-block",
        marginRight: 12,
        marginBottom: 8,
      }}
    >
      {"\u{1F4CE} "}
      {label}
    </div>
  );
};

const EmailScene: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = timing(config);
  const isCompose = config.mode === "compose";

  const typedChars = isCompose
    ? Math.floor(
        interpolate(frame, [40, 145], [0, config.bodyText.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      )
    : config.bodyText.length;
  const cursorOn =
    isCompose && Math.floor(frame / 12) % 2 === 0 && frame < 165;

  const pressed = isCompose && frame >= 165 && frame < 175;
  const sendScale = pressed ? 0.93 : 1;
  const sendBg = isCompose && frame >= 165 ? C.stamp : C.ink;

  const exit = interpolate(
    frame,
    [t.scene1End - 20, t.scene1End],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const enter = spring({ frame, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: 1 - exit,
        transform: `translateY(${exit * -60}px)`,
      }}
    >
      <div
        style={{
          width: config.compact ? 700 : 980,
          background: C.card,
          border: `1px solid ${C.ruleStrong}`,
          boxShadow: "0 18px 48px rgba(27,32,37,0.12)",
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            padding: "15px 30px",
            borderBottom: `1px solid ${C.ruleStrong}`,
            fontFamily: MONO,
            fontSize: 17,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.soft,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{config.headerLeft}</span>
          <span style={{ color: C.faint }}>{config.headerRight}</span>
        </div>

        <div style={{ padding: "22px 30px 30px" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              color: C.ink,
              paddingBottom: 12,
              borderBottom: `1px solid ${C.rule}`,
            }}
          >
            <span style={{ color: C.faint }}>{config.fieldLabel} </span>
            {config.fieldValue}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              color: C.ink,
              padding: "12px 0",
              borderBottom: `1px solid ${C.rule}`,
            }}
          >
            <span style={{ color: C.faint }}>Subject: </span>
            {config.subject}
          </div>

          <div style={{ padding: "16px 0 4px" }}>
            {config.chips.map((c, i) => (
              <Chip key={c} label={c} appearAt={12 + i * 12} />
            ))}
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              lineHeight: 1.65,
              color: C.ink,
              minHeight: 84,
              paddingTop: 14,
            }}
          >
            {config.bodyText.slice(0, typedChars)}
            {isCompose && (
              <span
                style={{
                  display: "inline-block",
                  width: 13,
                  height: 26,
                  background: cursorOn ? C.stamp : "transparent",
                  verticalAlign: "text-bottom",
                  marginLeft: 2,
                }}
              />
            )}
          </div>

          {isCompose && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: sendBg,
                  color: C.card,
                  padding: "12px 40px",
                  transform: `scale(${sendScale})`,
                }}
              >
                Send
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CheckRow: React.FC<{ item: DemoItem; at: number }> = ({ item, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  const s = spring({ frame: local, fps, config: { damping: 15 } });
  const visible = frame >= at;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "18px 0",
        borderBottom: `1px solid ${C.rule}`,
        opacity: visible ? s : 0,
        transform: `translateY(${visible ? (1 - s) * 14 : 14}px)`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: `2px solid ${C.stamp}`,
          color: C.stamp,
          fontFamily: MONO,
          fontWeight: 600,
          fontSize: 20,
          lineHeight: "26px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {"✓"}
      </div>
      <div
        style={{ fontFamily: MONO, fontSize: 23, color: C.ink, flexGrow: 1 }}
      >
        {item.text}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 19, color: C.faint }}>
        {item.detail}
      </div>
    </div>
  );
};

const ChecklistScene: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = timing(config);
  const enter = spring({
    frame: frame - t.scene1End,
    fps,
    config: { damping: 16 },
  });
  if (frame < t.scene1End) return null;

  const stampS = spring({
    frame: frame - t.stampAt,
    fps,
    config: { damping: 10 },
  });

  const done = config.items.filter(
    (_, i) => frame >= t.firstItem + i * 33
  ).length;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: config.compact ? 700 : 1060,
          background: C.reportBg,
          border: `1px solid ${C.ruleStrong}`,
          boxShadow: "0 18px 48px rgba(27,32,37,0.12)",
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "16px 34px",
            borderBottom: `1px solid ${C.ruleStrong}`,
            fontFamily: MONO,
            fontSize: 17,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.soft,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <b style={{ color: C.ink, fontWeight: 600 }}>SlabClerk</b> · working
          </span>
          <span style={{ color: C.faint }}>
            {done}/{config.items.length} done
          </span>
        </div>

        <div style={{ padding: "12px 34px 96px" }}>
          {config.items.map((item, i) => (
            <CheckRow key={item.text} item={item} at={t.firstItem + i * 33} />
          ))}
        </div>

        {frame >= t.stampAt && (
          <div
            style={{
              position: "absolute",
              right: 34,
              bottom: 16,
              transform: `rotate(-5deg) scale(${stampS})`,
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: C.stamp,
              border: `3px solid ${C.stamp}`,
              background: C.paper,
              padding: "10px 22px 10px 30px",
            }}
          >
            {config.stampText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const SwitchScene: React.FC<{ label: string; dur: number }> = ({
  label,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flip = spring({ frame: frame - 30, fps, config: { damping: 13 } });
  const on = frame >= 30;
  const knobX = on ? flip * 64 : 0;
  const enter = spring({ frame, fps, config: { damping: 16 } });
  const laterIn = interpolate(frame, [62, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [dur - 18, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: 1 - exit,
        transform: `translateY(${exit * -40}px)`,
      }}
    >
      <div
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 30}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.ink,
          }}
        >
          {label}
        </div>
        <div
          style={{
            width: 132,
            height: 68,
            border: `3px solid ${C.ink}`,
            background: on ? C.stamp : C.reportBg,
            position: "relative",
            transition: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6 + knobX,
              width: 50,
              height: 50,
              background: C.card,
              border: `3px solid ${C.ink}`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: on ? C.stamp : C.faint,
            fontWeight: 600,
          }}
        >
          {on ? "On · runs nightly" : "Off"}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 19,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.soft,
            opacity: laterIn,
            marginTop: 10,
          }}
        >
          Three weeks later&hellip;
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Demo: React.FC<{ config: DemoConfig }> = ({ config }) => {
  const t = timing(config);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {config.switchLabel ? (
        <>
          <Sequence from={0} durationInFrames={t.switchDur}>
            <SwitchScene label={config.switchLabel} dur={t.switchDur} />
          </Sequence>
          <Sequence from={t.switchDur}>
            <EmailScene config={config} />
            <ChecklistScene config={config} />
          </Sequence>
        </>
      ) : (
        <>
          <EmailScene config={config} />
          <ChecklistScene config={config} />
        </>
      )}
    </AbsoluteFill>
  );
};
