"use client";
import { X } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface ResourceListProps {
  resources: Resource[];
  onRemove: (id: string) => void;
  className?: string;
}

export default function ResourceList({ resources, onRemove, className }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded"
          >
            <span className="text-sm truncate">{resource.name}</span>
            <button
              onClick={() => onRemove(resource.id)}
              className="ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
