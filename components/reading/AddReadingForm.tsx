"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ReadingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systolic: Number.parseInt(formData.systolic),
          diastolic: Number.parseInt(formData.diastolic),
          pulse: Number.parseInt(formData.pulse),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reading");
      }

      // Reset form
      setFormData({ systolic: "", diastolic: "", pulse: "" });

      // Refresh the page to show new reading
      router.refresh();

      toast.success("Reading added successfully!");
    } catch (error) {
      toast.error("Failed to add reading. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Blood Pressure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Systolic (mmHg)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={formData.systolic}
                onChange={handleInputChange("systolic")}
                min="70"
                max="250"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={formData.diastolic}
                onChange={handleInputChange("diastolic")}
                min="40"
                max="150"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (bpm)</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={formData.pulse}
                onChange={handleInputChange("pulse")}
                min="40"
                max="200"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Adding..." : "Add Reading"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
