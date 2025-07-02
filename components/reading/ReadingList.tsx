"use client";

import { ReadingCard } from "./ReadingCard";
import { useState, useEffect } from "react";

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
}

export function ReadingsList() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadings() {
      try {
        const res = await fetch("/api/readings");
        if (!res.ok) {
          throw new Error("Failed to fetch readings");
        }
        const data = await res.json();
        setReadings(data);
      } catch (error) {
        console.error("Error fetching readings:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReadings();
  }, [readings.length]);

  if (isloading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading readings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load readings.
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
