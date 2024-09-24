import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function Footer() {
  return (
    <footer className="bg-muted py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Swap
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Bridge
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Stake
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Pool
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Subscribe</h4>
            <p className="text-muted-foreground">Get the latest updates and news from Stablebridge.</p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 md:mt-16 text-center text-muted-foreground">
          <p>&copy; 2024 Stablebridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
