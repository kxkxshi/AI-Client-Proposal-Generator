import { Sparkles } from 'lucide-react'

export default function LoadingSpinner({ message = 'Generating your proposal with AI...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-24 h-24 rounded-full bg-accent/10 animate-ping" />
        <div className="absolute w-20 h-20 rounded-full border border-accent/20 animate-spin-slow" />
        <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow z-10">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-text-primary font-semibold text-base mb-2">{message}</h3>
      <p className="text-text-muted text-sm mb-6 text-center max-w-xs">
        AI is crafting a professional, tailored proposal for your project
      </p>

      {/* Loading dots */}
      <div className="loading-dots">
        <span />
        <span />
        <span />
      </div>

      {/* Progress steps */}
      <div className="mt-8 space-y-2 w-full max-w-xs">
        {[
          'Analyzing project requirements',
          'Structuring proposal sections',
          'Generating content with AI',
          'Formatting final document',
        ].map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-3 text-sm text-text-muted"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
