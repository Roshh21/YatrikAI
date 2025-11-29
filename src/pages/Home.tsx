import { Link } from "react-router-dom";
import { Calculator, MapPin, Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  // Welcome screen for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl font-bold gradient-text mb-6">
              Welcome to YatrikAI
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your intelligent travel companion for seamless journey planning
            </p>
          </div>
 
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto my-12">
            <Card className="border-2">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Budget Estimation</h3>
                <p className="text-sm text-muted-foreground">
                  Get accurate cost estimates for your trips
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold">Trip Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Discover destinations and detailed itineraries
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Music Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized playlists for your journey
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="shadow-soft-lg text-lg px-8">
              <Link to="/login">
                <LogIn className="w-5 h-5 mr-2" />
                Login to Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/signup">
                Create Account
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Start planning your perfect journey with AI-powered recommendations
          </p>
        </div>
      </div>
    );
  }

  // Main dashboard for authenticated users
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-4">
            Plan Your Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent travel companion for budget estimation, trip planning, and personalized experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-soft-lg transition-smooth border-2 hover:border-primary">
            <CardContent className="p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-soft group-hover:scale-110 transition-smooth">
                <Calculator className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  Estimate Your Budget
                </h2>
                <p className="text-muted-foreground">
                  Get accurate cost estimates based on your travel preferences, including transportation, accommodation, and daily expenses.
                </p>
              </div>

              <Button asChild size="lg" className="w-full shadow-soft transition-smooth hover:shadow-soft-lg">
                <Link to="/estimate-budget">
                  Start Estimating
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-soft-lg transition-smooth border-2 hover:border-secondary">
            <CardContent className="p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-soft group-hover:scale-110 transition-smooth">
                <MapPin className="w-8 h-8 text-secondary-foreground" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  Plan Your Trip
                </h2>
                <p className="text-muted-foreground">
                  Discover perfect destinations, get detailed itineraries, and find the best hotels and restaurants within your budget.
                </p>
              </div>

              <Button asChild size="lg" className="w-full shadow-soft transition-smooth hover:shadow-soft-lg">
                <Link to="/plan-trip">
                  Start Planning
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-accent/50 to-muted border-accent">
            <CardContent className="p-6 flex items-center justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <p className="text-foreground font-medium">
                  Get personalized music recommendations for your journey
                </p>
              </div>
              <Button asChild variant="secondary" className="shadow-soft">
                <Link to="/music-recommendations">
                  Discover Music
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
