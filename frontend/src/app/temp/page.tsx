"use client";

import { UserPicker } from "@/shared/picker/user-picker";
import { User } from "@/types/user-picker.types";
import { useState } from "react";

export default function TempPage() {
  const [manager, setManager] = useState<User | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);

  return (
    <div>
      <div>
        <UserPicker
          role={["admin", "manager"]}
          value={manager}
          onChange={setManager}
        />
      </div>

      <div>
        <UserPicker
          multiselect
          role="technician"
          value={technicians}
          onChange={setTechnicians}
          maxSelections={5}
        />
      </div>
    </div>
  );
}
