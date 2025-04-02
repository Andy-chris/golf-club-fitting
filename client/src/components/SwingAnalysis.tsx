import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SwingAnalysis as SwingAnalysisType } from "@/lib/types";

interface SwingAnalysisProps {
  profileId: number;
  onBack: () => void;
  onContinue: (analysisId: number) => void;
}

export function SwingAnalysis({ profileId, onBack, onContinue }: SwingAnalysisProps) {
  const { toast } = useToast();
  const webcamRef = useRef<Webcam>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [swingResults, setSwingResults] = useState<SwingAnalysisType | null>(null);

  const analyzeSwingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/analyze-swing", { profileId });
      return res.json();
    },
    onSuccess: (data) => {
      setSwingResults(data);
    },
    onError: (error) => {
      toast({
        title: "Error analyzing swing",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleEnableCamera = () => {
    setCameraEnabled(true);
  };

  const handleRecordSwing = () => {
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setRecordingComplete(true);
      analyzeSwingMutation.mutate();
    }, 3000);
  };

  const handleGetRecommendations = () => {
    if (swingResults) {
      onContinue(swingResults.id);
    }
  };

  return (
    <div id="swing-analysis">
      <div className="text-center mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          Analyze Your Swing
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Record your swing so we can analyze your technique and recommend the perfect clubs.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 md:p-8">
            {!cameraEnabled ? (
              <div id="camera-permission" className="text-center py-8">
                <p className="text-gray-600 mb-4">We need access to your camera to analyze your swing.</p>
                <Button
                  onClick={handleEnableCamera}
                  className="bg-primary hover:bg-green-800 text-white font-semibold"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Enable Camera
                </Button>
              </div>
            ) : (
              <div id="camera-view">
                <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-amber-400 rounded-lg">
                    <div className="text-white text-center p-4 bg-black bg-opacity-50 rounded">
                      <p className="font-semibold">Position yourself in frame</p>
                      <p className="text-sm">Stand so your full swing is visible</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <Button
                      onClick={handleRecordSwing}
                      disabled={isRecording || recordingComplete}
                      className={`font-semibold py-3 px-8 rounded-full transition-colors shadow-md mx-auto flex items-center
                        ${recordingComplete 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                        } text-white`}
                    >
                      {isRecording ? (
                        <>Recording...</>
                      ) : recordingComplete ? (
                        <>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Swing Recorded
                        </>
                      ) : (
                        <>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Record Swing
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>For best results:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Record in a well-lit area</li>
                      <li>• Position camera at hip height</li>
                      <li>• Capture your full swing</li>
                      <li>• Record from the side (down the target line)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {swingResults && (
              <div id="swing-results" className="mt-6">
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-3">Swing Analysis Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Swing Speed</p>
                      <p className="font-semibold">{swingResults.swingSpeed} mph</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Swing Path</p>
                      <p className="font-semibold">{swingResults.swingPath}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Club Face</p>
                      <p className="font-semibold">{swingResults.clubFace}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tempo</p>
                      <p className="font-semibold">{swingResults.tempo}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                className="text-primary hover:text-primary-dark font-semibold border-primary hover:border-primary-dark"
              >
                Back
              </Button>
              <Button
                onClick={handleGetRecommendations}
                disabled={!swingResults || analyzeSwingMutation.isPending}
                className="bg-primary hover:bg-green-800 text-white font-semibold"
              >
                {analyzeSwingMutation.isPending ? "Analyzing..." : "Get Recommendations"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
