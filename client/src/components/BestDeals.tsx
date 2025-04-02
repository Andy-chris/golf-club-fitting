import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { RecommendedClub, RetailerDeal, ClubType } from "@/lib/types";
import { formatPrice } from "@/lib/utils/fittingUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface BestDealsProps {
  clubId: number;
  onBack: () => void;
  onStartNewFitting: () => void;
}

export function BestDeals({ clubId, onBack, onStartNewFitting }: BestDealsProps) {
  const { data: club, isLoading: isClubLoading } = useQuery({
    queryKey: [`/api/recommendations/${clubId}`],
    staleTime: Infinity,
  });

  const { data: deals, isLoading: isDealsLoading } = useQuery({
    queryKey: [`/api/clubs/${clubId}/deals`],
    staleTime: Infinity,
    enabled: !!clubId,
  });
  
  // Get club type information
  const { data: clubType } = useQuery({
    queryKey: [`/api/club-types/${club?.clubTypeId}`],
    enabled: !!club?.clubTypeId,
    staleTime: Infinity,
  });

  const isLoading = isClubLoading || isDealsLoading;

  return (
    <div id="best-deals">
      <div className="text-center mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          Best Deals Found
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We've searched across major retailers to find the best prices for your selected club.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 md:p-8">
          {isLoading ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                <Skeleton className="w-full md:w-1/3 h-48 mb-4 md:mb-0" />
                <Skeleton className="w-full md:w-2/3 h-48 md:h-48 md:ml-6" />
              </div>
              <Skeleton className="w-full h-80" />
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                  {clubType?.name === "Drivers" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M6 3l1 1 M9 4h10 M19 4l2 8 M21 12h-7 M14 12l-1 9 M13 21h-2 M7 4l6 17" 
                      />
                    </svg>
                  )}
                  
                  {clubType?.name === "Fairway Woods" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M6 4l1 1 M8 5h8 M16 5l2 7 M18 12h-5 M13 12l-1 9 M12 21h-2 M8 5l4 16" 
                      />
                    </svg>
                  )}
                  
                  {clubType?.name === "Hybrids" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M7 4l1 1 M9 5h6 M15 5l1 7 M16 12h-4 M12 12l-1 9 M11 21h-2 M9 5l3 16" 
                      />
                    </svg>
                  )}
                  
                  {clubType?.name === "Irons" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M6 4l1 1 M8 5h4 M12 5l1 16 M13 21h-2 M8 5l3 16 M12 8l-2 1 M12 11l-2 1" 
                      />
                    </svg>
                  )}
                  
                  {clubType?.name === "Wedges" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M7 4l1 1 M9 5h3 M12 5l1 16 M13 21h-2 M9 5l2.5 16 M12 8l-1.5 1 M12 11l-1.5 1 M12 15l-1.5 1" 
                      />
                    </svg>
                  )}
                  
                  {clubType?.name === "Putters" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M5 5h12 M17 5v16 M17 21h-10 M7 21v-2 M7 19h6 M13 19v-14 M7 15v-10" 
                      />
                    </svg>
                  )}
                  
                  {/* Default icon if club type is not recognized */}
                  {!clubType?.name && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-48 w-auto text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 18v-6 M8 10V4 M16 10V4 M9 9h6 M5 21v-7a2 2 0 012-2h10a2 2 0 012 2v7" 
                      />
                    </svg>
                  )}
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h3 className="font-bold text-xl mb-2">{club?.name}</h3>
                  <p className="text-gray-600 mb-4">{club?.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? 'text-amber-400' : i < 4.5 ? 'text-amber-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {i < 4.5 ? (
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          ) : (
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          )}
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">4.5/5 (324 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-2xl text-primary mr-4">
                      {formatPrice(club?.price)}
                    </span>
                    <span className="text-red-600 line-through text-sm">
                      {formatPrice((club?.price || 0) * 1.25)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-lg mb-4">Available at these retailers</h4>
                
                <div className="space-y-4">
                  {deals?.map((deal: RetailerDeal) => (
                    <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          {deal.imageUrl ? (
                            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg mr-4 overflow-hidden">
                              <img 
                                src={deal.imageUrl} 
                                alt={`${club?.name} at ${deal.retailerName}`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback to golf ball icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                    svg.setAttribute('viewBox', '0 0 24 24');
                                    svg.setAttribute('fill', 'none');
                                    svg.setAttribute('stroke', 'currentColor');
                                    svg.setAttribute('class', 'h-12 w-12 text-gray-400');
                                    
                                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                                    circle.setAttribute('cx', '12');
                                    circle.setAttribute('cy', '12');
                                    circle.setAttribute('r', '6');
                                    circle.setAttribute('stroke-width', '2');
                                    
                                    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    path1.setAttribute('stroke-linecap', 'round');
                                    path1.setAttribute('stroke-linejoin', 'round');
                                    path1.setAttribute('stroke-width', '1');
                                    path1.setAttribute('d', 'M12 6 Q 14 8 14 12 Q 14 16 12 18 M12 6 Q 10 8 10 12 Q 10 16 12 18');
                                    
                                    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    path2.setAttribute('stroke-linecap', 'round');
                                    path2.setAttribute('stroke-linejoin', 'round');
                                    path2.setAttribute('stroke-width', '1');
                                    path2.setAttribute('d', 'M8 10 Q 10 10 12 10 Q 14 10 16 10 M8 14 Q 10 14 12 14 Q 14 14 16 14');
                                    
                                    svg.appendChild(circle);
                                    svg.appendChild(path1);
                                    svg.appendChild(path2);
                                    parent.appendChild(svg);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-12 w-12 text-gray-400" 
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
                          )}
                          <div>
                            <h5 className="font-semibold">{deal.retailerName}</h5>
                            <div className="flex items-center text-sm text-gray-600">
                              {deal.inStock ? (
                                <span className="flex items-center">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-green-600 mr-1" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span>In stock • {deal.shipping === 0 ? 'Free shipping' : `£${deal.shipping / 100} shipping`}</span>
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-amber-600 mr-1" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  <span>{deal.shippingTime} • {deal.shipping === 0 ? 'Free shipping' : `£${deal.shipping / 100} shipping`}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="font-bold text-xl text-primary">
                              {formatPrice(deal.price)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {deal.shipping === 0 ? '+£0 shipping' : `+£${deal.shipping / 100} shipping`}
                            </div>
                          </div>
                          <Button 
                            className="bg-primary hover:bg-green-800 text-white font-semibold"
                            asChild
                          >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              Buy Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="text-primary hover:text-primary-dark font-semibold border-primary hover:border-primary-dark"
            >
              Back to Recommendations
            </Button>
            <Button
              onClick={onStartNewFitting}
              className="bg-primary hover:bg-green-800 text-white font-semibold"
            >
              Start New Fitting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
