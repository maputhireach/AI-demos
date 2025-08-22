import { useEffect, useRef, useState } from 'react'

export default function SpeechTranscriber() {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<'en-US' | 'km-KH'>('en-US')
  const [isInitialized, setIsInitialized] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for speech recognition support
    const checkSupport = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSupported(true)
        return SpeechRecognition
      }
      return null
    }

    const SpeechRecognition = checkSupport()
    if (!SpeechRecognition) {
      setSupported(false)
      setError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.')
      return
    }

    // Initialize speech recognition
    try {
      const recognition = new SpeechRecognition()
      
      // Configure recognition settings
      recognition.lang = lang
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      // Event handlers
      recognition.onstart = () => {
        setListening(true)
        setError(null)
        console.log('Speech recognition started')
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setText(prev => prev ? prev + ' ' + finalTranscript : finalTranscript)
        }
      }

      recognition.onend = () => {
        setListening(false)
        console.log('Speech recognition ended')
      }

      recognition.onerror = (event: any) => {
        setListening(false)
        let errorMessage = 'Speech recognition error occurred'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone access denied. Please check permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your connection.'
            break
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.'
            break
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed.'
            break
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.'
            break
          case 'language-not-supported':
            errorMessage = 'Language not supported. Try switching to English.'
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        
        setError(errorMessage)
        console.error('Speech recognition error:', event.error)
      }

      recognitionRef.current = recognition
      setIsInitialized(true)
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err)
      setError('Failed to initialize speech recognition. Please refresh the page.')
      setSupported(false)
    }
  }, [lang])

  const startListening = () => {
    if (!recognitionRef.current || !isInitialized) {
      setError('Speech recognition not initialized. Please refresh the page.')
      return
    }

    try {
      setError(null)
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition. Please try again.')
      setListening(false)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    
    try {
      recognitionRef.current.stop()
    } catch (err) {
      console.error('Error stopping speech recognition:', err)
    }
  }

  const clearText = () => {
    setText('')
    setError(null)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="speech-transcriber">
      {/* Browser Support Check */}
      {!supported && (
        <div className="alert alert-warning" role="alert">
          <strong>Browser Not Supported:</strong> Speech recognition requires a modern browser like Chrome, Edge, or Safari.
          <br />
          <small>You can still type text manually below.</small>
        </div>
      )}

      {/* Language Selection */}
      <div className="mb-3">
        <label htmlFor="language-select" className="form-label">Recognition Language:</label>
        <select
          id="language-select"
          className="form-select"
          value={lang}
          onChange={(e) => {
            const next = e.target.value as 'en-US' | 'km-KH'
            if (listening) {
              stopListening()
            }
            setLang(next)
          }}
          disabled={!supported}
        >
          <option value="en-US">English (US)</option>
          <option value="km-KH">Khmer (Cambodia)</option>
        </select>
        <small className="text-muted">
          Note: Khmer support may vary by browser and system
        </small>
      </div>

      {/* Control Buttons */}
      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`}
          onClick={listening ? stopListening : startListening}
          disabled={!supported || !isInitialized}
        >
          <i className={`fa-solid ${listening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          {listening ? ' Stop Listening' : ' Start Listening'}
        </button>
        
        {text && (
          <>
            <button
              className="btn btn-outline-secondary"
              onClick={clearText}
              disabled={listening}
            >
              <i className="fa-solid fa-trash"></i> Clear
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={copyToClipboard}
              disabled={listening}
            >
              <i className="fa-solid fa-copy"></i> Copy
            </button>
          </>
        )}
      </div>

      {/* Status and Error Display */}
      {listening && (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Listening...</span>
          </div>
          Listening... Speak now
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Text Display */}
      <div className="mb-3">
        <label htmlFor="transcript" className="form-label">
          Transcript {text && `(${text.split(' ').length} words)`}:
        </label>
        <textarea
          id="transcript"
          className="form-control"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={supported ? 
            `Speak in ${lang === 'km-KH' ? 'Khmer' : 'English'} or type manually...` : 
            'Type your text here (speech recognition not supported)'
          }
          disabled={!supported}
        />
      </div>

      {/* Help Text */}
      <div className="small text-muted">
        <strong>Tips:</strong>
        <ul className="mb-0 mt-1">
          <li>Speak clearly and at a normal pace</li>
          <li>Ensure your microphone is working and accessible</li>
          <li>Try switching languages if recognition quality is poor</li>
          <li>Use a quiet environment for better results</li>
        </ul>
      </div>
    </div>
  )
}

