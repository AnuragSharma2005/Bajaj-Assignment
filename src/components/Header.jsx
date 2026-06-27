import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.badge}>
        <span className={styles.dot}></span>
        Chitkara Full Stack Challenge — Round 1
      </div>
      <h1 className={styles.title}>Hierarchy Visualizer</h1>
      <p className={styles.subtitle}>
        Enter node edges, process hierarchical relationships, and explore tree structures — all in real time.
      </p>
    </header>
  )
}
