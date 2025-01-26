import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddVideoFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

const AddVideoForm = ({ onSubmit, isLoading }: AddVideoFormProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    await onSubmit(youtubeUrl);
    setYoutubeUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Paste YouTube URL"
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default AddVideoForm;