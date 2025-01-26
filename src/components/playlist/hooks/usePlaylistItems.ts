import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

export const usePlaylistItems = (playlistId: string) => {
  const { toast } = useToast();
  const [items, setItems] = useState<Tables<"playlist_items">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("playlist_items")
      .select("*")
      .eq("playlist_id", playlistId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch playlist items",
      });
      return;
    }

    setItems(data || []);
  };

  return {
    items,
    isLoading,
    setIsLoading,
    fetchItems,
  };
};