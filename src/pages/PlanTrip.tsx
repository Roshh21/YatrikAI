import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTripPlan } from "@/services/llm";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import ItineraryCalendar from "@/components/trip/ItineraryCalendar";
import TripSummary from "@/components/trip/TripSummary";
import type { DayItinerary } from "@/types";
import { uniqueDestinations } from "@/data/locations";
 
const formSchema = z.object({
  origin: z.string().min(2, "Please select or enter your starting location"),
  destination: z.string().min(2, "Please select or enter your destination"),
  budget: z.coerce.number().min(5000, "Budget must be at least ₹5,000").max(10000000, "Budget cannot exceed ₹1,00,00,000"),
  travelers: z.coerce.number().min(1, "At least 1 traveler required").max(50, "Maximum 50 travelers"),
  travelStyle: z.enum(["relaxing", "adventurous"], {
    required_error: "Please select a travel style",
  }),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
});

type FormValues = z.infer<typeof formSchema>;

const PlanTrip = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [parsedItinerary, setParsedItinerary] = useState<DayItinerary[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "Bangalore, Karnataka",
      destination: "Ooty, Tamil Nadu",
      budget: 50000,
      travelers: 2,
      travelStyle: "relaxing",
      duration: 5,
    },
  });

  function parseItinerary(text: string): DayItinerary[] {
    const days: DayItinerary[] = [];
    const lines = text.split('\n');
    let currentDay: DayItinerary | null = null;

    for (const line of lines) {
      const dayMatch = line.match(/^#+\s*Day\s+(\d+)/i);
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          day: parseInt(dayMatch[1]),
          activities: [],
        };
        continue;
      }

      if (currentDay) {
        const timeMatch = line.match(/^[*-]?\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?(?:\s*[-–]\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)?)\s*[:-]\s*(.+)/i);
        if (timeMatch) {
          const activity = timeMatch[2].trim();
          const locationMatch = activity.match(/^(.+?)\s+(?:at|in|@)\s+(.+)$/i);
          
          let activityType: 'visit' | 'meal' | 'activity' | 'travel' | undefined;
          const lowerActivity = activity.toLowerCase();
          if (lowerActivity.includes('breakfast') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner') || lowerActivity.includes('meal') || lowerActivity.includes('eat')) {
            activityType = 'meal';
          } else if (lowerActivity.includes('visit') || lowerActivity.includes('museum') || lowerActivity.includes('temple') || lowerActivity.includes('fort')) {
            activityType = 'visit';
          } else if (lowerActivity.includes('travel') || lowerActivity.includes('drive') || lowerActivity.includes('flight')) {
            activityType = 'travel';
          } else {
            activityType = 'activity';
          }

          currentDay.activities.push({
            time: timeMatch[1].trim(),
            activity: locationMatch ? locationMatch[1].trim() : activity,
            location: locationMatch ? locationMatch[2].trim() : undefined,
            type: activityType,
          });
        }
      }
    }

    if (currentDay && currentDay.activities.length > 0) {
      days.push(currentDay);
    }

    return days;
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult("");
    setParsedItinerary([]);

    try {
      const response = await generateTripPlan(
        values.origin,
        values.destination,
        values.budget,
        values.travelers,
        values.travelStyle,
        values.duration
      );
      setResult(response);
      const parsed = parseItinerary(response);
      setParsedItinerary(parsed);
      toast.success("Trip plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate trip plan. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Plan Your Trip</h1>
          <p className="text-muted-foreground">Discover perfect destinations and get detailed itineraries</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-soft-lg h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-soft">
                  <MapPin className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle>Trip Preferences</CardTitle>
                  <CardDescription>Tell us about your ideal trip</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From (Origin)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your starting location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {uniqueDestinations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To (Destination)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Type or select destination (e.g., Ooty, Goa)" 
                            list="destinations"
                            {...field} 
                          />
                        </FormControl>
                        <datalist id="destinations">
                          {uniqueDestinations.map((location) => (
                            <option key={location} value={location} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget (₹ INR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="travelStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select travel style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="relaxing">Relaxing</SelectItem>
                            <SelectItem value="adventurous">Adventurous</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Duration (days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full shadow-soft transition-smooth hover:shadow-soft-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Planning...
                      </>
                    ) : (
                      "Generate Trip Plan"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {isLoading && (
              <Card className="shadow-soft">
                <CardContent className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Creating your perfect itinerary...</p>
                </CardContent>
              </Card>
            )}

            {result && !isLoading && (
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Calendar View
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Full Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                  {parsedItinerary.length > 0 ? (
                    <ItineraryCalendar itinerary={parsedItinerary} />
                  ) : (
                    <Card className="shadow-soft">
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">
                          Could not parse itinerary. Please check the Full Details tab.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="summary">
                  <TripSummary fullResponse={result} />
                </TabsContent>

                <TabsContent value="details">
                  <Card className="shadow-soft-lg">
                    <CardHeader>
                      <CardTitle>Your Trip Plan</CardTitle>
                      <CardDescription>Personalized itinerary and recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                      <Streamdown>{result}</Streamdown>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {!result && !isLoading && (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Fill in your preferences and click "Generate Trip Plan" to see recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
