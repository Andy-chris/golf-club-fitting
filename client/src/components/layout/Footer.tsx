import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="mr-2 text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Golf ball logo */}
                <circle cx="12" cy="12" r="6" strokeWidth="2" />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1" 
                  d="M12 6 Q 14 8 14 12 Q 14 16 12 18 M12 6 Q 10 8 10 12 Q 10 16 12 18" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1" 
                  d="M8 10 Q 10 10 12 10 Q 14 10 16 10 M8 14 Q 10 14 12 14 Q 14 14 16 14" 
                />
              </svg>
            </span>
            <h2 className="font-bold text-xl">SwingFit</h2>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SwingFit. All rights reserved. Not affiliated with any golf equipment manufacturer.</p>
        </div>
      </div>
    </footer>
  );
}
