import { useState } from 'react'
import { DateSelector } from './components'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [locale, setLocale] = useState('en-US')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'vertical'
  )

  // Start date is 15 years ago
  const startDate = new Date(new Date().getFullYear() - 15, 0, 1)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 to-purple-600 p-6 dark:from-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="mb-8 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold">DateSelector</h1>
        <p className="text-lg opacity-90">
          A timeline-based date selector for media galleries
        </p>
      </header>

      {/* Main content */}
      <main className="mx-auto flex flex-1 flex-wrap items-stretch justify-center gap-8">
        {/* Demo */}
        <section
          className={`flex justify-center rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800 ${
            orientation === 'horizontal' ? 'w-full max-w-2xl' : 'h-full'
          }`}
        >
          {orientation === 'horizontal' ? (
            <DateSelector
              startDate={startDate}
              value={selectedDate}
              onChange={setSelectedDate}
              locale={locale}
              orientation={orientation}
              className="w-full"
            />
          ) : (
            <div className="h-full py-4">
              <DateSelector
                startDate={startDate}
                value={selectedDate}
                onChange={setSelectedDate}
                locale={locale}
                orientation={orientation}
              />
            </div>
          )}
        </section>

        {/* Controls */}
        <section className="w-72 self-start rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
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

          {/* Orientation select */}
          <div className="mb-4">
            <label
              htmlFor="orientation"
              className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Orientation
            </label>
            <select
              id="orientation"
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as 'horizontal' | 'vertical')
              }
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          {/* Selected value display */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Selected month
            </h3>
            <code className="block break-all rounded-md bg-slate-100 px-3 py-2.5 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {selectedDate
                ? new Intl.DateTimeFormat(locale, {
                    month: 'long',
                    year: 'numeric',
                  }).format(selectedDate)
                : 'null'}
            </code>
          </div>

          {/* Clear button */}
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="mt-4 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Clear selection
            </button>
          )}
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
