import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name)
    setLoading(false)

    if (error) {
      setError(error.message || 'Registration failed. Please try again.')
    } else {
      setSuccess(true)
      // If email confirmation is disabled in Supabase, redirect after a moment
      setTimeout(() => navigate('/dashboard'), 2500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-base relative flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-20"></div>
        <div className="text-center animate-slide-up bg-base-100 p-12 rounded-2xl max-w-sm shadow-card border border-success/20 relative z-10">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
            <CheckCircle2 className="w-8 h-8 text-success animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">Account created!</h2>
          <p className="text-text-secondary text-base leading-relaxed">
            Check your email to confirm your account, or you&apos;ll be redirected shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-transparent text-text-primary overflow-hidden">
      
      {/* Left Panel - Visual Animation */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden border-r border-border bg-transparent">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60"></div>
        {/* Structured Floating Card */}
        <div className="relative z-10 card p-12 max-w-lg text-center flex flex-col items-center shadow-card-hover border-border">
          <div className="w-20 h-20 rounded-3xl bg-gradient-accent flex items-center justify-center shadow-border mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-text-primary mb-4 leading-tight tracking-tight">
            Stop pitching, <br/>
            start <span className="text-accent">winning.</span>
          </h2>
          <p className="text-text-secondary text-base leading-relaxed text-balance">
            Join thousands of freelancers and agencies closing better deals with AI-powered proposals.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-base-100 overflow-y-auto">
        <div className="w-full max-w-sm relative z-10 animate-fade-in py-10">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tight">Create Account</h1>
            <p className="text-text-secondary text-base">Start generating winning proposals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="input-label" htmlFor="reg-name">Full name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent" />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="reg-email">Email address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent" />
                  <input
                    id="reg-email"
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
                <label className="input-label" htmlFor="reg-password">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors focus-within:text-accent" />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
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

              <div>
                <label className="input-label" htmlFor="reg-confirm">Confirm password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors focus-within:text-accent" />
                  <input
                    id="reg-confirm"
                    name="confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="input-field pl-11"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="btn-primary w-full py-4 mt-2 text-base tracking-wide shadow-glow-sm hover:shadow-glow"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <Sparkles size={18} className="opacity-80" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[1px] bg-border flex-1"></div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Already joining?</span>
            <div className="h-[1px] bg-border flex-1"></div>
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent font-bold hover:text-accent-light transition-colors relative"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
