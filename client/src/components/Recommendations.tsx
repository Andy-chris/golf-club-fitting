import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ClubType, RecommendedClub } from "@/lib/types";
import { formatPrice } from "@/lib/utils/fittingUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationsProps {
  profileId: number;
  clubTypeId: number;
  onBack: () => void;
  onSelectClub: (clubId: number) => void;
  onRetakeAnalysis: () => void;
}

export function Recommendations({ profileId, clubTypeId, onBack, onSelectClub, onRetakeAnalysis }: RecommendationsProps) {
  const { toast } = useToast();

  const { data: clubType } = useQuery({
    queryKey: [`/api/club-types/${clubTypeId}`],
    staleTime: Infinity,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/recommendations", { 
        profileId, 
        clubTypeId 
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate the recommendations query to refetch after generating
      recommendationsQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error generating recommendations",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const recommendationsQuery = useQuery({
    queryKey: [`/api/profiles/${profileId}/club-types/${clubTypeId}/recommendations`],
    enabled: !!profileId && !!clubTypeId,
  });

  useEffect(() => {
    // If no recommendations yet, generate them
    if (
      recommendationsQuery.data && 
      Array.isArray(recommendationsQuery.data) && 
      recommendationsQuery.data.length === 0
    ) {
      generateRecommendationsMutation.mutate();
    }
  }, [recommendationsQuery.data]);

  const handleSelectClub = (clubId: number) => {
    onSelectClub(clubId);
  };

  // Render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const isLoading = recommendationsQuery.isLoading || generateRecommendationsMutation.isPending;
  const recommendations = recommendationsQuery.data;

  return (
    <div id="recommendations">
      <div className="text-center mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          Your Recommended Clubs
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your profile and swing analysis, here are the best {clubType?.name.toLowerCase()} options for you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[550px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations?.map((club: RecommendedClub) => {
              const borderColor = club.priceCategory === 'budget' 
                ? 'border-green-600' 
                : club.priceCategory === 'mid-range' 
                  ? 'border-primary' 
                  : 'border-amber-400';
              
              const badgeBgColor = club.priceCategory === 'budget' 
                ? 'bg-green-600' 
                : club.priceCategory === 'mid-range' 
                  ? 'bg-primary' 
                  : 'bg-amber-400';
              
              const badgeTextColor = club.priceCategory === 'premium' 
                ? 'text-gray-900' 
                : 'text-white';
              
              const buttonBgColor = club.priceCategory === 'budget' 
                ? 'bg-green-600 hover:bg-green-700' 
                : club.priceCategory === 'mid-range' 
                  ? 'bg-primary hover:bg-green-800' 
                  : 'bg-amber-400 hover:bg-amber-500';
              
              const buttonTextColor = club.priceCategory === 'premium' 
                ? 'text-gray-900' 
                : 'text-white';
              
              const title = club.priceCategory === 'budget' 
                ? 'Budget Friendly' 
                : club.priceCategory === 'mid-range' 
                  ? 'Mid-Range' 
                  : 'Premium';

              return (
                <Card 
                  key={club.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${borderColor} transition-all hover:shadow-lg`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-xl">{title}</h3>
                      <span className={`text-sm ${badgeBgColor} ${badgeTextColor} py-1 px-3 rounded-full`}>
                        {club.badgeText}
                      </span>
                    </div>

                    <div className="flex justify-center mb-4 h-48">
                      {clubType?.name === "Drivers" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M15 3c2.5 0 4 1.2 4 2s-1.5 2-4 2h-6c-2.5 0-4-1.5-4-2s1.5-2 4-2h6z M9 7l-6 14 M15 7l-6 14" 
                          />
                        </svg>
                      )}
                      
                      {clubType?.name === "Fairway Woods" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M15 4c2 0 3.5 1 3.5 1.7s-1.2 1.8-3.5 1.8h-5c-2 0-3.5-1.2-3.5-1.8s1.5-1.7 3.5-1.7h5z M10 7.5l-6 13.5 M14 7.5l-6 13.5" 
                          />
                        </svg>
                      )}
                      
                      {clubType?.name === "Hybrids" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M15 5c1.5 0 2.5 0.8 2.5 1.5s-1 1.5-2.5 1.5h-4c-1.5 0-2.5-1-2.5-1.5s1-1.5 2.5-1.5h4z M11 8l-6 13 M14 8l-6 13" 
                          />
                        </svg>
                      )}
                      
                      {clubType?.name === "Irons" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M13 4c1 0 2 0.5 2 1s-0.7 1-2 1h-2.5c-1.2 0-2.5-0.5-2.5-1s1-1 2.5-1h2.5z M11 6l-6 15 M13 6l-6 15" 
                          />
                        </svg>
                      )}
                      
                      {clubType?.name === "Wedges" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M14 4.5c0.8 0 1.5 0.4 1.5 0.8s-0.5 0.8-1.5 0.8h-2c-0.8 0-1.5-0.4-1.5-0.8s0.5-0.8 1.5-0.8h2z M12 6l-5 15 M14 6l-5 15 M12 9l-1 1 M12 12l-1 1 M12 15l-1 1" 
                          />
                        </svg>
                      )}
                      
                      {clubType?.name === "Putters" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-full w-auto text-gray-700" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M4 6h12 M16 6v4 M4 6v4 M4 10h12 M10 10v11" 
                          />
                        </svg>
                      )}
                    </div>

                    <h4 className="font-semibold text-lg mb-1">{club.name}</h4>
                    <p className="text-gray-600 mb-4">{club.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Forgiveness</span>
                        {renderRating(club.forgiveness)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance</span>
                        {renderRating(club.distance)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Feel</span>
                        {renderRating(club.feel)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-4">
                        {formatPrice(club.price)}
                      </div>
                      <Button 
                        onClick={() => handleSelectClub(club.id)}
                        className={`${buttonBgColor} ${buttonTextColor} font-semibold py-2 px-6 rounded-lg transition-colors w-full`}
                      >
                        Find Best Price
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Not satisfied with these recommendations?</p>
          <Button 
            variant="link" 
            onClick={onRetakeAnalysis}
            className="text-primary hover:text-green-800 font-semibold underline"
          >
            Retake Swing Analysis
          </Button>
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-primary hover:text-primary-dark font-semibold border-primary hover:border-primary-dark"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
