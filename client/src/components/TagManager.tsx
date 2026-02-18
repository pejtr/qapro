import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Tag as TagIcon, Edit2 } from "lucide-react";

export interface JobTag {
  id: number;
  name: string;
  color: string;
  userId: number;
  createdAt: Date;
}

interface TagManagerProps {
  tags: JobTag[];
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: number) => void;
  onUpdateTag: (tagId: number, name: string, color: string) => void;
}

const TAG_COLORS = [
  { name: "blue", label: "Blue", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { name: "green", label: "Green", class: "bg-green-500/10 text-green-500 border-green-500/20" },
  { name: "purple", label: "Purple", class: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { name: "amber", label: "Amber", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { name: "red", label: "Red", class: "bg-red-500/10 text-red-500 border-red-500/20" },
  { name: "pink", label: "Pink", class: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { name: "cyan", label: "Cyan", class: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { name: "orange", label: "Orange", class: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { name: "teal", label: "Teal", class: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
  { name: "indigo", label: "Indigo", class: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
];

export function getTagColorClass(color: string): string {
  const tagColor = TAG_COLORS.find(c => c.name === color);
  return tagColor?.class || TAG_COLORS[0].class;
}

export function TagManager({ tags, onCreateTag, onDeleteTag, onUpdateTag }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("blue");
  const [editingTag, setEditingTag] = useState<JobTag | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setNewTagColor("blue");
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && editName.trim()) {
      onUpdateTag(editingTag.id, editName.trim(), editColor);
      setEditingTag(null);
      setEditName("");
      setEditColor("");
    }
  };

  const startEdit = (tag: JobTag) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditName("");
    setEditColor("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TagIcon className="h-4 w-4 mr-2" />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Job Tags</DialogTitle>
          <DialogDescription>
            Create and organize custom tags to categorize your job listings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Tag */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Create New Tag</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name (e.g., High Priority, Remote Only)"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateTag();
                  }
                }}
                className="flex-1 border-2"
              />
              <Select value={newTagColor} onValueChange={setNewTagColor}>
                <SelectTrigger className="w-32 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAG_COLORS.map((color) => (
                    <SelectItem key={color.name} value={color.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color.class}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing Tags */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Your Tags ({tags.length})</h3>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tags yet. Create your first tag above!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 rounded-lg border glass-card"
                  >
                    {editingTag?.id === tag.id ? (
                      // Edit Mode
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 border-2"
                          autoFocus
                        />
                        <Select value={editColor} onValueChange={setEditColor}>
                          <SelectTrigger className="w-32 border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TAG_COLORS.map((color) => (
                              <SelectItem key={color.name} value={color.name}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${color.class}`} />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleUpdateTag}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <Badge className={getTagColorClass(tag.color)}>
                          {tag.name}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(tag)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteTag(tag.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color Legend */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <Badge key={color.name} className={color.class}>
                  {color.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
