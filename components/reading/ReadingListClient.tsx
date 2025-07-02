"use client";

import { useState, useEffect } from "react";
import { ReadingCard } from "./ReadingCard";

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
}

export function ReadingsListClient() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadings() {
      try {
        const response = await fetch("/api/readings");

        if (!response.ok) {
          throw new Error("Failed to fetch readings");
        }

        const data = await response.json();
        setReadings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReadings();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive">
          <p className="text-lg font-medium">Error loading readings</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No readings yet</p>
          <p className="text-sm">
            Add your first blood pressure reading above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {readings.length} reading{readings.length !== 1 ? "s" : ""} recorded
      </div>
      <div className="grid gap-4">
        {readings.map((reading) => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </div>
    </div>
  );
}
