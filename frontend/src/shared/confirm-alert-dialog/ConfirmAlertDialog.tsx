"use client";

import { Button } from "@/components/ui/button";

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
import { JSXElementConstructor, ReactElement } from "react";
import {
  ComponentRenderFn,
  DialogTriggerState,
  HTMLProps,
} from "@base-ui/react";
import { cn } from "cn";

type ConfirmAlertDialogProps = {
  className?: string;

  onConfirm?: () => void;

  render?:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>;
};

export function ConfirmAlertDialog(props: ConfirmAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          props.render ?? (
            <Button variant="outline" className={cn(props.className)}>
              Show Dialog
            </Button>
          )
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => props.onConfirm?.()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
