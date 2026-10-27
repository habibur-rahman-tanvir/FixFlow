import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/signup"}>
        <Button>Sign up</Button>
      </Link>
      <Link href={"/verify"}>
        <Button>Verify</Button>
      </Link>
    </div>
  );
}
