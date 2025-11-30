import { useState } from 'react'
import { DateSelector } from './components'
import './App.css'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [locale, setLocale] = useState('en-US')
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<0 | 1>(0)
  const [disabled, setDisabled] = useState(false)
  const [useMinMax, setUseMinMax] = useState(false)

  const today = new Date()
  const minDate = useMinMax ? new Date(today.getFullYear(), today.getMonth(), 1) : undefined
  const maxDate = useMinMax
    ? new Date(today.getFullYear(), today.getMonth() + 2, 0)
    : undefined

  return (
    <div className="app">
      <header className="app__header">
        <h1>📅 DateSelector</h1>
        <p>A flexible and accessible React date selector component</p>
      </header>

      <main className="app__main">
        <section className="app__demo">
          <DateSelector
            value={selectedDate}
            onChange={setSelectedDate}
            locale={locale}
            firstDayOfWeek={firstDayOfWeek}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
          />
        </section>

        <section className="app__controls">
          <h2>Options</h2>

          <div className="control-group">
            <label htmlFor="locale">Locale</label>
            <select
              id="locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">German</option>
              <option value="fr-FR">French</option>
              <option value="es-ES">Spanish</option>
              <option value="ja-JP">Japanese</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="nb-NO">Norwegian</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="firstDay">First day of week</label>
            <select
              id="firstDay"
              value={firstDayOfWeek}
              onChange={(e) => setFirstDayOfWeek(Number(e.target.value) as 0 | 1)}
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
          </div>

          <div className="control-group control-group--checkbox">
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              Disabled
            </label>
          </div>

          <div className="control-group control-group--checkbox">
            <label>
              <input
                type="checkbox"
                checked={useMinMax}
                onChange={(e) => setUseMinMax(e.target.checked)}
              />
              Limit to current & next month
            </label>
          </div>

          <div className="control-group">
            <h3>Selected value</h3>
            <code className="value-display">
              {selectedDate ? selectedDate.toISOString() : 'null'}
            </code>
          </div>
        </section>
      </main>

      <footer className="app__footer">
        <p>
          <a
            href="https://github.com/hakonkrogh/date-selector"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          {' · '}
          MIT License
        </p>
      </footer>
    </div>
  )
}

export default App
