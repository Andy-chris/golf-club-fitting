import { Link } from "wouter";

export function Header() {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2 text-accent-lightest">
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
          <h1 className="text-white font-bold text-xl md:text-2xl">SwingFit</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-amber-200 text-sm md:text-base">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-amber-200 text-sm md:text-base">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
