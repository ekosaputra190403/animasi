import React from "react";
import { Composition } from "remotion";
import { Kejar, DURATION } from "./Kejar";
import { Beat1, Beat2, Beat3, Beat4, Beat5 } from "./Stills";
import { Contoh, CONTOH_DURATION } from "./Contoh";
import { Video, VIDEO_DURATION } from "./Video";

const still = { durationInFrames: 1, fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Composition id="Kejar" component={Kejar} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Beat1" component={Beat1} {...still} />
    <Composition id="Beat2" component={Beat2} {...still} />
    <Composition id="Beat3" component={Beat3} {...still} />
    <Composition id="Beat4" component={Beat4} {...still} />
    <Composition id="Beat5" component={Beat5} {...still} />
    <Composition id="Contoh" component={Contoh} durationInFrames={CONTOH_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Video" component={Video} durationInFrames={VIDEO_DURATION} fps={30} width={1080} height={1920} />
  </>
);
