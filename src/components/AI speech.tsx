import { useEffect, useRef, useState } from 'react'

export default function SpeechTranscriber() {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [lang, setLang] = useState<'km-KH' | 'en-US'>('km-KH')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      return
    }
    const rec = new SR()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (event: any) => {
      const transcript: string = Array.from(event.results)
        .map((r: any) => r[0]?.transcript)
        .filter(Boolean)
        .join(' ')
      setText((prev) => (prev ? prev + ' ' : '') + transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
  }, [lang])

  const startListening = () => {
    if (!recognitionRef.current) return
    try {
      setListening(true)
      recognitionRef.current.start()
    } catch {
      setListening(false)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <button
          className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`}
          onClick={listening ? stopListening : startListening}
          disabled={!supported}
        >
          <i className={`fa-solid ${listening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>{' '}
          {listening ? 'Stop' : `Speak (${lang === 'km-KH' ? 'Khmer' : 'English'})`}
        </button>
        <select
          className="form-select form-select-sm w-auto"
          value={lang}
          onChange={(e) => {
            const next = e.target.value === 'km-KH' ? 'km-KH' : 'en-US'
            if (listening) {
              try { recognitionRef.current?.stop() } catch {}
              setListening(false)
            }
            setLang(next)
          }}
          aria-label="Recognition language"
        >
          <option value="km-KH">Khmer (km-KH)</option>
          <option value="en-US">English (en-US)</option>
        </select>
        {!supported && <span className="text-danger small">Voice input not supported in this browser.</span>}
      </div>

      <textarea
        className="form-control mb-3"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Speak ${lang === 'km-KH' ? 'Khmer' : 'English'} or type to transcribe`}
      />
    </div>
  )
}

