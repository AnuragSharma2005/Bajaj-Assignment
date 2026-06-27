import styles from './HierarchyGrid.module.css'

export default function HierarchyGrid({ hierarchies = [] }) {
  if (hierarchies.length === 0) return <div className={styles.empty}>No hierarchies to display.</div>

  const renderTreeText = (tree, prefix = '', isRoot = true) => {
    let lines = ''
    const keys = Object.keys(tree)
    keys.forEach((key, i) => {
      const isLast = i === keys.length - 1
      const connector = isRoot ? '' : (isLast ? '└─ ' : '├─ ')
      const childPrefix = isRoot ? '' : (isLast ? '   ' : '│  ')
      lines += prefix + connector + key + '\n'
      lines += renderTreeText(tree[key], prefix + childPrefix, false)
    })
    return lines
  }

  return (
    <div className={styles.grid}>
      {hierarchies.map((h, i) => (
        <div key={i} className={`${styles.card} ${h.has_cycle ? styles.cyclic : ''}`}>
          <div className={styles.header}>
            <span className={styles.root}>{h.root}</span>
            {h.has_cycle ? (
              <span className={styles.cycleBadge}>⟳ Cycle</span>
            ) : (
              <span className={styles.depthBadge}>Depth {h.depth}</span>
            )}
          </div>
          <div className={styles.visual}>
            {h.has_cycle ? '(cyclic group — no tree)' : renderTreeText(h.tree, '', true)}
          </div>
        </div>
      ))}
    </div>
  )
}
