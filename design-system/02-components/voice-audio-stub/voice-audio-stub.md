---
name: VoiceAudio
type: component
tier: T5
family: VoiceAudio
version: 0.13.0
last_updated: 2026-05-17
status: experimental
phase: 5
vercel_ai_elements: AudioPlayer
install: npx ai-elements@latest add audio-player
related:
  - ./voice-audio-stub.skill.md
  - ../message/message.md
---

# VoiceAudio

STUB. Voice & Audio family entry point (AudioPlayer + Transcription + VoiceSelector + SpeechInput + MicSelector). Marked experimental until a Warp surface needs voice.

## Use when

- FUTURE: Warp ships voice surface (phone-based dispatch confirmation, voice quoting).
- FUTURE: AI surface where transcription + audio playback matter.
- Today: do not use; primitive is stubbed.

## API

STUB. When fleshed out, ships AudioPlayer + Transcription + VoiceSelector + SpeechInput + MicSelector following the Vercel AI Elements API. Until then, this is a structural placeholder.

## Anatomy

| Sub-component | Role |
|---|---|
| `AudioPlayer` | Audio playback with transcript. |
| `Transcription` | Live transcript renderer. |
| `VoiceSelector` | Voice picker (TTS voice). |
| `SpeechInput` | Microphone input → transcript. |
| `MicSelector` | Microphone device picker. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Message (voice messages render as Message)
- Tool (Speech-to-tool flows)

## Install

```bash
npx ai-elements@latest add audio-player
```
