---
name: lumen-voice-audio
description: STUB. Voice & Audio family entry point (AudioPlayer + Transcription + VoiceSelector + SpeechInput + MicSelector). Marked experimental until a Warp surface needs voice. Mirrors Vercel AI Elements `AudioPlayer`. Install with `npx ai-elements@latest add audio-player`. Status: experimental.
---

# Lumen VoiceAudio

STUB. Voice & Audio family entry point (AudioPlayer + Transcription + VoiceSelector + SpeechInput + MicSelector). Marked experimental until a Warp surface needs voice.

## Use when

- FUTURE: Warp ships voice surface (phone-based dispatch confirmation, voice quoting).
- FUTURE: AI surface where transcription + audio playback matter.
- Today: do not use; primitive is stubbed.

## NEVER

- NEVER ship voice without an explicit privacy + consent flow. Audio captured by SpeechInput requires user opt-in.
- NEVER assume autoplay works. Browsers + iOS Safari block autoplay; expect user-gesture-to-play.
- NEVER skip transcript captions on AudioPlayer — WCAG SC 1.2.2 requires captions for prerecorded audio.

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- color.text.accent
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.md, radius.lg
- motion.duration.fast, motion.duration.base
- motion.easing.standard

## Anatomy

1. `AudioPlayer` — Audio playback with transcript.
2. `Transcription` — Live transcript renderer.
3. `VoiceSelector` — Voice picker (TTS voice).
4. `SpeechInput` — Microphone input → transcript.
5. `MicSelector` — Microphone device picker.

## API

STUB. When fleshed out, ships AudioPlayer + Transcription + VoiceSelector + SpeechInput + MicSelector following the Vercel AI Elements API. Until then, this is a structural placeholder.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add audio-player
import { VoiceAudio } from "@/components/ai-elements/voice-audio";

export function Example() {
  return <VoiceAudio />;
}
```

## Related

- Message (voice messages render as Message)
- Tool (Speech-to-tool flows)
