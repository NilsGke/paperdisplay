import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { env } from "@/env";
import { ReactNode } from "react";

export default function DeleteImageDialog({
  imageName,
  removeImage,
  children,
}: {
  imageName: string;
  removeImage: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Sure you want to delete <u>{imageName}</u>
          </DialogTitle>
          <DialogDescription>
            You cannot recover this image after deletion
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <img
            className="w-full h-auto rounded"
            src={`/api/images/${imageName}`}
            alt={`your image: ${imageName}`}
            height={env.VITE_CANVAS_HEIGHT}
            width={env.VITE_CANVAS_WIDTH}
          />
        </div>
        <DialogFooter className="flex justify-between w-full">
          <Button
            type="submit"
            className="px-3"
            variant="destructive"
            onClick={removeImage}
          >
            <TrashIcon /> Remove Image forever
          </Button>
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
