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

const BODY_TEXT =
  "Enter the PO and schedule delivery — 22 bundles landing Savannah Thursday.";

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
      }}
    >
      {"\u{1F4CE} "}
      {label}
    </div>
  );
};

const EmailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typedChars = Math.floor(
    interpolate(frame, [40, 145], [0, BODY_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const cursorOn = Math.floor(frame / 12) % 2 === 0 && frame < 165;

  const pressed = frame >= 165 && frame < 175;
  const sendScale = pressed ? 0.93 : 1;
  const sendBg = frame >= 165 ? C.stamp : C.ink;

  const exit = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          <span>New message</span>
          <span style={{ color: C.faint }}>7:41 AM</span>
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
            <span style={{ color: C.faint }}>To:{"      "}</span>
            clerk@slabclerk.com
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
            Fwd: Taj Mahal container {"—"} supplier docs
          </div>

          <div style={{ padding: "16px 0 4px" }}>
            <Chip label="proforma_TD-038.pdf" appearAt={12} />
            <Chip label="packing_list_SLD2.pdf" appearAt={24} />
          </div>

          <div
            style={{
              fontFamily: MONO,
              fontSize: 17,
              lineHeight: 1.7,
              color: C.ink,
              minHeight: 88,
              paddingTop: 14,
            }}
          >
            {BODY_TEXT.slice(0, typedChars)}
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
          </div>

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
        </div>
      </div>
    </AbsoluteFill>
  );
};

type Item = { text: string; detail: string; at: number };

const ITEMS: Item[] = [
  { text: "Attachments read — proforma + packing list", detail: "2 files", at: 225 },
  { text: "Prices checked against the order", detail: "3cm Taj Mahal", at: 258 },
  { text: "Purchase order entered — 22 bundles, 187 slabs", detail: "PO-260521", at: 291 },
  { text: "Track & trace armed — ETA Savannah, Thu", detail: "MSKU 884-2210", at: 324 },
  { text: "Drayage carrier assigned — delivery scheduled", detail: "2 stops", at: 357 },
  { text: "Reply drafted to you", detail: "for your OK", at: 390 },
];

const CheckRow: React.FC<{ item: Item }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - item.at;
  const s = spring({ frame: local, fps, config: { damping: 15 } });
  const visible = frame >= item.at;
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
        style={{
          fontFamily: MONO,
          fontSize: 17,
          color: C.ink,
          flexGrow: 1,
        }}
      >
        {item.text}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 15, color: C.faint }}>
        {item.detail}
      </div>
    </div>
  );
};

const ChecklistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 200, fps, config: { damping: 16 } });
  if (frame < 200) return null;

  const stampS = spring({ frame: frame - 425, fps, config: { damping: 10 } });

  const done = ITEMS.filter((i) => frame >= i.at).length;

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
            {done}/{ITEMS.length} done
          </span>
        </div>

        <div style={{ padding: "10px 30px 84px" }}>
          {ITEMS.map((item) => (
            <CheckRow key={item.text} item={item} />
          ))}
        </div>

        {frame >= 425 && (
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
            Awaiting your OK
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ClerkDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <EmailScene />
      <ChecklistScene />
    </AbsoluteFill>
  );
};
