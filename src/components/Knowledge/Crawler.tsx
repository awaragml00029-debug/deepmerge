"use client";
import { useState } from "react";
import { Button } from "@/components/Internal/Button";
import { Input } from "@/components/ui/input";

interface CrawlerProps {
  open: boolean;
  onClose: () => void;
}

export default function Crawler({ open, onClose }: CrawlerProps) {
  const [url, setUrl] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Add Web Page</h3>
        <Input
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            // TODO: Implement crawler logic
            onClose();
          }}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
