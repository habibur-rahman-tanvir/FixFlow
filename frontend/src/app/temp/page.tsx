"use client";

import { UserPicker } from "@/shared/picker/user-picker";

export default function TempPage() {
  return (
    <div className="p-2">
      <UserPicker multiselect={true} maxSelections={5} />
      <UserPicker />
    </div>
  );
}
