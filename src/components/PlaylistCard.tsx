import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import VideoPlayer from "./VideoPlayer";
import PlaylistHeader from "./playlist/PlaylistHeader";
import PlaylistContent from "./playlist/PlaylistContent";
import { usePlaylist } from "./playlist/usePlaylist";
import { useVideoManagement } from "./playlist/useVideoManagement";

interface PlaylistCardProps {
  playlist: Tables<"playlists">;
  onDelete: () => void;
}

const PlaylistCard = ({ playlist, onDelete }: PlaylistCardProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const {
    items,
    isLoading,
    setIsLoading,
    fetchItems,
    handleDelete,
    handleRemoveVideo,
  } = usePlaylist(playlist, onDelete);

  const { handleAddVideo } = useVideoManagement(playlist, setIsLoading, fetchItems);

  useEffect(() => {
    fetchItems();
  }, [playlist.id]);

  return (
    <>
      <Card className="w-full bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <PlaylistHeader 
          name={playlist.name} 
          onDelete={handleDelete}
        />
        <PlaylistContent
          items={items}
          isLoading={isLoading}
          onAddVideo={handleAddVideo}
          onPlayVideo={setSelectedVideoId}
          onRemoveVideo={handleRemoveVideo}
        />
      </Card>
      <VideoPlayer
        videoId={selectedVideoId}
        isOpen={!!selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
      />
    </>
  );
};

export default PlaylistCard;