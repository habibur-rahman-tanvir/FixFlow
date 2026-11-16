import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user/user.dto";
import { ReactNode } from "react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const UserDetails = ({
  user,
  renderUser,
}: {
  user: User;
  renderUser?: (user: User) => ReactNode;
}) => {
  if (renderUser) {
    return <>{renderUser(user)}</>;
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={user.avatar?.url} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{formatLabel(user.role)}</Badge>
          <Badge
            variant={user.userStatus === "active" ? "secondary" : "destructive"}
          >
            {formatLabel(user.userStatus)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
