import Link from "next/link"
import { VideoIcon } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <VideoIcon className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">CAM4</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 CAM4. All rights reserved.
            </p>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Earn Money $</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Become a Cam Model
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://www.cam4.com/legal/termsofuse" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Terms
                </Link>
              </li>
               <li>
                <Link href="https://www.cam4.com/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://www.cam4.com/legal/2257_compliance_statement" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  2257
                </Link>
              </li>
              <li>
                <Link href="https://www.cam4.com/legal/cookies" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="https://www.cam4.com/legal/law_enforcement" className="text-muted-foreground hover:text-foreground transition-colors" rel="nofollow noopener noreferrer">
                  Law Enforcement
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}