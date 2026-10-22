import { useEffect, useState } from 'react'
import { getAchievements, type Achievement } from '../api/client'
import AchievementCard from '../components/AchievementCard'

const YEARS = ['All', 2026, 2025, 2024, 2023]
const POSITIONS = ['All', 'Championship', 'Champions', 'Runner-up', 'Best Team', 'Other']

export default function Achievements() {
  const [items, setItems] = useState<Achievement[]>([])
  const [year, setYear] = useState('All')
  const [position, setPosition] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAchievements({
      year: year !== 'All' ? Number(year) : undefined,
      position: position !== 'All' ? position : undefined,
      search: search || undefined,
    })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
  }, [year, position, search])

  return (
    <div className="page">
      <section className="section">
        <div className="section__head"><h2>ACHIEVEMENTS</h2></div>
        <div className="filters">
          <div className="filters__group">
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((y) => <option key={String(y)} value={String(y)}>{y}</option>)}
            </select>
          </div>
          <div className="filters__group">
            <label>Category</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="filters__group filters__group--search">
            <label>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tournament name…" />
          </div>
        </div>
        <div className="grid grid--cards">
          {items.map((a) => <AchievementCard key={a.id} a={a} />)}
        </div>
        {items.length === 0 && <p className="empty">No achievements match these filters.</p>}
      </section>
    </div>
  )
}
