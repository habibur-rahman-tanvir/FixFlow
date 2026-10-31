import { ModeToggle } from "@/components/next-theme/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="bg-blue-600 p-1">
        <ModeToggle />
      </div>
      <div>
        <Link href={"/signup"}>
          <Button>Sign up</Button>
        </Link>
        <Link href={"/verify"}>
          <Button>Verify</Button>
        </Link>
        <Link href={"/profile"}>
          <Button>Profile</Button>
        </Link>
        <Link href={"/logout"}>
          <Button>Logout</Button>
        </Link>
      </div>
      <div>
        <Link href={"/admin/dashboard"}>
          <Button>Admin Dashboard</Button>
        </Link>
        <Link href={"/manager/dashboard"}>
          <Button>Manager Dashboard</Button>
        </Link>
        <Link href={"/technician/dashboard"}>
          <Button>Technician Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
