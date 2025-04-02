import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ClubTypeSelection } from "@/components/ClubTypeSelection";
import { ProfileInformation } from "@/components/ProfileInformation";
import { SwingAnalysis } from "@/components/SwingAnalysis";
import { Recommendations } from "@/components/Recommendations";
import { BestDeals } from "@/components/BestDeals";
import { STEPS } from "@/lib/constants";
import { ClubType } from "@/lib/types";

export default function GolfClubFitting() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedClubType, setSelectedClubType] = useState<ClubType | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);

  const handleSelectClubType = (clubType: ClubType) => {
    setSelectedClubType(clubType);
  };

  const navigateToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleProfileCreated = (id: number) => {
    setProfileId(id);
    navigateToStep(2);
  };

  const handleAnalysisComplete = (id: number) => {
    setAnalysisId(id);
    navigateToStep(3);
  };

  const handleSelectClub = (clubId: number) => {
    setSelectedClubId(clubId);
    navigateToStep(4);
  };

  const handleStartNewFitting = () => {
    // Reset all state and go back to first step
    setSelectedClubType(null);
    setProfileId(null);
    setAnalysisId(null);
    setSelectedClubId(null);
    navigateToStep(0);
  };

  return (
    <Layout>
      <ProgressStepper steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && (
        <ClubTypeSelection 
          onSelectClubType={handleSelectClubType}
          onContinue={() => navigateToStep(1)}
        />
      )}

      {currentStep === 1 && (
        <ProfileInformation
          onBack={() => navigateToStep(0)}
          onContinue={handleProfileCreated}
        />
      )}

      {currentStep === 2 && profileId && (
        <SwingAnalysis
          profileId={profileId}
          onBack={() => navigateToStep(1)}
          onContinue={handleAnalysisComplete}
        />
      )}

      {currentStep === 3 && profileId && selectedClubType && (
        <Recommendations
          profileId={profileId}
          clubTypeId={selectedClubType.id}
          onBack={() => navigateToStep(2)}
          onSelectClub={handleSelectClub}
          onRetakeAnalysis={() => navigateToStep(2)}
        />
      )}

      {currentStep === 4 && selectedClubId && (
        <BestDeals
          clubId={selectedClubId}
          onBack={() => navigateToStep(3)}
          onStartNewFitting={handleStartNewFitting}
        />
      )}
    </Layout>
  );
}
