"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/axios/client";
import InfiniteScroll from "react-infinite-scroll-component";

import { Loader2, Search, Users, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

const USER_ROLES = [
  "visitor",
  "member",
  "admin",
  "manager",
  "technician",
] as const;

type Role = (typeof USER_ROLES)[number];

type UserStatus = "active" | "suspended" | "deleted";

type SortField = "name" | "email" | "createdAt" | "updatedAt";

type SortOrder = "asc" | "desc";

type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  userStatus: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  avatar?: {
    url?: string;
    publicId?: string;
  } | null;
};

type UsersApiResponse = {
  status: "success";
  message: string;
  data: User[];
  pagination: {
    total: number;
    skip: number;
    limit: number;
    hasNextPage: boolean;
  };
};

type CommonProps = {
  role?: Role | Role[];

  pageSize?: number;
  maxSelections?: number;

  title?: string;
  description?: string;
  triggerLabel?: string;
  confirmLabel?: string;

  searchPlaceholder?: string;
  emptyMessage?: string;

  showSearch?: boolean;
  showSort?: boolean;
  showRoleFilter?: boolean;

  required?: boolean;
  disabled?: boolean;

  renderUser?: (user: User) => ReactNode;
};

type SingleUserPickerProps = CommonProps & {
  multiselect?: false;

  value?: User | null;
  defaultValue?: User | null;

  onChange?: (user: User | null) => void;
  onPick?: (user: User) => void;
};

type MultipleUserPickerProps = CommonProps & {
  multiselect: true;

  value?: User[];
  defaultValue?: User[];

  onChange?: (users: User[]) => void;
  onPick?: (users: User[]) => void;
};

type UserPickerProps = SingleUserPickerProps | MultipleUserPickerProps;

type SortOption = `${SortField}:${SortOrder}`;

type PaginationState = {
  skip: number;
  hasMore: boolean;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "createdAt:desc",
    label: "Newest first",
  },
  {
    value: "createdAt:asc",
    label: "Oldest first",
  },
  {
    value: "name:asc",
    label: "Name: A to Z",
  },
  {
    value: "name:desc",
    label: "Name: Z to A",
  },
  {
    value: "email:asc",
    label: "Email: A to Z",
  },
  {
    value: "updatedAt:desc",
    label: "Recently updated",
  },
  {
    value: "updatedAt:asc",
    label: "Least recently updated",
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

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

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    message?: string;
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  return apiError.response?.data?.message || apiError.message || fallback;
}

// -----------------------------------------------------------------------------
// User Details
// -----------------------------------------------------------------------------

function UserDetails({
  user,
  renderUser,
}: {
  user: User;
  renderUser?: (user: User) => ReactNode;
}) {
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
}

// -----------------------------------------------------------------------------
// User Picker
// -----------------------------------------------------------------------------

export function UserPicker(props: UserPickerProps) {
  const multiselect = props.multiselect === true;

  const pageSize = Number.isFinite(props.pageSize)
    ? Math.min(50, Math.max(1, Math.floor(props.pageSize!)))
    : 20;

  const maxSelections =
    props.multiselect === true ? props.maxSelections : undefined;

  // ---------------------------------------------------------------------------
  // Allowed roles
  // ---------------------------------------------------------------------------

  const configuredRoles: Role[] =
    props.role === undefined
      ? [...USER_ROLES]
      : Array.isArray(props.role)
        ? [...props.role]
        : [props.role];

  const configuredRolesKey = configuredRoles.join(",");

  // ---------------------------------------------------------------------------
  // Selection state
  // ---------------------------------------------------------------------------

  const [internalSelected, setInternalSelected] = useState<User[]>(() => {
    if (props.multiselect === true) {
      return props.defaultValue ?? [];
    }

    return props.defaultValue ? [props.defaultValue] : [];
  });

  // value undefined = uncontrolled
  // value provided = controlled

  const isControlled = props.value !== undefined;

  let selectedUsers: User[];

  if (isControlled) {
    if (props.multiselect === true) {
      selectedUsers = props.value ?? [];
    } else {
      selectedUsers = props.value ? [props.value] : [];
    }
  } else {
    selectedUsers = internalSelected;
  }

  // Draft selection:
  // Changes are committed only after clicking Confirm.

  const [draftUsers, setDraftUsers] = useState<User[]>([]);

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Search, filter and sorting state
  // ---------------------------------------------------------------------------

  const [searchValue, setSearchValue] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const [sortValue, setSortValue] = useState<SortOption>("createdAt:desc");

  const [reloadKey, setReloadKey] = useState(0);

  const [sortBy, order] = sortValue.split(":") as [SortField, SortOrder];

  const queryRoles: Role[] =
    roleFilter === "all"
      ? configuredRoles
      : configuredRoles.includes(roleFilter)
        ? [roleFilter]
        : configuredRoles;

  const queryRolesKey = queryRoles.join(",");

  const showSearch = props.showSearch !== false;
  const showSort = props.showSort !== false;

  const showRoleFilter =
    props.showRoleFilter !== false && configuredRoles.length > 1;

  // ---------------------------------------------------------------------------
  // Users state
  // ---------------------------------------------------------------------------

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(false);

  const [initialError, setInitialError] = useState<string | null>(null);

  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Request management
  // ---------------------------------------------------------------------------

  const controllerRef = useRef<AbortController | null>(null);

  const requestLock = useRef(false);

  const paginationRef = useRef<PaginationState>({
    skip: 0,
    hasMore: false,
  });

  const componentId = useId().replace(/:/g, "");

  // ---------------------------------------------------------------------------
  // Debounce search
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // ---------------------------------------------------------------------------
  // Reset invalid role filter
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (roleFilter !== "all" && !configuredRoles.includes(roleFilter)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoleFilter("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredRolesKey, roleFilter]);

  // ---------------------------------------------------------------------------
  // Fetch first page
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    if (!queryRolesKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers([]);
      setHasMore(false);
      setLoading(false);
      setInitialError(null);

      paginationRef.current = {
        skip: 0,
        hasMore: false,
      };

      return;
    }

    let active = true;

    const controller = new AbortController();

    controllerRef.current = controller;

    requestLock.current = true;

    paginationRef.current = {
      skip: 0,
      hasMore: false,
    };

    setUsers([]);
    setHasMore(false);
    setLoading(true);
    setLoadingMore(false);

    setInitialError(null);
    setLoadMoreError(null);

    const loadUsers = async () => {
      try {
        const response = await api.get<UsersApiResponse>("/api/users", {
          params: {
            skip: 0,
            limit: pageSize,
            search: debouncedSearch || undefined,
            role: queryRolesKey,
            sortBy,
            order,
          },
          signal: controller.signal,
        });

        if (!active) return;

        const fetchedUsers = response.data.data;

        setUsers(fetchedUsers);

        const nextHasMore =
          response.data.pagination.hasNextPage && fetchedUsers.length > 0;

        paginationRef.current = {
          skip: response.data.pagination.skip + fetchedUsers.length,
          hasMore: nextHasMore,
        };

        setHasMore(nextHasMore);
      } catch (error) {
        if (!active || controller.signal.aborted) return;

        setInitialError(getErrorMessage(error, "Unable to load users."));
      } finally {
        if (active) {
          requestLock.current = false;
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      active = false;

      controller.abort();

      if (controllerRef.current === controller) {
        controllerRef.current = null;
        requestLock.current = false;
      }
    };
  }, [
    open,
    pageSize,
    debouncedSearch,
    queryRolesKey,
    sortBy,
    order,
    reloadKey,
  ]);

  // ---------------------------------------------------------------------------
  // Fetch next page
  // ---------------------------------------------------------------------------

  const loadNextPage = useCallback(async () => {
    const controller = controllerRef.current;

    if (
      !controller ||
      controller.signal.aborted ||
      requestLock.current ||
      !paginationRef.current.hasMore
    ) {
      return;
    }

    requestLock.current = true;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await api.get<UsersApiResponse>("/api/users", {
        params: {
          skip: paginationRef.current.skip,
          limit: pageSize,
          search: debouncedSearch || undefined,
          role: queryRolesKey,
          sortBy,
          order,
        },
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      const fetchedUsers = response.data.data;

      // Prevent duplicate users.

      setUsers((currentUsers) => {
        const existingIds = new Set(currentUsers.map((user) => user._id));

        const newUsers = fetchedUsers.filter(
          (user) => !existingIds.has(user._id),
        );

        return [...currentUsers, ...newUsers];
      });

      const nextHasMore =
        response.data.pagination.hasNextPage && fetchedUsers.length > 0;

      paginationRef.current = {
        skip: response.data.pagination.skip + fetchedUsers.length,
        hasMore: nextHasMore,
      };

      setHasMore(nextHasMore);
    } catch (error) {
      if (controller.signal.aborted) return;

      setLoadMoreError(getErrorMessage(error, "Unable to load more users."));
    } finally {
      if (controllerRef.current === controller) {
        requestLock.current = false;
        setLoadingMore(false);
      }
    }
  }, [pageSize, debouncedSearch, queryRolesKey, sortBy, order]);

  // ---------------------------------------------------------------------------
  // Selection handlers
  // ---------------------------------------------------------------------------

  const toggleUser = (user: User, checked: boolean) => {
    setDraftUsers((currentUsers) => {
      const alreadySelected = currentUsers.some(
        (item) => item._id === user._id,
      );

      if (checked) {
        if (alreadySelected) return currentUsers;

        if (
          maxSelections !== undefined &&
          currentUsers.length >= maxSelections
        ) {
          return currentUsers;
        }

        return [...currentUsers, user];
      }

      return currentUsers.filter((item) => item._id !== user._id);
    });
  };

  const selectSingleUser = (userId: string) => {
    const user = users.find((item) => item._id === userId);

    if (user) {
      setDraftUsers([user]);
    }
  };

  // ---------------------------------------------------------------------------
  // Dialog handlers
  // ---------------------------------------------------------------------------

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Start with the currently committed selection.
      setDraftUsers(selectedUsers);
    }

    setOpen(nextOpen);
  };

  // ---------------------------------------------------------------------------
  // Commit selection
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    if (props.required && draftUsers.length === 0) return;

    if (props.multiselect === true) {
      if (!isControlled) {
        setInternalSelected(draftUsers);
      }

      props.onChange?.(draftUsers);
      props.onPick?.(draftUsers);
    } else {
      const selectedUser = draftUsers[0] ?? null;

      if (!isControlled) {
        setInternalSelected(selectedUser ? [selectedUser] : []);
      }

      props.onChange?.(selectedUser);

      if (selectedUser) {
        props.onPick?.(selectedUser);
      }
    }

    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Trigger label
  // ---------------------------------------------------------------------------

  const triggerText =
    props.triggerLabel ??
    (selectedUsers.length === 0
      ? multiselect
        ? "Select users"
        : "Select user"
      : multiselect
        ? `${selectedUsers.length} users selected`
        : selectedUsers[0].name);

  const confirmLabel =
    props.confirmLabel ?? (multiselect ? "Confirm selection" : "Select user");

  const maxReached =
    maxSelections !== undefined && draftUsers.length >= maxSelections;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" disabled={props.disabled}>
            {triggerText}
          </Button>
        }
      />

      <DialogContent className="max-w-xl gap-0 p-0 sm:max-w-xl">
        {/* Header */}

        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>
            {props.title ?? (multiselect ? "Select users" : "Select user")}
          </DialogTitle>

          <DialogDescription>
            {props.description ??
              "Search and select users from your organization."}
          </DialogDescription>
        </DialogHeader>

        {/* Search and filters */}

        <div className="space-y-3 border-b px-5 py-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={
                  props.searchPlaceholder ?? "Search by name or email..."
                }
                className="pr-9 pl-9"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}

          {(showSort || showRoleFilter) && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {showSort && (
                <select
                  aria-label="Sort users"
                  value={sortValue}
                  onChange={(event) =>
                    setSortValue(event.target.value as SortOption)
                  }
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {showRoleFilter && (
                <select
                  aria-label="Filter users by role"
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as Role | "all")
                  }
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All allowed roles</option>

                  {configuredRoles.map((role) => (
                    <option key={role} value={role}>
                      {formatLabel(role)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Selection information */}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{multiselect ? "Selected users" : "Selected user"}</span>

            <div className="flex items-center gap-2">
              {multiselect && maxSelections !== undefined && (
                <span>Maximum: {maxSelections}</span>
              )}

              <Badge variant="secondary">{draftUsers.length} selected</Badge>
            </div>
          </div>
        </div>

        {/* User list */}

        <div className="min-h-0 px-5 py-3">
          {loading ? (
            <div className="flex h-80 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Loading users...
            </div>
          ) : initialError ? (
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
          ) : users.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center gap-2 text-center">
              <Users className="size-9 text-muted-foreground" />

              <p className="text-sm font-medium">No users found</p>

              <p className="text-xs text-muted-foreground">
                {props.emptyMessage ?? "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={users.length}
              next={loadNextPage}
              hasMore={hasMore}
              loader={
                <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading more users...
                </div>
              }
              endMessage={
                <p className="py-3 text-center text-xs text-muted-foreground">
                  You have reached the end.
                </p>
              }
              height="320px"
              scrollThreshold="120px"
            >
              {multiselect ? (
                // Multiple selection

                <div className="space-y-2 pr-2">
                  {users.map((user) => {
                    const checked = draftUsers.some(
                      (item) => item._id === user._id,
                    );

                    const checkboxId = `${componentId}-${user._id}`;

                    return (
                      <div
                        key={user._id}
                        className={[
                          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                          checked
                            ? "border-primary bg-accent/40"
                            : "border-transparent hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={checked}
                          disabled={!checked && maxReached}
                          onCheckedChange={(value) =>
                            toggleUser(user, value === true)
                          }
                          aria-label={`Select ${user.name}`}
                        />

                        <label
                          htmlFor={checkboxId}
                          className="min-w-0 flex-1 cursor-pointer"
                        >
                          <UserDetails
                            user={user}
                            renderUser={props.renderUser}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Single selection

                <RadioGroup
                  value={draftUsers[0]?._id ?? ""}
                  onValueChange={selectSingleUser}
                  aria-label="Select a user"
                  className="space-y-2 pr-2"
                >
                  {users.map((user) => {
                    const checked = draftUsers[0]?._id === user._id;

                    const radioId = `${componentId}-${user._id}`;

                    return (
                      <div
                        key={user._id}
                        className={[
                          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                          checked
                            ? "border-primary bg-accent/40"
                            : "border-transparent hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <RadioGroupItem id={radioId} value={user._id} />

                        <label
                          htmlFor={radioId}
                          className="min-w-0 flex-1 cursor-pointer"
                        >
                          <UserDetails
                            user={user}
                            renderUser={props.renderUser}
                          />
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {/* Pagination error */}

              {loadMoreError && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <p className="text-xs text-destructive">{loadMoreError}</p>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loadingMore}
                    onClick={loadNextPage}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
          <Button
            variant="ghost"
            onClick={() => setDraftUsers([])}
            disabled={draftUsers.length === 0 || props.required}
          >
            Clear
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={props.required && draftUsers.length === 0}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
