import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Music, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMusicRecommendations } from "@/services/llm";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const formSchema = z.object({
  genre: z.string().min(1, "Please select a music genre"),
});

type FormValues = z.infer<typeof formSchema>;
 
const MusicRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult("");

    try {
      const response = await generateMusicRecommendations(values.genre);
      setResult(response);
      toast.success("Music recommendations generated successfully!");
    } catch (error) {
      toast.error("Failed to generate music recommendations. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const musicGenres = [
    { value: "hindi-pop", label: "Hindi Pop" },
    { value: "english-pop", label: "English Pop" },
    { value: "rock", label: "Rock" },
    { value: "rap", label: "Rap" },
    { value: "indie", label: "Indie" },
    { value: "electronic", label: "Electronic" },
    { value: "jazz", label: "Jazz" },
    { value: "classical", label: "Classical" },
    { value: "country", label: "Country" },
    { value: "r-and-b", label: "R&B" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Journey Music</h1>
          <p className="text-muted-foreground">Get personalized music recommendations for your travels</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-soft-lg h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-soft">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Music Preferences</CardTitle>
                  <CardDescription>Choose your favorite genre</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Music Genre</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {musicGenres.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-accent/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-accent-foreground">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium text-sm">AI-Powered Recommendations</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Our AI will curate personalized playlists perfect for different moments of your journey
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-soft transition-smooth hover:shadow-soft-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Curating Playlists...
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4 mr-2" />
                        Get Recommendations
                      </>
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
                  <p className="text-muted-foreground">Curating your perfect travel playlist...</p>
                </CardContent>
              </Card>
            )}

            {result && !isLoading && (
              <Card className="shadow-soft-lg">
                <CardHeader>
                  <CardTitle>Your Travel Playlists</CardTitle>
                  <CardDescription>Personalized music for your journey</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown>{result}</Streamdown>
                </CardContent>
              </Card>
            )}

            {!result && !isLoading && (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="p-12 text-center">
                  <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-6">
                    Select your favorite genre to get personalized music recommendations
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-medium text-foreground mb-1">🎵 Road Trip Vibes</div>
                      <div className="text-xs text-muted-foreground">Energetic tracks for the journey</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-medium text-foreground mb-1">🌅 Scenic Moments</div>
                      <div className="text-xs text-muted-foreground">Relaxing tunes for views</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-medium text-foreground mb-1">✨ Adventure Time</div>
                      <div className="text-xs text-muted-foreground">Upbeat songs for activities</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-medium text-foreground mb-1">🌙 Evening Chill</div>
                      <div className="text-xs text-muted-foreground">Mellow tracks to unwind</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicRecommendations;
