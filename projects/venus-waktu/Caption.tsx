import React from "react";
import { Easing, interpolate } from "remotion";
import kata from "./vo/kata.json";

type WordTiming = [number, number, string];

const KEYWORDS = new Set(["venus", "243", "225", "117", "58", "barat", "timur", "retrograde"]);
const cleanWord = (word: string) => word.replace(/[.,!?;:]+$/g, "");

const chunks = (() => {
  const result: { start: number; end: number; words: string[] }[] = [];
  let current: { start: number; end: number; words: string[] } | null = null;

  for (const [start, end, word] of kata as WordTiming[]) {
    if (!current) current = { start, end, words: [] };
    current.end = end;
    current.words.push(word);

    if (current.words.length === 2 || /[.,!?;:]$/.test(word)) {
      result.push(current);
      current = null;
    }
  }
  if (current) result.push(current);

  return result.map((chunk, index) => ({
    ...chunk,
    end: Math.min(result[index + 1]?.start ?? chunk.end + 0.5, chunk.end + 0.5),
  }));
})();

export const Caption: React.FC<{ t: number }> = ({ t }) => {
  const active = chunks.find((chunk) => t >= chunk.start && t < chunk.end);
  if (!active) return null;

  const pop = interpolate(t - active.start, [0, 0.08, 0.16], [0.82, 1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g transform={`translate(540 1500) scale(${pop}) translate(-540 -1500)`}>
        <text
          x={540}
          y={1500}
          textAnchor="middle"
          fontFamily="'Segoe UI', Arial, sans-serif"
          fontWeight={900}
          fontSize={72}
          stroke="#141414"
          strokeWidth={12}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {active.words.map((word, index) => (
            <tspan key={`${word}-${index}`} fill={KEYWORDS.has(cleanWord(word).toLowerCase()) ? "#FFD21F" : "#FFFFFF"}>
              {(index ? " " : "") + word}
            </tspan>
          ))}
        </text>
      </g>
    </svg>
  );
};
