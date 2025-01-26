import { deleteImage } from "@/actions/image-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";

interface DeleteImageProps {
  imageId: string;
  onDelete?: () => void;
  className?: string;
  imageName: string;
}

const DeleteImage = ({
  imageId,
  onDelete,
  className,
  imageName,
}: DeleteImageProps) => {
  const toastId = useId();

  const handleDelete = async () => {
    toast.loading("Deleting image", { id: toastId });
    const { error, success } = await deleteImage(imageId, imageName);
    if (error) {
      toast.error(error, { id: toastId });
    } else if (success) {
      toast.success("Image deleted successfully", { id: toastId });
      onDelete?.();
    } else {
      toast.dismiss();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className={cn("w-fit", className)}>
          <Trash2 className="size-4 mr-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteImage;
