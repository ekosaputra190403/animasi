# Ruang Pikir 3D Visual Storytelling

Important narration beats should be carried by clear, engaging 3D scenes, with supporting characters and effects that serve the story.

## What Happened

_Recorded in `remotion-composer` during task `ruang-pikir-visual-standard` after the user set a reusable visual quality bar for future videos._

The user wants videos to feel visually rich without leaving the narration unsupported: use 3D environments and object actions, add characters who portray events, choose scene changes that fit what is being said, and include relevant effects. The user also emphasized that the applicable production guide and templates must be followed from the start. Earlier Vasa review showed that extra detail is not enough when an action is missing, a character is cropped, or a shot does not explain the VO.

For the thunder-explainer storyboard, a topic-specific HTML catalog already contained six beat prototypes and reusable props, but it was not a Remotion composition and its browser preview depended on an external Three.js script that was blocked. The source showed a fixed-radius red safety zone and a generic human placeholder; neither should be treated as final visual truth.

The approved thunder storyboard now has reusable Remotion prototypes for heated air, traveling sound waves, the schematic distance scale, and a shelter interior, plus a project composition with the supplied VO and pause-aware captions. Type-check and bundle succeed, but local still rendering fails on both this project and the existing Vasa project before producing a frame; the integrated browser also blocks localhost. Keep all new visuals marked as prototypes and do not claim visual or word-level review until an actual preview is inspected.

## Takeaway

- Before implementation, audit the existing production system and map each important narration beat to a shot list: primary action, 3D setting/objects, supporting performers or extras, explanatory visual, camera, and audio cue.
- Use a topic catalog as a source of reusable ideas, not proof that a visual is production-ready. Render locally and review it; replace generic character placeholders with the channel rig, and avoid fixed-radius safety graphics unless the cited fact supports a measured boundary.
- For a 3-seconds-per-kilometer lightning estimate, show `≈` and label it as an estimate; do not make a scale drawing imply exact distance or safety.
- At the start of each video task, read and follow the current production guide and required templates. Use their prescribed order and formats; do not skip the audit, visual breakdown, or shot list and jump straight to implementation. Present the plan first when the guide or user requires review/approval.
- Make 3D scene content the default for environments, story actions, object interactions, and explanations. Use subtitles, labels, and restrained overlays to clarify—not replace—the visual explanation.
- Keep presenter identity consistent; use supporting characters to enact the event and extras to give relevant scenes life. Frame the important people and props fully and show their interaction.
- Change visual information in step with the narration, usually every 2–3 seconds when the idea or action changes. Avoid treating a camera move or decorative animation as a new shot.
- Give each visual or sound effect a clear purpose: explain, contextualize, show an event/detail, direct attention, or reinforce emotion. Avoid generic whooshes and clutter.
- After implementation, render a preview and inspect playback plus representative frames for narrative sync, visual variety, clarity, cropping, and missing beats. Do not call the video visually verified if the updated preview was not reviewed.
- In Remotion scenes, use global elapsed time for continuous weather/background motion and cut-local time for beat-specific actions; resetting all animation clocks at each cut can hide brief effects such as lightning.
- Review abstract explainer shots for visual grounding: restrained 3D stage rings, a clear source-to-listener path, and visible motion can add depth without adding more copy.
- When a requested asset library is standalone 2D SVG but a project requires 3D, reuse its visual inventory and build/use the matching 3D components rather than embedding a mismatched flat layer.
- Strengthen a recorded-script hook with typography, expression, camera, and lighting beats; keep the approved narration and its caption timing unchanged.
- Keep a visual catalog beside the character catalog in `pedoman-video/pustaka/`; classify each entry as an approved reference, an existing implementation, an available asset, or a not-yet-built idea.
- Link implemented entries to their real source files. Do not present an unrelated still as an asset preview; approved stills/clips are references, and final environments must still follow the production guide.
- Keep universal visual kits grouped by environment, weather, nature, buildings/roads, vehicles, props, explainers, and audio. Mark procedural models as prototypes until a rendered still is reviewed; keep not-yet-built items visible rather than implying full coverage.
- When adding or changing reusable visual components, update both the catalog entry and the catalog pointer in `PEDOMAN.md`.
- For pause-aware captions, use measured silence intervals to hold the active word and keep sentence/beat boundaries explicit. If forced alignment is unavailable, label within-beat word timing as an estimate and review the rendered preview before calling it synchronized.

## History

- 2026-11-12 (`remotion-composer`/`storyboard-kilat-guntur`): mapped the thunder explainer into 23 short cuts, recorded two asset gaps, and flagged prototype/safety-graphic review limits
- 2026-11-12 (`remotion-composer`/`ruang-pikir-visual-standard`): initial
- 2026-11-12 (`remotion-composer`/`ruang-pikir-visual-standard`): require production guide and templates from the beginning
- 2026-11-12 (`remotion-composer`/visual-catalog): added a source-linked visual catalog with explicit reference/implementation/availability status
- 2026-11-12 (`remotion-composer`/visual-library-foundation): expanded the catalog inventory and added foundational procedural 3D prototypes
- 2026-11-12 (`remotion-composer`/implementasi-visual-petir): added reusable thunder visuals and pause-aware VO integration; documented render limitation and unreviewed prototype status
- 2026-11-12 (`remotion-composer`/review-iterasi-visual-petir): reviewed first MP4 at 6/10, added 3D staging and continuous ambient timing; revised MP4 still requires render review
- 2026-11-12 (`remotion-composer`/review-v3-hook): user-rated v3 8/10; strengthen the opening question and selective camera punches while keeping the approved VO unchanged
- 2026-11-12 (`remotion-composer`/wave-framing-fix): portrait tracking shot clipped the source/listener wave endpoints and floor rings; reduce the wave group scale and stage-ring radius, then review a rendered frame before approval
