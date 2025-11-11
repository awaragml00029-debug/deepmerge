"use client";

interface KnowledgeProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Knowledge({ open, onClose }: KnowledgeProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <p className="text-muted-foreground">Knowledge base coming soon...</p>
      </div>
    </div>
  );
}
