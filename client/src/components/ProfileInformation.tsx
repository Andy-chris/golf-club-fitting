import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BALL_FLIGHT_OPTIONS, 
  GENDER_OPTIONS, 
  HANDICAP_OPTIONS,
  HEIGHT_FEET_OPTIONS,
  HEIGHT_INCHES_OPTIONS,
  PRIORITY_OPTIONS 
} from "@/lib/constants";
import { ProfileFormData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProfileInformationProps {
  onBack: () => void;
  onContinue: (profileId: number) => void;
}

export function ProfileInformation({ onBack, onContinue }: ProfileInformationProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    heightFeet: 5,
    heightInches: 9,
    weight: 175,
    age: 35,
    gender: "",
    handicap: "",
    ballFlight: "",
    swingSpeed: undefined,
    priority: ""
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("POST", "/api/profiles", data);
      return res.json();
    },
    onSuccess: (data) => {
      onContinue(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const requiredFields: (keyof ProfileFormData)[] = [
      "heightFeet", "heightInches", "weight", "age", 
      "gender", "handicap", "ballFlight", "priority"
    ];
    
    const emptyFields = requiredFields.filter(field => 
      formData[field] === "" || formData[field] === undefined
    );
    
    if (emptyFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: "All fields are required to create your profile",
        variant: "destructive"
      });
      return;
    }
    
    createProfileMutation.mutate(formData);
  };

  return (
    <div id="profile-information">
      <div className="text-center mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We'll use this information to recommend the perfect clubs for your physical characteristics and playing style.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="height" className="block text-gray-900 font-medium mb-2">Height</Label>
                <div className="flex">
                  <Select 
                    value={formData.heightFeet.toString()} 
                    onValueChange={(val) => handleChange("heightFeet", parseInt(val))}
                  >
                    <SelectTrigger className="w-1/2 mr-2">
                      <SelectValue placeholder="Feet" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEIGHT_FEET_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={formData.heightInches.toString()} 
                    onValueChange={(val) => handleChange("heightInches", parseInt(val))}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Inches" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEIGHT_INCHES_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="weight" className="block text-gray-900 font-medium mb-2">Weight (lbs)</Label>
                <Input
                  type="number"
                  id="weight"
                  placeholder="Enter your weight"
                  value={formData.weight || ""}
                  onChange={(e) => handleChange("weight", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="age" className="block text-gray-900 font-medium mb-2">Age</Label>
                <Input
                  type="number"
                  id="age"
                  placeholder="Enter your age"
                  value={formData.age || ""}
                  onChange={(e) => handleChange("age", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="gender" className="block text-gray-900 font-medium mb-2">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="handicap" className="block text-gray-900 font-medium mb-2">Handicap</Label>
                <Select 
                  value={formData.handicap} 
                  onValueChange={(val) => handleChange("handicap", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select handicap range" />
                  </SelectTrigger>
                  <SelectContent>
                    {HANDICAP_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ballFlight" className="block text-gray-900 font-medium mb-2">Typical Ball Flight</Label>
                <Select 
                  value={formData.ballFlight} 
                  onValueChange={(val) => handleChange("ballFlight", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select typical ball flight" />
                  </SelectTrigger>
                  <SelectContent>
                    {BALL_FLIGHT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="swingSpeed" className="block text-gray-900 font-medium mb-2">Swing Speed (if known)</Label>
                <Input
                  type="number"
                  id="swingSpeed"
                  placeholder="Enter swing speed in mph"
                  value={formData.swingSpeed || ""}
                  onChange={(e) => handleChange("swingSpeed", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="priority" className="block text-gray-900 font-medium mb-2">What's most important to you?</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(val) => handleChange("priority", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="text-primary hover:text-primary-dark font-semibold border-primary hover:border-primary-dark"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={createProfileMutation.isPending}
                className="bg-primary hover:bg-green-800 text-white font-semibold"
              >
                {createProfileMutation.isPending ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
