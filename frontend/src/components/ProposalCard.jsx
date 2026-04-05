import { useNavigate } from 'react-router-dom'
import { FileText, Clock, DollarSign, ChevronRight, Trash2 } from 'lucide-react'
import { deleteProposal } from '../api/proposals'

const TONE_BADGES = {
  formal: 'bg-info/10 text-info border-info/30',
  friendly: 'bg-success/10 text-success border-success/30',
  persuasive: 'bg-warning/10 text-warning border-warning/30',
}

export default function ProposalCard({ proposal, onDeleted }) {
  const navigate = useNavigate()

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Delete this proposal? This cannot be undone.')) return
    try {
      await deleteProposal(proposal.id)
      onDeleted?.(proposal.id)
    } catch (err) {
      alert('Failed to delete proposal.')
    }
  }

  return (
    <div
      className="card-laser cursor-pointer group p-5 animate-slide-up relative overflow-hidden"
      onClick={() => navigate(`/proposals/${proposal.id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-base-300 border border-border flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary text-sm leading-tight truncate group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
              {proposal.title}
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
              <Clock size={10} />
              {formatDate(proposal.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`badge border text-[11px] capitalize ${TONE_BADGES[proposal.tone] || TONE_BADGES.formal}`}
          >
            {proposal.tone}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-[12px] text-text-muted">
        {proposal.budget && (
          <span className="flex items-center gap-1">
            <DollarSign size={11} />
            {proposal.budget}
          </span>
        )}
        {proposal.timeline && (
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {proposal.timeline}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border relative z-10">
        <span className="text-[11px] text-text-muted group-hover:text-accent transition-colors duration-300">Click to view full proposal</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Delete proposal"
          >
            <Trash2 size={14} />
          </button>
          <ChevronRight
            size={16}
            className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  )
}
