import React from "react";
import { Composition } from "remotion";
import { Template, TEMPLATE_DURATION } from "./Template";

export const Root: React.FC = () => (
  <Composition id="Template" component={Template} durationInFrames={TEMPLATE_DURATION} fps={30} width={1080} height={1920} />
);
