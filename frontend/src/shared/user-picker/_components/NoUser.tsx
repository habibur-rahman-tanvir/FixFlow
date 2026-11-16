import { Users } from "lucide-react";

export const NoUser = ({ emptyMessage }: { emptyMessage?: string }) => {
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-2 text-center">
      <Users className="size-9 text-muted-foreground" />

      <p className="text-sm font-medium">No users found</p>

      <p className="text-xs text-muted-foreground">
        {emptyMessage ?? "Try changing your search or filters."}
      </p>
    </div>
  );
};
