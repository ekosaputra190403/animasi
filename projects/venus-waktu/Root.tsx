import React from "react";
import { Composition } from "remotion";
import { Template } from "./Template";
import { SCENE } from "./scene.config";

export const Root: React.FC = () => (
  <Composition
    id="Venus"
    component={Template}
    durationInFrames={SCENE.durationSec * SCENE.fps}
    fps={SCENE.fps}
    width={SCENE.width}
    height={SCENE.height}
  />
);
