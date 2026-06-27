import styles from './SummaryStats.module.css'

export default function SummaryStats({ summary }) {
  const { total_trees = 0, total_cycles = 0, largest_tree_root = '—' } = summary || {}

  return (
    <div className={styles.row}>
      <div className={`${styles.stat} ${styles.trees}`}>
        <div className={styles.value}>{total_trees}</div>
        <div className={styles.label}>Valid Trees</div>
      </div>
      <div className={`${styles.stat} ${styles.cycles}`}>
        <div className={styles.value}>{total_cycles}</div>
        <div className={styles.label}>Cyclic Groups</div>
      </div>
      <div className={`${styles.stat} ${styles.largest}`}>
        <div className={styles.value}>{largest_tree_root || '—'}</div>
        <div className={styles.label}>Largest Tree Root</div>
      </div>
    </div>
  )
}
