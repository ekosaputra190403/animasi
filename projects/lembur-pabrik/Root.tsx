import React from "react";
import { Composition } from "remotion";
import { UjiA, UjiB, UjiC } from "./Stills";
import { KatalogEkspresi, KatalogGerak, KatalogAtribut } from "./KatalogV3";
import { KlipUjiGerak } from "./KlipUjiGerak";
import { Video, VIDEO_FRAMES } from "./Video";

const still = { durationInFrames: 1, fps: 30, width: 1080, height: 1920 };
const lembar = { durationInFrames: 1, fps: 30, width: 1920, height: 1080 };

export const Root: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={VIDEO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="UjiA" component={UjiA} {...still} />
    <Composition id="UjiB" component={UjiB} {...still} />
    <Composition id="UjiC" component={UjiC} {...still} />
    <Composition id="KatalogEkspresi" component={KatalogEkspresi} {...lembar} />
    <Composition id="KatalogGerak" component={KatalogGerak} {...lembar} />
    <Composition id="KatalogAtribut" component={KatalogAtribut} {...lembar} />
    <Composition id="KlipUjiGerak" component={KlipUjiGerak} durationInFrames={180} fps={30} width={1080} height={1920} />
  </>
);
