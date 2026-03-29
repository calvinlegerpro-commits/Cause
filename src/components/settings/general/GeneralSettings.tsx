import React from "react";
import { useTranslation } from "react-i18next";
import { MicrophoneSelector } from "../MicrophoneSelector";
import { ShortcutInput } from "../ShortcutInput";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { AudioFeedback } from "../AudioFeedback";
import { useSettings } from "../../../hooks/useSettings";
import { VolumeSlider } from "../VolumeSlider";
import { ModelSettingsCard } from "./ModelSettingsCard";
import { LongAudioModelSettings } from "./LongAudioModelSettings";

export const GeneralSettings: React.FC = () => {
  const { t } = useTranslation();
  const { audioFeedbackEnabled } = useSettings();
  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <SettingsGroup title={t("settings.general.title")}>
        <ShortcutInput shortcutId="transcribe" grouped={true} />
        <ShortcutInput shortcutId="cancel" grouped={true} />
        <ShortcutInput shortcutId="pause" grouped={true} />
        <ShortcutInput shortcutId="show_history" grouped={true} />
        <ShortcutInput shortcutId="copy_latest_history" grouped={true} />
      </SettingsGroup>
      <ModelSettingsCard />
      <LongAudioModelSettings />
      <SettingsGroup title={t("settings.sound.title")}>
        <MicrophoneSelector descriptionMode="tooltip" grouped={true} />
        <AudioFeedback descriptionMode="tooltip" grouped={true} />
        <VolumeSlider disabled={!audioFeedbackEnabled} />
      </SettingsGroup>
    </div>
  );
};
