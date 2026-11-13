import React from "react";
import { Composition } from "remotion";
import { KatalogGladiator } from "./Katalog";
import { Video, VIDEO_FRAMES } from "./Video";

export const Root: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={VIDEO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="KatalogGladiator" component={KatalogGladiator} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
