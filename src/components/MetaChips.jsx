import styles from './MetaChips.module.css'

export default function MetaChips({ title, items = [], type }) {
  const chipClass = type === 'invalid' ? styles.invalid : styles.duplicate

  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((item, i) => (
            <span key={i} className={`${styles.chip} ${chipClass}`}>
              {item || '""'}
            </span>
          ))
        ) : (
          <span className={styles.empty}>None</span>
        )}
      </div>
    </div>
  )
}
