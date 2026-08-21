import React from "react";
import {
  AbsoluteFill,
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
};

export const timing = (config: DemoConfig) => {
  const scene1End = config.mode === "compose" ? 200 : 115;
  const firstItem = scene1End + 25;
  const lastItem = firstItem + (config.items.length - 1) * 33;
  const stampAt = lastItem + 35;
  return { scene1End, firstItem, stampAt, duration: stampAt + 60 };
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
        fontSize: 15,
        padding: "6px 14px",
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
          width: 780,
          background: C.card,
          border: `1px solid ${C.ruleStrong}`,
          boxShadow: "0 18px 48px rgba(27,32,37,0.12)",
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            padding: "14px 26px",
            borderBottom: `1px solid ${C.ruleStrong}`,
            fontFamily: MONO,
            fontSize: 14,
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

        <div style={{ padding: "20px 26px 26px" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: C.ink,
              paddingBottom: 10,
              borderBottom: `1px solid ${C.rule}`,
            }}
          >
            <span style={{ color: C.faint }}>{config.fieldLabel} </span>
            {config.fieldValue}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: C.ink,
              padding: "10px 0",
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
              fontSize: 17,
              lineHeight: 1.7,
              color: C.ink,
              minHeight: 60,
              paddingTop: 14,
            }}
          >
            {config.bodyText.slice(0, typedChars)}
            {isCompose && (
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 20,
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
                  fontSize: 24,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: sendBg,
                  color: C.card,
                  padding: "10px 34px",
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
        gap: 18,
        padding: "15px 0",
        borderBottom: `1px solid ${C.rule}`,
        opacity: visible ? s : 0,
        transform: `translateY(${visible ? (1 - s) * 14 : 14}px)`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          border: `2px solid ${C.stamp}`,
          color: C.stamp,
          fontFamily: MONO,
          fontWeight: 600,
          fontSize: 16,
          lineHeight: "20px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {"✓"}
      </div>
      <div
        style={{ fontFamily: MONO, fontSize: 17, color: C.ink, flexGrow: 1 }}
      >
        {item.text}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 15, color: C.faint }}>
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
          width: 860,
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
            padding: "14px 30px",
            borderBottom: `1px solid ${C.ruleStrong}`,
            fontFamily: MONO,
            fontSize: 14,
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

        <div style={{ padding: "10px 30px 84px" }}>
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
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.stamp,
              border: `3px solid ${C.stamp}`,
              background: C.paper,
              padding: "8px 18px 8px 26px",
            }}
          >
            {config.stampText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Demo: React.FC<{ config: DemoConfig }> = ({ config }) => {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <EmailScene config={config} />
      <ChecklistScene config={config} />
    </AbsoluteFill>
  );
};
