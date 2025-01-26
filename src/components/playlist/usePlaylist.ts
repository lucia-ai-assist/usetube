import { Tables } from "@/integrations/supabase/types";
import { usePlaylistItems } from "./hooks/usePlaylistItems";
import { usePlaylistOperations } from "./hooks/usePlaylistOperations";
import { usePlaylistRealtime } from "./hooks/usePlaylistRealtime";

export const usePlaylist = (playlist: Tables<"playlists">, onDelete: () => void) => {
  const {
    items,
    isLoading,
    setIsLoading,
    fetchItems,
  } = usePlaylistItems(playlist.id);

  const {
    handleDelete,
    handleRemoveVideo,
  } = usePlaylistOperations(playlist.id, onDelete, fetchItems);

  // Set up realtime subscription
  usePlaylistRealtime(playlist.id, fetchItems);

  return {
    items,
    isLoading,
    setIsLoading,
    fetchItems,
    handleDelete,
    handleRemoveVideo,
  };
};