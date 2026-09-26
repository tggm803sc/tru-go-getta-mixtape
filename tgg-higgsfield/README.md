# TGG Higgsfields

TGG-owned creator generation workspace for image, video, VFX, avatars, world shots, trailers and ad variants.

## Core job types
- image
- video
- vfx
- avatar
- world-shot
- ad-variant

## Saved presets
- world-cinematic
- avatar-hero
- vehicle-commercial
- music-video-vfx
- game-trailer
- social-ad

Every job can be linked to a TGG Project with `project_id`. Job state is saved under:

`.tgg/higgsfield/jobs/<job-id>.json`

inside that project so generation history is committed and included in TGG Projects backups.

The bridge can run as a local queue or forward to a configured generation backend through `TGG_HIGGSFIELD_BACKEND_URL`.
