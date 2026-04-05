import { useEffect, useState } from 'react'
import { getAllProposals } from '../api/proposals'
import Sidebar from '../components/Sidebar'
import ProposalCard from '../components/ProposalCard'
import { useNavigate } from 'react-router-dom'
import { History, FilePlus2, Search } from 'lucide-react'

export default function HistoryPage() {
  const [proposals, setProposals] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAllProposals()
      .then((data) => {
        setProposals(data)
        setFiltered(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      proposals.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tone.toLowerCase().includes(q)
      )
    )
  }, [search, proposals])

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <History size={20} className="text-accent-light" />
                <h2 className="section-title">Proposal History</h2>
              </div>
              <p className="section-subtitle">
                {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} generated
              </p>
            </div>
            <button onClick={() => navigate('/create')} className="btn-primary">
              <FilePlus2 size={16} />
              New Proposal
            </button>
          </div>

          {/* Search */}
          {proposals.length > 0 && (
            <div className="relative mb-6">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search by title or tone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-base-400" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3.5 bg-base-400 rounded w-3/4" />
                      <div className="h-2.5 bg-base-400 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-2 bg-base-400 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  onDeleted={(id) => {
                    setProposals((prev) => prev.filter((x) => x.id !== id))
                  }}
                />
              ))}
            </div>
          ) : proposals.length > 0 ? (
            <div className="card p-10 text-center">
              <Search className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No proposals match your search.</p>
              <p className="text-text-muted text-sm mt-1">Try a different keyword.</p>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <History className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h4 className="font-semibold text-text-primary mb-1">No proposals yet</h4>
              <p className="text-text-muted text-sm mb-5">
                Your generated proposals will appear here.
              </p>
              <button onClick={() => navigate('/create')} className="btn-primary">
                <FilePlus2 size={16} />
                Create First Proposal
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
