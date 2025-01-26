import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Music, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import PlaylistCard from "@/components/PlaylistCard";
import { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<Tables<"playlists">[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();
    fetchPlaylists();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPlaylists = async () => {
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch playlists",
      });
      return;
    }

    setPlaylists(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleCreatePlaylist = async (name: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a playlist",
      });
      return;
    }

    const { error } = await supabase
      .from("playlists")
      .insert({
        name,
        user_id: session.user.id
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create playlist",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
    fetchPlaylists();
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgba(147,39,143,1)] via-[rgba(234,172,232,1)] to-[rgba(246,219,245,1)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Usetube Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-center sm:text-left">
                Your Playlists
              </h1>
              <p className="text-white/80 text-sm">
                Organize and manage your YouTube videos
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-white/90 hover:bg-white text-[#8B5CF6] w-full sm:w-auto font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" /> New Playlist
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full sm:w-auto text-white hover:bg-white/20"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
            <Music className="mx-auto h-12 w-12 text-[#8B5CF6] mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No playlists yet
            </h2>
            <p className="text-gray-600">
              Create your first playlist to start organizing your favorite videos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onDelete={fetchPlaylists}
              />
            ))}
          </div>
        )}

        <CreatePlaylistDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePlaylist}
        />
      </div>
    </div>
  );
};

export default Dashboard;