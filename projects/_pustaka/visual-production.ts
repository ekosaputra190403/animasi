export type VisualKind =
  | "reconstruction"
  | "character-action"
  | "object-detail"
  | "cutaway"
  | "diagram"
  | "simulation"
  | "map"
  | "timeline"
  | "comparison"
  | "cta";

export type VisualExplainer = "two-gun-decks" | "stability" | "cause-and-effect" | "stability-comparison";

export type VisualSet = "shipyard-showcase" | "cannon-showcase" | "carving-showcase";

export type VisualShotPlan = {
  kind: VisualKind;
  intention: string;
  explainer?: VisualExplainer;
  set?: VisualSet;
};

export const timedItemAtFrame = <T extends readonly [{ start: number }, ...{ start: number }[]]>(
  items: T,
  frame: number,
): T[number] => {
  for (let index = items.length - 1; index >= 0; index--) {
    if (frame >= items[index].start) return items[index];
  }
  return items[0];
};
