import React from "react";
import { useTranslation } from "react-i18next";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold text-logo-primary">Causer</h1>
        <h1 className="text-2xl font-semibold text-text">
          {t("onboarding.welcome.title")}
        </h1>
        <p className="text-text/70 text-center max-w-xs">
          {t("onboarding.welcome.subtitle")}
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-4 px-6 py-3 rounded-xl bg-logo-primary hover:bg-logo-primary/90 text-white font-semibold text-base transition-colors shadow-lg"
      >
        {t("onboarding.welcome.cta")}
      </button>
    </div>
  );
};

export default WelcomeScreen;
