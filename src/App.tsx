import { useState } from 'react'
import { DateSelector } from './components'

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 to-purple-600 p-6 dark:from-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="mb-8 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold">DateSelector</h1>
        <p className="text-lg opacity-90">A flexible and accessible React date selector component</p>
      </header>

      {/* Main content */}
      <main className="mx-auto flex flex-1 flex-wrap items-start justify-center gap-8">
        {/* Demo */}
        <section className="flex justify-center">
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

        {/* Controls */}
        <section className="w-72 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
          <h2 className="mb-5 text-xl font-semibold text-slate-800 dark:text-slate-100">
            Options
          </h2>

          {/* Locale select */}
          <div className="mb-4">
            <label
              htmlFor="locale"
              className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Locale
            </label>
            <select
              id="locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
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

          {/* First day of week select */}
          <div className="mb-4">
            <label
              htmlFor="firstDay"
              className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              First day of week
            </label>
            <select
              id="firstDay"
              value={firstDayOfWeek}
              onChange={(e) => setFirstDayOfWeek(Number(e.target.value) as 0 | 1)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
          </div>

          {/* Disabled checkbox */}
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              Disabled
            </label>
          </div>

          {/* Min/Max checkbox */}
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={useMinMax}
                onChange={(e) => setUseMinMax(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              Limit to current & next month
            </label>
          </div>

          {/* Selected value display */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Selected value
            </h3>
            <code className="block break-all rounded-md bg-slate-100 px-3 py-2.5 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {selectedDate ? selectedDate.toISOString() : 'null'}
            </code>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-white">
        <p>
          <a
            href="https://github.com/hakonkrogh/date-selector"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
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
