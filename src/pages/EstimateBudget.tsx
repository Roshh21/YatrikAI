import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBudgetEstimate } from "@/services/llm";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import TripSummary from "@/components/trip/TripSummary";
import { uniqueDestinations } from "@/data/locations";

const formSchema = z.object({
  origin: z.string().min(2, "Please select or enter your starting location"),
  destination: z.string().min(2, "Please select or enter your destination"),
  days: z.coerce.number().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
  travelers: z.coerce.number().min(1, "At least 1 traveler required").max(50, "Maximum 50 travelers"),
  transportation: z.enum(["public", "personal", "flight"], {
    required_error: "Please select a transportation mode",
  }),
  accommodation: z.enum(["hostel", "hotel", "luxury"], {
    required_error: "Please select an accommodation type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EstimateBudget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "Bangalore, Karnataka",
      destination: "Ooty, Tamil Nadu",
      days: 3,
      travelers: 2,
      transportation: "public",
      accommodation: "hotel",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult("");

    try {
      const response = await generateBudgetEstimate(
        values.origin,
        values.destination,
        values.days,
        values.travelers,
        values.transportation,
        values.accommodation
      );
      setResult(response);
      toast.success("Budget estimate generated successfully!");
    } catch (error) {
      toast.error("Failed to generate budget estimate. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Estimate Your Budget</h1>
          <p className="text-muted-foreground">Get accurate cost estimates for your upcoming trip</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-soft-lg h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-soft">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Trip Details</CardTitle>
                  <CardDescription>Enter your travel information</CardDescription>
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
                            list="destinations-estimate"
                            {...field} 
                          />
                        </FormControl>
                        <datalist id="destinations-estimate">
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
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Days</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
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
                    name="transportation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transportation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">Public Transport</SelectItem>
                            <SelectItem value="personal">Personal Vehicle</SelectItem>
                            <SelectItem value="flight">Flight</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accommodation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accommodation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hostel">Hostel</SelectItem>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
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
                        Calculating...
                      </>
                    ) : (
                      "Calculate Budget"
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
                  <p className="text-muted-foreground">Analyzing your trip details...</p>
                </CardContent>
              </Card>
            )}

            {result && !isLoading && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Detailed Breakdown
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card className="shadow-soft-lg">
                    <CardHeader>
                      <CardTitle>Budget Estimate</CardTitle>
                      <CardDescription>Detailed cost breakdown for your trip</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                      <Streamdown>{result}</Streamdown>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summary">
                  <TripSummary fullResponse={result} />
                </TabsContent>
              </Tabs>
            )}

            {!result && !isLoading && (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Fill in the form and click "Calculate Budget" to see your estimate
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

export default EstimateBudget; 
