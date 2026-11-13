import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Karakter } from "../_pustaka/Karakter";

// Klip uji gerak lincah pustaka v3 (6 detik). Bukan adegan video.
// Kiri: karyawan lari → berhenti → kaget → takut gemetar → pingsan.
// Kanan: satpam bicara → kaget melihat → lompat girang → bingung melambai.

const GROUND = 1500;

export const KlipUjiGerak: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // ---- Karyawan (cewek) ----
  let c: Record<string, unknown>;
  const cx = interpolate(t, [0, 1.1], [-120, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  if (t < 1.1) c = { expression: "takut", pose: "idle", motion: "lari", efek: ["debu"], tAksi: t };
  else if (t < 2.4) c = { expression: "kaget", pose: "angkat_tangan", motion: "kaget", efek: ["garis_kaget"], tAksi: t - 1.1 };
  else if (t < 3.6) c = { expression: "takut", pose: "tutup_mulut", motion: "gemetar", efek: ["keringat"], lirik: 1, tAksi: t - 2.4 };
  else c = { expression: "pingsan", pose: "idle", motion: "pingsan", efek: ["pusing"], tAksi: t - 3.6 };

  // ---- Satpam (biasa + topi satpam) ----
  let s: Record<string, unknown>;
  if (t < 1.3) s = { expression: "teriak", pose: "bicara", motion: "bicara", tAksi: t };
  else if (t < 2.4) s = { expression: "syok", pose: "angkat_tangan", motion: "kaget", tAksi: t - 1.3 };
  else if (t < 4.2) s = { expression: "girang", pose: "angkat_tangan", motion: "lompat", tAksi: t - 2.4 };
  else s = { expression: "bingung", pose: "lambai", motion: "napas", efek: ["tanya"], tAksi: t - 4.2 };

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2E5573 0%, #24455E 70%, #1B3447 70%, #162B3B 100%)" }}>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", color: "#FFFFFF", fontFamily: "Segoe UI, Arial", fontSize: 54, fontWeight: 700 }}>Uji gerak v3</div>
      <Karakter outfit="cewek" dir={1} t={t} x={cx} groundY={GROUND} width={480} {...(c as object)} />
      <Karakter outfit="biasa" dir={-1} t={t} x={900} groundY={GROUND} width={480} atribut={["topi_satpam"]} {...(s as object)} />
    </AbsoluteFill>
  );
};
