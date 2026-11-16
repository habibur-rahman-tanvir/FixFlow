import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

export const InitialError = ({
  initialError,
  setReloadKey,
}: {
  initialError: string;
  setReloadKey: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-destructive">{initialError}</p>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setReloadKey((current) => current + 1)}
      >
        Try again
      </Button>
    </div>
  );
};
