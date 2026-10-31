import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
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
