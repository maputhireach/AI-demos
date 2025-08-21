import { useEffect, useRef, useState } from 'react'

type Prediction = { className: string; probability: number }

export default function ImageClassifier() {
  const [model, setModel] = useState<any>(null)
  const [preds, setPreds] = useState<Prediction[] | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const tf = await import('@tensorflow/tfjs')
      // dynamic import to reduce initial bundle
      const mobilenet = await import('@tensorflow-models/mobilenet')
      await tf.ready()
      const loaded = await mobilenet.load()
      if (isMounted) setModel(loaded)
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file)
    if (imgRef.current) {
      imgRef.current.src = url
      setPreds(null)
      // Wait image load
      imgRef.current.onload = async () => {
        if (!model || !imgRef.current) return
        const results: any = await model.classify(imgRef.current)
        setPreds(results as Prediction[])
      }
    }
  }

  return (
    <div>
      <input
        className="form-control mb-3"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <div className="text-center mb-3">
        <img ref={imgRef} alt="preview" style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain' }} />
      </div>
      <div>
        <h6>Predictions</h6>
        {preds ? (
          <ul className="mb-0">
            {preds.map((p) => (
              <li key={p.className}>
                {p.className} — {(p.probability * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">Upload an image to classify.</p>
        )}
      </div>
    </div>
  )
}


