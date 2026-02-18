import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, Rocket, Sparkles } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
}

export function PlaceholderPage({ 
  title, 
  description, 
  icon = <Construction className="w-16 h-16 text-primary" />,
  features = []
}: PlaceholderPageProps) {
  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {icon}
          </div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Planned Features
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
            <p className="text-muted-foreground">
              This feature is currently under development and will be available soon.
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
