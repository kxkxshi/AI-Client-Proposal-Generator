import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  FilePlus2,
  History,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/create', label: 'New Proposal', icon: FilePlus2 },
  { to: '/history', label: 'History', icon: History },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-base-100 border-r border-border relative z-50">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
      
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border relative z-10">
        <div className="w-8 h-8 rounded-lg bg-base-300 border border-border flex items-center justify-center shadow-glow-sm">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h1 className="text-base font-bold text-text-primary tracking-tight">ProposeAI</h1>
          <p className="text-[11px] text-text-muted">Proposal Generator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'text-accent border border-accent/20 bg-accent/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-base-200 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors relative z-10 ${
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                />
                <span className="flex-1 relative z-10">{label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-accent" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-error hover:bg-error/10 transition-all duration-300 hover:translate-x-1"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
