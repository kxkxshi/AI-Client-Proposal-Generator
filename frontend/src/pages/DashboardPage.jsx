import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllProposals } from '../api/proposals'
import Sidebar from '../components/Sidebar'
import ProposalCard from '../components/ProposalCard'
import {
  Sparkles,
  FilePlus2,
  FileText,
  TrendingUp,
  Clock,
  ChevronRight,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProposals()
      .then(setProposals)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const recent = proposals.slice(0, 4)

  const stats = [
    {
      label: 'Total Proposals',
      value: proposals.length,
      icon: FileText,
      color: 'text-accent-light',
      bg: 'bg-accent/15 border-accent/20',
    },
    {
      label: 'This Month',
      value: proposals.filter((p) => {
        const d = new Date(p.created_at)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/15 border-success/20',
    },
    {
      label: 'Most Recent',
      value: proposals[0]
        ? new Date(proposals[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—',
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/15 border-warning/20',
    },
  ]

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10">

        {/* Hero banner */}
        <div className="relative border-b border-border px-8 pt-12 pb-14 overflow-hidden z-10 bg-base-200/40 backdrop-blur-3xl shadow-card">
          <div className="max-w-4xl relative z-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-accent">
                <Sparkles size={10} />
                Powered by OpenRouter
              </span>
            </div>
            <h2 className="text-4xl font-black text-text-primary mb-2 tracking-tight">
              Good day, <span className="text-accent">{displayName}</span> 👋
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl text-balance">
              Ready to win more clients? Generate a professional proposal in under 30 seconds.
            </p>
            <button
              onClick={() => navigate('/create')}
              id="dashboard-create-btn"
              className="btn-primary mt-6 shadow-glow hover:shadow-glow-sm px-6 py-3 text-base"
            >
              <FilePlus2 size={16} />
              Create New Proposal
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 max-w-5xl">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {stats.map(({ label, value, icon: Icon, color, bg }, idx) => (
              <div 
                key={label} 
                className={`card-laser p-6 flex items-center gap-5 animate-slide-up`}
                style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
              >
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shadow-glow-sm ${bg}`}>
                  <Icon size={24} className={color} />
                </div>
                <div>
                  <p className="text-4xl font-black text-text-primary tracking-tight">{value}</p>
                  <p className="text-sm text-text-muted mt-1 font-bold">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Proposals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">Recent Proposals</h3>
                <p className="text-text-muted text-sm mt-1">Your latest generated proposals</p>
              </div>
              {proposals.length > 4 && (
                <button
                  onClick={() => navigate('/history')}
                  className="btn-ghost text-xs"
                >
                  View all
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-base-400" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-base-400 rounded w-3/4" />
                        <div className="h-2.5 bg-base-400 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-2 bg-base-400 rounded w-1/2 mt-4" />
                  </div>
                ))}
              </div>
            ) : recent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recent.map((p) => (
                  <ProposalCard
                    key={p.id}
                    proposal={p}
                    onDeleted={(id) => setProposals((prev) => prev.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            ) : (
              <div className="card p-14 flex flex-col items-center text-center animate-fade-in border-border relative overflow-hidden bg-base-100">
                <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.05] pointer-events-none"></div>
                <div className="w-16 h-16 rounded-xl bg-base-200 border border-border flex items-center justify-center mb-5 relative z-10 shadow-sm">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2 relative z-10">No proposals yet</h4>
                <p className="text-text-secondary text-base mb-6 relative z-10 max-w-sm">
                  Create your first AI-powered proposal to get started.
                </p>
                <button onClick={() => navigate('/create')} className="btn-primary">
                  <FilePlus2 size={16} />
                  Create First Proposal
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
