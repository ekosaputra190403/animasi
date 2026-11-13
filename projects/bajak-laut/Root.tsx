import React from "react";
import { Composition } from "remotion";
import { Video, VIDEO_FRAMES } from "./Video";
import { FPS } from "./timing";

export const Root: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={VIDEO_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
