import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

type MarkdownContentProps = {
  content: string
}

type CalloutType = 'tip' | 'warning' | 'try-this'

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; icon: string; label: string }> = {
  tip: {
    bg: 'bg-primary/5',
    border: 'border-primary/30',
    icon: '💡',
    label: 'Tip',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: '⚠️',
    label: 'Important',
  },
  'try-this': {
    bg: 'bg-accent/5',
    border: 'border-accent/30',
    icon: '✋',
    label: 'Try This',
  },
}

function isCalloutType(value: string): value is CalloutType {
  return value in CALLOUT_STYLES
}

/**
 * Splits markdown content into segments: regular markdown and callout blocks.
 * Callout blocks use :::type / ::: syntax.
 */
function splitContent(content: string): Array<{ type: 'markdown' | 'callout'; calloutType?: CalloutType; text: string }> {
  const segments: Array<{ type: 'markdown' | 'callout'; calloutType?: CalloutType; text: string }> = []
  const regex = /^:::(tip|warning|try-this)\s*\n([\s\S]*?)^:::\s*$/gm
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    // Text before the callout
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim()
      if (before) segments.push({ type: 'markdown', text: before })
    }
    const ct = match[1] as string
    segments.push({
      type: 'callout',
      calloutType: isCalloutType(ct) ? ct : 'tip',
      text: (match[2] as string).trim(),
    })
    lastIndex = match.index + match[0].length
  }

  // Remaining text after last callout
  const remaining = content.slice(lastIndex).trim()
  if (remaining) segments.push({ type: 'markdown', text: remaining })

  return segments
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 font-heading text-2xl text-primary">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-heading text-xl text-primary-dark">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-text">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1.5 text-text">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-text">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return <code className={className ?? ''}>{children}</code>
    }
    return (
      <code className="rounded bg-background-dark px-1.5 py-0.5 font-mono text-sm text-primary-dark">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto rounded-card bg-[#1e293b] p-4 font-mono text-sm leading-relaxed text-slate-100 shadow-card">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-primary/30 pl-4 italic text-text-muted">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline hover:text-primary-dark" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

function CalloutBlock({ calloutType, children }: { calloutType: CalloutType; children: React.ReactNode }) {
  const style = CALLOUT_STYLES[calloutType]
  return (
    <div className={`mb-6 rounded-card border-l-4 ${style.border} ${style.bg} p-5`}>
      <p className="mb-2 font-semibold">
        <span className="mr-2">{style.icon}</span>
        {style.label}
      </p>
      <div className="[&>p:last-child]:mb-0">{children}</div>
    </div>
  )
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const segments = splitContent(content)

  return (
    <div className="prose-gyp">
      {segments.map((segment, i) => {
        if (segment.type === 'callout' && segment.calloutType) {
          return (
            <CalloutBlock key={i} calloutType={segment.calloutType}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {segment.text}
              </ReactMarkdown>
            </CalloutBlock>
          )
        }
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={components}>
            {segment.text}
          </ReactMarkdown>
        )
      })}
    </div>
  )
}
