# Vasa VO And Scene Alignment

When revising a Vasa edit, treat the recorded narration and its timed cues as the source of truth for scene cuts and subtitles.

## What Happened

_Discovered in `remotion-composer/projects/vasa` during task `vasa-vo-scene-alignment` while reviewing `preview-vasa-v4.mp4`._

Sampled frames showed the hook kept on the waterline shot through “lalu tenggelam,” so the defining action was not visible at the spoken beat. Another subtitle pair crossed into the next cue (“tenggelam. Namanya”), while the shipyard and carving close-ups obscured important context and an actor.

The first fix kept the recorded VO and cue timings intact, split the hook at 9.95 seconds to show the ship descending, tightened the workshop framing, grounded the shipyard scene, and bounded subtitle pairs to their sentence cue. A follow-up user review identified that subtitles still led the VO from 10–39 seconds. The word timer was syllable-weighted across the full cue and ignored internal pauses, while each pair exposed the upcoming word.

The follow-up measured silence intervals from the local MP3, froze the speech clock during those gaps, and only revealed the current and previously spoken words. The source VO and runtime MP3 were byte-identical. TypeScript, bundle, cue-boundary, and pause-hold checks passed. Still-frame rendering failed with `ErrorEvent`, so the new visual result remains unverified until a manual preview is rendered.

## Takeaway

- Align cut boundaries to the narration cues in `vo/kata.json`; a short action beat can be more effective than holding one shot through a major spoken event.
- Do not change spoken wording without updating the recording and measured cue timings together.
- Keep each two-word subtitle group inside its cue; allow a final one-word group when a cue has an odd word count.
- Exclude measured audio silences from the caption clock and do not reveal future words; syllable weighting between pauses is still an estimate, not forced alignment.
- Inspect preview frames at important spoken transitions. A clean type-check or bundle cannot establish that composition and timing look right; if frame rendering fails, report that limitation and validate the manual preview before calling visuals verified.
- Frame detail shots so the relevant actor and the object they work on remain visible; make workshop and shipyard geometry read as grounded, active spaces rather than isolated props.

## History

- 2026-11-12 (`remotion-composer`/`vasa-vo-scene-alignment`): initial
- 2026-11-12 (`remotion-composer`/`vasa-vo-scene-alignment`): record pause-aware timing and no-future-word display after review found captions leading the VO
