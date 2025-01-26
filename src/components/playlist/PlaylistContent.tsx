import { CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import AddVideoForm from "../AddVideoForm";
import PlaylistVideoItem from "../PlaylistVideoItem";

interface PlaylistContentProps {
  items: Tables<"playlist_items">[];
  isLoading: boolean;
  onAddVideo: (url: string) => Promise<void>;
  onPlayVideo: (videoId: string) => void;
  onRemoveVideo: (itemId: string) => Promise<void>;
}

const PlaylistContent = ({
  items,
  isLoading,
  onAddVideo,
  onPlayVideo,
  onRemoveVideo,
}: PlaylistContentProps) => {
  return (
    <CardContent>
      <div className="w-full md:max-w-xl mx-auto">
        <AddVideoForm onSubmit={onAddVideo} isLoading={isLoading} />
        <div className="space-y-2 mt-4">
          {items.map((item) => (
            <PlaylistVideoItem
              key={item.id}
              item={item}
              onPlay={onPlayVideo}
              onRemove={onRemoveVideo}
            />
          ))}
        </div>
      </div>
    </CardContent>
  );
};

export default PlaylistContent;