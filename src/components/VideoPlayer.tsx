import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoPlayerProps {
  videoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ videoId, isOpen, onClose }: VideoPlayerProps) => {
  if (!videoId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;