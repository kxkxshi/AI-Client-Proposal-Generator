import { useTheme } from '../context/ThemeContext'
import { Sparkles, Sun, Moon, Zap, Cloud } from 'lucide-react'

const THEMES = [
  { id: 'aurora', label: 'Aurora', icon: Moon, desc: 'Dark Glass' },
  { id: 'light', label: 'Minimal', icon: Sun, desc: 'Clean White' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap, desc: 'Neon Grid' },
  { id: 'ethereal', label: 'Ethereal', icon: Cloud, desc: 'Soft Pastel' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-full">
      <p className="text-xs font-bold text-text-muted mb-2 px-1 uppercase tracking-wider">Theme</p>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(({ id, label, icon: Icon, desc }) => {
          const isActive = theme === id
          return (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-start gap-1 p-2 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'border-accent bg-accent/10 shadow-glow-sm'
                  : 'border-border bg-base hover:bg-base-200 hover:border-border-light'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-accent opacity-20 blur-xl rounded-full"></div>
              )}
              <div className="flex items-center gap-1.5 w-full">
                <Icon size={14} className={isActive ? 'text-accent' : 'text-text-muted'} />
                <span className={`text-[11px] font-bold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {label}
                </span>
              </div>
              <span className="text-[10px] text-text-disabled opacity-80 pl-5">{desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
