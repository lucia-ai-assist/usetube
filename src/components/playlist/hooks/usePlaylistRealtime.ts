import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePlaylistRealtime = (playlistId: string, onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel(`playlist-${playlistId}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlist_items',
          filter: `playlist_id=eq.${playlistId}`,
        },
        () => {
          console.log('Playlist items changed, refreshing...');
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playlistId, onUpdate]);
};