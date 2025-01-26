import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PlaylistHeaderProps {
  name: string;
  onDelete?: () => void;
}

const PlaylistHeader = ({ name, onDelete }: PlaylistHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-xl font-bold truncate">{name}</CardTitle>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-100 ml-2"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </CardHeader>
  );
};

export default PlaylistHeader;