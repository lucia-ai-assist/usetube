import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePlaylistManagement = (playlistId: string, onDelete?: () => void, onUpdate?: () => void) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    const { error } = await supabase
      .from("playlists")
      .delete()
      .eq("id", playlistId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete playlist",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Playlist deleted successfully",
    });
    onDelete?.();
  };

  const handleRemoveVideo = async (itemId: string) => {
    const { error } = await supabase
      .from("playlist_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove video",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Video removed successfully",
    });
    onUpdate?.();
  };

  return {
    handleDelete,
    handleRemoveVideo,
  };
};