import { Calendar, Clock, MapPin, Utensils, Camera, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  time: string;
  activity: string;
  location?: string;
  type?: 'visit' | 'meal' | 'activity' | 'travel';
} 

interface DayItinerary {
  day: number;
  date?: string;
  activities: Activity[];
}

interface ItineraryCalendarProps {
  itinerary: DayItinerary[];
}

function getActivityIcon(type?: string) {
  switch (type) {
    case 'meal':
      return <Utensils className="w-4 h-4" />;
    case 'visit':
      return <Camera className="w-4 h-4" />;
    case 'travel':
      return <Car className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
}

function getActivityColor(type?: string) {
  switch (type) {
    case 'meal':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'visit':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'travel':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-green-100 text-green-700 border-green-200';
  }
}

export default function ItineraryCalendar({ itinerary }: ItineraryCalendarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
          <Calendar className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Your Itinerary</h2>
          <p className="text-sm text-muted-foreground">Day-by-day travel plan</p>
        </div>
      </div>

      <div className="grid gap-6">
        {itinerary.map((day) => (
          <Card key={day.day} className="shadow-soft-lg overflow-hidden border-2 hover:shadow-elegant transition-smooth">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                    <span className="text-lg font-bold text-primary-foreground">
                      {day.day}
                    </span>
                  </div>
                  <div>
                    <div className="text-xl font-bold">Day {day.day}</div>
                    {day.date && (
                      <div className="text-sm font-normal text-muted-foreground">{day.date}</div>
                    )}
                  </div>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {day.activities.length} activities
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {day.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-smooth group"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)} transition-smooth group-hover:scale-110`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{activity.time}</span>
                        </div>
                        {activity.type && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {activity.type}
                          </Badge>
                        )}
                      </div>

                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">
                        {activity.activity}
                      </h4>

                      {activity.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
