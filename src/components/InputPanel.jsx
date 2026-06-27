import { useEffect } from 'react'
import styles from './InputPanel.module.css'

export default function InputPanel({ value, onChange, onSubmit, onLoadExample, onClear, loading }) {
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onSubmit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSubmit])

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Input Node Edges</div>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Enter edges, one per line or comma-separated:\nA->B, A->C, B->D, C->E\nG->H, G->I\nX->Y, Y->Z, Z->X\nhello, 1->2, A->`}
        id="inputArea"
      />
      <p className={styles.hint}>
        Format: <code className={styles.code}>X→Y</code> where X and Y are single uppercase letters (A–Z). Separate by comma or newline.
      </p>
      <div className={styles.actions}>
        <button
          id="submitBtn"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner} /> : null}
          <span className={styles.btnLabel}>
            {loading ? 'Analyzing…' : '⚡ Analyze Hierarchy'}
          </span>
        </button>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onLoadExample}>
          Load Example
        </button>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  )
}
