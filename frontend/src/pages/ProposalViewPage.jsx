import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProposalById } from '../api/proposals'
import Sidebar from '../components/Sidebar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  ArrowLeft,
  Copy,
  Download,
  CheckCheck,
  FileText,
  Clock,
  DollarSign,
  Sparkles,
  Loader2,
} from 'lucide-react'

const TONE_COLORS = {
  formal: 'bg-info/20 text-info border-info/30',
  friendly: 'bg-success/20 text-success border-success/30',
  persuasive: 'bg-warning/20 text-warning border-warning/30',
}

export default function ProposalViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getProposalById(id)
      .then(setProposal)
      .catch(() => setError('Proposal not found or you don\'t have access.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCopy = async () => {
    if (!proposal) return
    await navigator.clipboard.writeText(proposal.generated_content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return
    setExporting(true)

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#13131a',
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      const pageHeight = pdf.internal.pageSize.getHeight()

      let position = 0
      let remainingHeight = pdfHeight

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      remainingHeight -= pageHeight

      // Add more pages if needed
      while (remainingHeight > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        remainingHeight -= pageHeight
      }

      const fileName = proposal.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      pdf.save(`${fileName}-proposal.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('PDF export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
    <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm">Loading proposal...</p>
          </div>
        </main>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !proposal) {
    return (
    <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">Proposal not found</h3>
            <p className="text-text-muted text-sm mb-4">{error}</p>
            <button onClick={() => navigate('/history')} className="btn-secondary">
              <ArrowLeft size={16} /> Back to History
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                id="copy-proposal-btn"
                className="btn-secondary py-2 px-4 text-sm"
              >
                {copied ? (
                  <>
                    <CheckCheck size={15} className="text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPDF}
                id="download-pdf-btn"
                disabled={exporting}
                className="btn-primary py-2 px-4 text-sm"
              >
                {exporting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Proposal meta card */}
          <div className="card p-6 mb-6 bg-gradient-card border-accent/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-text-primary leading-tight">
                    {proposal.title}
                  </h2>
                  <span className={`badge border capitalize ${TONE_COLORS[proposal.tone] || TONE_COLORS.formal}`}>
                    {proposal.tone}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-text-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(proposal.created_at)}
                  </span>
                  {proposal.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} />
                      {proposal.budget}
                    </span>
                  )}
                  {proposal.timeline && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {proposal.timeline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Proposal content */}
          <div className="card p-8 animate-fade-in" ref={contentRef}>
            <div className="proposal-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {proposal.generated_content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handleCopy}
              className="btn-secondary"
            >
              {copied ? <CheckCheck size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="btn-primary"
            >
              {exporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {exporting ? 'Generating PDF...' : 'Download as PDF'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
