import './App.css'

import SpeechTranscriber from './components/AI speech'
import TextSummarizer from './components/TextSummarizer'
import ImageClassifier from './components/ImageClassifier'

function App() {
  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">AI Demos</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card h-100 bg-light border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Speech Transcriber</h5>
              <p className="text-muted">Speak in Khmer or English, or type to transcribe.</p>
              <SpeechTranscriber />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 bg-light border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Text Summarizer</h5>
              <p className="text-muted">Frequency-based extractive summary.</p>
              <TextSummarizer />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 bg-light border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Image Classifier</h5>
              <p className="text-muted">MobileNet (TensorFlow.js) predictions.</p>
              <ImageClassifier />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
