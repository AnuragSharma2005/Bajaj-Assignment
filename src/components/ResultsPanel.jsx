import { useState } from 'react'
import SummaryStats from './SummaryStats.jsx'
import HierarchyGrid from './HierarchyGrid.jsx'
import MetaChips from './MetaChips.jsx'
import RawJSONViewer from './RawJSONViewer.jsx'
import styles from './ResultsPanel.module.css'

export default function ResultsPanel({ data }) {
  if (!data) return null

  const { summary, hierarchies, invalid_entries, duplicate_edges, user_id, email_id, college_roll_number } = data

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.userSection}>
        <div className={styles.userInfoItem}>
          <span className={styles.infoLabel}>User ID</span>
          <span className={styles.infoValue}>{user_id}</span>
        </div>
        <div className={styles.userInfoItem}>
          <span className={styles.infoLabel}>College Email</span>
          <span className={styles.infoValue}>{email_id}</span>
        </div>
        <div className={styles.userInfoItem}>
          <span className={styles.infoLabel}>Roll Number</span>
          <span className={styles.infoValue}>{college_roll_number}</span>
        </div>
      </div>

      <SummaryStats summary={summary} />
      
      <div className={styles.card}>
        <div className={styles.cardTitle}>Hierarchies</div>
        <HierarchyGrid hierarchies={hierarchies} />
      </div>

      <div className={styles.metaRow}>
        <MetaChips title="Invalid Entries" items={invalid_entries} type="invalid" />
        <MetaChips title="Duplicate Edges" items={duplicate_edges} type="duplicate" />
      </div>

      <RawJSONViewer data={data} />
    </div>
  )
}