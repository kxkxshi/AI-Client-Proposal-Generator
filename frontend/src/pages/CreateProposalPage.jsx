import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateProposal } from '../api/proposals'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Sparkles,
  FileText,
  AlignLeft,
  DollarSign,
  Clock,
  Zap,
  Info,
} from 'lucide-react'

const TONE_OPTIONS = [
  {
    value: 'formal',
    label: 'Formal',
    desc: 'Professional & precise',
    color: 'border-info/30 bg-info/5 text-info',
    active: 'border-info bg-info/10 ring-1 ring-info/50',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    desc: 'Warm & approachable',
    color: 'border-success/30 bg-success/5 text-success',
    active: 'border-success bg-success/10 ring-1 ring-success/50',
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
    desc: 'Compelling & action-driven',
    color: 'border-warning/30 bg-warning/5 text-warning',
    active: 'border-warning bg-warning/10 ring-1 ring-warning/50',
  },
]

export default function CreateProposalPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    features: '',
    budget: '',
    timeline: '',
    tone: 'formal',
  })

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const proposal = await generateProposal(form)
      navigate(`/proposals/${proposal.id}`)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Failed to generate proposal. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="card p-10 max-w-sm w-full mx-4">
            <LoadingSpinner />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-transparent relative overflow-hidden">
      {/* Animated Main Background */}
      <div className="fixed inset-0 pointer-events-none bg-dot-pattern bg-dot opacity-20 z-0"></div>
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 bg-transparent">
        <div className="max-w-2xl mx-auto px-6 py-12 relative z-10 animate-fade-in">

          {/* Header */}
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-accent">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight">Create New Proposal</h2>
            <p className="section-subtitle mt-2 text-base">Fill in your project details. AI will generate a complete proposal in seconds.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm mb-8 animate-fade-in">
              <Info size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">

            {/* Project Title */}
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <label className="input-label relative z-10" htmlFor="proposal-title">
                <FileText size={16} className="inline mr-2 -mt-0.5 text-accent-light" />
                Project Title <span className="text-error">*</span>
              </label>
              <div className="relative z-10 hover:shadow-glow-sm transition-shadow duration-300 rounded-xl">
                <input
                  id="proposal-title"
                  name="title"
                  type="text"
                  required
                  minLength={3}
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. E-commerce Website for Fashion Brand"
                  className="input-field"
                />
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <label className="input-label relative z-10" htmlFor="proposal-description">
                <AlignLeft size={16} className="inline mr-2 -mt-0.5 text-accent-light" />
                Project Description <span className="text-error">*</span>
              </label>
              <div className="relative z-10 hover:shadow-glow-sm transition-shadow duration-300 rounded-xl">
                <textarea
                  id="proposal-description"
                  name="description"
                  required
                  minLength={20}
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the project in detail. What does the client need? What problem are you solving? What are the specific requirements?"
                  className="input-field"
                />
              </div>
              <p className="text-[12px] text-text-muted mt-3 flex items-center gap-1.5 relative z-10">
                <Info size={12} className="text-accent-light" />
                More detail = better proposal. Aim for at least 2-3 sentences.
              </p>
            </div>

            {/* Features */}
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <label className="input-label relative z-10" htmlFor="proposal-features">
                <Zap size={16} className="inline mr-2 -mt-0.5 text-accent-light" />
                Features Required
                <span className="text-text-muted font-normal ml-1">(optional)</span>
              </label>
              <div className="relative z-10 hover:shadow-glow-sm transition-shadow duration-300 rounded-xl">
                <textarea
                  id="proposal-features"
                  name="features"
                  rows={4}
                  value={form.features}
                  onChange={handleChange}
                  placeholder="List the key features, e.g.:&#10;- User authentication&#10;- Product catalog with filters&#10;- Shopping cart & checkout&#10;- Admin dashboard"
                  className="input-field"
                />
              </div>
            </div>

            {/* Budget + Timeline row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="card p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <label className="input-label relative z-10" htmlFor="proposal-budget">
                  <DollarSign size={16} className="inline mr-2 -mt-0.5 text-accent-light" />
                  Budget
                  <span className="text-text-muted font-normal ml-1">(optional)</span>
                </label>
                <div className="relative z-10 hover:shadow-glow-sm transition-shadow duration-300 rounded-xl">
                  <input
                    id="proposal-budget"
                    name="budget"
                    type="text"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. $1,000 – $3,000"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="card p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <label className="input-label relative z-10" htmlFor="proposal-timeline">
                  <Clock size={16} className="inline mr-2 -mt-0.5 text-accent-light" />
                  Timeline
                  <span className="text-text-muted font-normal ml-1">(optional)</span>
                </label>
                <div className="relative z-10 hover:shadow-glow-sm transition-shadow duration-300 rounded-xl">
                  <input
                    id="proposal-timeline"
                    name="timeline"
                    type="text"
                    value={form.timeline}
                    onChange={handleChange}
                    placeholder="e.g. 3–4 weeks"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <label className="input-label relative z-10">
                <Sparkles size={16} className="inline mr-2 -mt-0.5 text-accent" />
                Proposal Tone <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 relative z-10">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, tone: opt.value }))}
                    className={`rounded-lg border p-4 text-left transition-all duration-300 transform ${
                      form.tone === opt.value ? `${opt.active} scale-[1.02] shadow-glow-sm` : 'border-border bg-base hover:border-border-light hover:bg-base-200 hover:scale-[1.01]'
                    }`}
                  >
                    <p className={`font-bold text-sm mb-1 transition-colors ${form.tone === opt.value ? opt.color.split(' ').at(-1) : 'text-text-primary'}`}>
                      {opt.label}
                    </p>
                    <p className={`text-xs transition-colors ${form.tone === opt.value ? 'text-text-secondary' : 'text-text-muted'}`}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="generate-proposal-btn"
              className="btn-primary w-full py-4 text-base tracking-wide shadow-glow hover:shadow-glow-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Sparkles size={20} className="animate-pulse" />
                Generate AI Proposal
              </div>
            </button>

            <p className="text-center text-xs text-text-muted">
              ✦ Your proposal will be generated and saved automatically
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
