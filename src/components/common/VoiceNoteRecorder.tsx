import { VoiceRecorder, VoiceNoteMetadata } from './VoiceRecorder';

interface VoiceNoteRecorderProps {
  onAudioRecorded?: (audioData: { audioUrl: string; durationSeconds: number; blob?: Blob; blobSize?: number }) => void;
  onAudioRemoved?: () => void;
  existingAudioUrl?: string;
  existingDuration?: number;
}

export function VoiceNoteRecorder({
  onAudioRecorded,
  onAudioRemoved,
  existingAudioUrl,
  existingDuration,
}: VoiceNoteRecorderProps) {
  return (
    <VoiceRecorder
      initialAudioUrl={existingAudioUrl}
      initialDuration={existingDuration}
      onAudioRecorded={(meta: VoiceNoteMetadata) => {
        if (onAudioRecorded) {
          onAudioRecorded({
            audioUrl: meta.audioUrl,
            durationSeconds: meta.durationSeconds,
            blob: meta.blob,
            blobSize: meta.blobSize,
          });
        }
      }}
      onAudioRemoved={onAudioRemoved}
    />
  );
}
