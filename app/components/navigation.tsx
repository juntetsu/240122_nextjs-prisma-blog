import Link from "next/link";
import { User } from "@prisma/client";
import Menu from "@/app/components/Menu";

type NavigationProps = {
  currentUser: User | null;
};

// ナビゲーション
const Navigation: React.FC<NavigationProps> = ({ currentUser }) => {
  return (
    <header className="shadow-lg shadow-gray-100">
      <div className="container mx-auto flex max-w-screen-sm items-center justify-between px-1 py-5">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          Pan&apos;s App
        </Link>

        <div className="flex items-center justify-center space-x-2">
          <Menu currentUser={currentUser} />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
