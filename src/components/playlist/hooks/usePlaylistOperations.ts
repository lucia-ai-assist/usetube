import { usePlaylistManagement } from "./usePlaylistManagement";

export const usePlaylistOperations = (playlistId: string, onDelete?: () => void, onUpdate?: () => void) => {
  const { handleDelete, handleRemoveVideo } = usePlaylistManagement(playlistId, onDelete, onUpdate);

  return {
    handleDelete,
    handleRemoveVideo,
  };
};