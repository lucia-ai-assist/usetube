import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

export const useVideoManagement = (
  playlist: Tables<"playlists">,
  setIsLoading: (value: boolean) => void,
  fetchItems: () => Promise<void>
) => {
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const checkVideoExists = async (youtubeUrl: string) => {
    const { data, error } = await supabase
      .from("playlist_items")
      .select("id")
      .eq("playlist_id", playlist.id)
      .eq("youtube_url", youtubeUrl.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking video existence:", error);
      return true;
    }

    return !!data;
  };

  const handleAddVideo = async (youtubeUrl: string) => {
    setIsLoading(true);
    const videoId = extractVideoId(youtubeUrl.trim());
    
    if (!videoId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid YouTube URL",
      });
      setIsLoading(false);
      return;
    }

    try {
      const exists = await checkVideoExists(youtubeUrl.trim());
      if (exists) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This video is already in the playlist",
        });
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase.functions.invoke('get-youtube-video', {
        body: { videoId }
      });

      if (fetchError) throw fetchError;

      const videoTitle = data.items[0]?.snippet?.title || "Untitled Video";

      const { error } = await supabase
        .from("playlist_items")
        .insert([
          {
            playlist_id: playlist.id,
            youtube_url: youtubeUrl.trim(),
            title: videoTitle,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video added successfully",
      });
      fetchItems();
    } catch (error) {
      console.error('Error adding video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add video",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAddVideo,
  };
};