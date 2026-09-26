"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
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
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import type { ActionResult } from "@/shared/libs/actionResult";

type ConfirmDeleteButtonProps = {
  itemName: string;
  /** A server action already bound to the item id: `deleteX.bind(null, id)`. */
  onConfirm: () => Promise<ActionResult<unknown>>;
  description?: string;
  /** Where to go after deleting (default: refresh the current page). */
  redirectTo?: string;
};

export const ConfirmDeleteButton = ({
  itemName,
  onConfirm,
  description,
  redirectTo,
}: ConfirmDeleteButtonProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Deleted ${itemName}`);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Delete ${itemName}`} disabled={pending}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>{description ?? "This can't be undone."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
