import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, FileText } from "lucide-react";

interface PersonalNotesProps {
  initialContent: string | null;
  indicatorId: number;
  onSave: (content: string) => Promise<void>;
  className?: string;
}

export function PersonalNotes({ initialContent, indicatorId, onSave, className }: PersonalNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editContent);
      setContent(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isEmpty = !content.trim();

  return (
    <div className={`bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Personal Notes
        </h2>

        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="w-4 h-4" />
            {isEmpty ? "Add Note" : "Edit"}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="space-y-4 h-full flex flex-col">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write your notes here... (Markdown supported)"
              className="w-full flex-1 min-h-[200px] p-4 rounded-lg border border-border bg-background text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <div className="flex justify-end gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No notes yet. Click "Add Note" to start.</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none h-full overflow-y-auto pr-2 custom-scrollbar">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mt-3 mb-2 text-foreground">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-medium mt-2 mb-1 text-foreground">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-foreground leading-relaxed mb-2">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-sm text-foreground mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-sm text-foreground mb-2">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="p-3 rounded-lg bg-muted overflow-x-auto text-sm">{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

