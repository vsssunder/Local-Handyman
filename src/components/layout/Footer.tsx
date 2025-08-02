import Link from "next/link";
import { Hand } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary/5">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Hand className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">Local Handyman Connect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Local Handyman Connect. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
