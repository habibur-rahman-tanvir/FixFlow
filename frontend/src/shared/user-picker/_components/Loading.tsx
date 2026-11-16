import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex h-80 items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      Loading users...
    </div>
  );
};
