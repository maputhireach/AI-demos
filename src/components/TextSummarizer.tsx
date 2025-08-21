import { useMemo, useState } from 'react'

function summarize(text: string, maxSentences = 3): string {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)

  if (sentences.length <= maxSentences) return text.trim()

  const words = text.toLowerCase().match(/[a-z']+/g) ?? []
  const stop = new Set(['the','a','an','and','or','but','to','of','in','on','for','with','as','at','by','from','is','are','was','were','be','been','it','this','that'])
  const freq = new Map<string, number>()
  for (const w of words) {
    if (stop.has(w)) continue
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }

  const sentenceScores = sentences.map((s) => {
    const tokens = s.toLowerCase().match(/[a-z']+/g) ?? []
    const score = tokens.reduce((acc, t) => acc + (freq.get(t) ?? 0), 0)
    return { s, score }
  })

  sentenceScores.sort((a, b) => b.score - a.score)
  const top = sentenceScores.slice(0, maxSentences).map((x) => x.s)

  // Preserve original order
  const setTop = new Set(top)
  return sentences.filter((s) => setTop.has(s)).join(' ')
}

export default function TextSummarizer() {
  const [text, setText] = useState(
    'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components. This demo creates a quick extractive summary by scoring sentences based on word frequency.'
  )

  const result = useMemo(() => summarize(text, 2), [text])

  return (
    <div>
      <textarea
        className="form-control mb-3"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to summarize"
      />
      <div>
        <h6>Summary</h6>
        <div className="p-2 border rounded bg-light" style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
      </div>
    </div>
  )
}


