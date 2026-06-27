import { useState } from 'react'
import styles from './RawJSONViewer.module.css'

export default function RawJSONViewer({ data }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.toggle} onClick={() => setOpen(!open)}>
        <div className={styles.title}>Raw API Response</div>
        <span className={`${styles.chevron} ${open ? styles.open : ''}`}>▾</span>
      </div>
      {open && (
        <div className={styles.body}>
          <pre className={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
