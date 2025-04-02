import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClubType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ClubTypeSelectionProps {
  onSelectClubType: (clubType: ClubType) => void;
  onContinue: () => void;
}

export function ClubTypeSelection({ onSelectClubType, onContinue }: ClubTypeSelectionProps) {
  const [selectedClubType, setSelectedClubType] = useState<ClubType | null>(null);

  const { data: clubTypes, isLoading } = useQuery({
    queryKey: ['/api/club-types'],
    staleTime: Infinity,
  });

  const handleSelectClubType = (clubType: ClubType) => {
    setSelectedClubType(clubType);
    onSelectClubType(clubType);
  };

  const handleContinue = () => {
    if (selectedClubType) {
      onContinue();
    }
  };

  return (
    <div id="club-type-selection">
      <div className="text-center mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          What type of club are you looking for?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the type of golf club you'd like us to recommend based on your swing and physical characteristics.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {clubTypes?.map((clubType: ClubType) => (
            <Card
              key={clubType.id}
              className={`border-2 p-4 flex flex-col items-center transition-all hover:shadow-md cursor-pointer hover:-translate-y-1
                ${selectedClubType?.id === clubType.id 
                  ? 'border-primary bg-green-50' 
                  : 'border-gray-200'
                }`}
              onClick={() => handleSelectClubType(clubType)}
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-3">
                {/* Golf ball icon for all club types */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="6" strokeWidth="2" />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1" 
                    d="M12 6 Q 14 8 14 12 Q 14 16 12 18 M12 6 Q 10 8 10 12 Q 10 16 12 18" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1" 
                    d="M8 10 Q 10 10 12 10 Q 14 10 16 10 M8 14 Q 10 14 12 14 Q 14 14 16 14" 
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">{clubType.name}</h3>
              <p className="text-gray-600 text-sm text-center">
                {clubType.description}
              </p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button
          onClick={handleContinue}
          disabled={!selectedClubType}
          className="bg-primary hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
