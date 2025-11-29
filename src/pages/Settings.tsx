import { useTheme } from "next-themes";
import { Moon, Sun, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light Mode", icon: Sun, description: "Soft pink and lavender tones" },
    { value: "dark", label: "Dark Mode", icon: Moon, description: "Night sky with deep purple hues" },
  ];
 
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your YatrikAI experience</p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>Choose your preferred color theme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="grid gap-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth hover:shadow-soft ${
                        theme === option.value
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          theme === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button className="w-full shadow-soft">Primary Button</Button>
                  <Button variant="secondary" className="w-full">Secondary Button</Button>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Outline Button</Button>
                  <Button variant="ghost" className="w-full">Ghost Button</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
