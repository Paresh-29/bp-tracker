import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
}

interface ReadingCardProps {
  reading: Reading;
  onDelete?: (id: string) => void;
}

export function ReadingCard({ reading, onDelete }: ReadingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this reading? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/readings/${reading.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete reading");
      }

      toast.success("Reading deleted successfully");
      onDelete?.(reading.id);
    } catch (error) {
      toast.error("Failed to delete reading. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs">
              {formatDate(reading.recordedAt)}
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              <span className="sr-only">Delete Reading</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
