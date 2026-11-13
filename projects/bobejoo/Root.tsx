import React from "react";
import { Still } from "remotion";
import { CastSheet } from "./CastSheet";
import { Sheet } from "./Sheet";

export const Root: React.FC = () => (
  <>
    <Still id="CharacterSheet" component={Sheet} width={1600} height={1880} />
    <Still id="CastSheet" component={CastSheet} width={1600} height={1880} />
  </>
);
