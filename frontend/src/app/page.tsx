import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/login"}>
        <Button>Google login</Button>
      </Link>
    </div>
  );
}
