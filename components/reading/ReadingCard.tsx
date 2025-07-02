import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
}

interface ReadingCardProps {
  reading: Reading;
}

export function ReadingCard({ reading }: ReadingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80)
      return { label: "Normal", variant: "default" as const };
    if (systolic < 130 && diastolic < 80)
      return { label: "Elevated", variant: "secondary" as const };
    if (systolic < 140 || diastolic < 90)
      return { label: "High Stage 1", variant: "destructive" as const };
    return { label: "High Stage 2", variant: "destructive" as const };
  };

  const category = getBPCategory(reading.systolic, reading.diastolic);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                {reading.systolic}/{reading.diastolic}
              </span>
              <span className="text-sm text-muted-foreground">mmHg</span>
              <Badge variant={category.variant} className="text-xs">
                {category.label}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Pulse: <span className="font-medium">{reading.pulse} bpm</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {formatDate(reading.recordedAt)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
