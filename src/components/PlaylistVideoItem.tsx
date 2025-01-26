import { Button } from "@/components/ui/button";
import { Music, Play, X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface PlaylistVideoItemProps {
  item: Tables<"playlist_items">;
  onPlay: (videoId: string) => void;
  onRemove: (itemId: string) => void;
}

const PlaylistVideoItem = ({
  item,
  onPlay,
  onRemove,
}: PlaylistVideoItemProps) => {
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(item.youtube_url);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/default.jpg`
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="w-full sm:w-auto">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full sm:w-20 h-32 sm:h-14 object-cover rounded cursor-pointer"
            onClick={() => videoId && onPlay(videoId)}
          />
        ) : (
          <div className="w-full sm:w-20 h-32 sm:h-14 flex items-center justify-center bg-gray-200 rounded">
            <Music className="h-4 w-4 text-[#8B5CF6]" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 w-full">
        <p className="text-sm font-medium truncate">
          {item.title || "Untitled Video"}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {item.youtube_url}
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => videoId && onPlay(videoId)}
          className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10"
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaylistVideoItem;