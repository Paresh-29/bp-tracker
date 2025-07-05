"use client";

import { useEffect, useState } from "react";
import { ReadingForm } from "./AddReadingForm";
import { ReadingCard } from "./ReadingCard";

interface Reading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
}

export function Dashboard({ userName }: { userName: string }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReadings = async () => {
    try {
      const res = await fetch("/api/readings");
      if (!res.ok) throw new Error("Failed to fetch readings");
      const data = await res.json();
      setReadings(data);
    } catch (err) {
      console.error("Error fetching readings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleReadingAdded = () => {
    fetchReadings();
  };

  const handleDelete = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Track your blood pressure readings and monitor your health.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Add New Reading</h2>
        <ReadingForm onReadingAdded={handleReadingAdded} />
      </div>

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Readings</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : readings.length === 0 ? (
          <p className="text-muted-foreground">No readings yet.</p>
        ) : (
          readings.map((reading) => (
            <ReadingCard
              key={reading.id}
              reading={reading}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
