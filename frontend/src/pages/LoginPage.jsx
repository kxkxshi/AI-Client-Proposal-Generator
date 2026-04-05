import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      setError(error.message || 'Invalid credentials. Please try again.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-transparent text-text-primary overflow-hidden">
      
      {/* Left Panel - Visual Animation */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden border-r border-border bg-transparent">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60"></div>
        
        {/* Structured Floating Card */}
        <div className="relative z-10 card p-12 max-w-lg text-center flex flex-col items-center border-border shadow-card-hover">
          <div className="w-20 h-20 rounded-3xl bg-gradient-accent flex items-center justify-center shadow-border mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-text-primary mb-4 leading-tight tracking-tight">
            Win clients <span className="text-accent">faster.</span>
          </h2>
          <p className="text-text-secondary text-base leading-relaxed text-balance">
            Generate stunning, persuasive project proposals in seconds utilizing cutting-edge AI. Less typing, more closing.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-base-100">
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tight">Welcome back</h1>
            <p className="text-text-secondary text-base">Sign in to your ProposeAI account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="input-label" htmlFor="login-email">Email address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="login-password">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors focus-within:text-accent" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="btn-primary w-full py-4 text-base tracking-wide shadow-glow-sm hover:shadow-glow"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <Sparkles size={18} className="opacity-80" />
                </div>
              )}
            </button>
          </form>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-[1px] bg-border flex-1"></div>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">New here?</span>
              <div className="h-[1px] bg-border flex-1"></div>
            </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-accent font-bold hover:text-accent-light transition-colors relative"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
