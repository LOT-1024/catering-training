import { Outlet, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../mode-toggle'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-foreground">
              POS System
            </Link>
            <div className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded transition-colors ${
                  location.pathname === '/about' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About
              </Link>
              <Link
                to="/cashier"
                className={`px-3 py-2 rounded transition-colors ${
                  location.pathname === '/cashier' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cashier
              </Link>
            </div>
          </div>
          <ThemeToggle/>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}