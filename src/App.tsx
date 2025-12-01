import { useState } from 'react'
import { DateSelector } from './components'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [locale, setLocale] = useState('en-US')

  // Start date is 15 years ago
  const startDate = new Date(new Date().getFullYear() - 15, 0, 1)

  return (
    <div className="flex h-dvh bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-slate-800 dark:to-slate-900">
      {/* Content area */}
      <main className="flex flex-1 flex-col p-6">
        {/* Header */}
        <header className="mb-8 text-white">
          <h1 className="mb-2 text-4xl font-bold">DateSelector</h1>
          <p className="text-lg opacity-90">
            A timeline-based date selector for media galleries
          </p>
        </header>

        {/* Selected date display */}
        <section className="mb-8">
          <div className="inline-block rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-white/70">
              Selected date
            </h2>
            <p className="text-3xl font-light text-white">
              {selectedDate
                ? new Intl.DateTimeFormat(locale, {
                    month: 'long',
                    year: 'numeric',
                  }).format(selectedDate)
                : 'No date selected'}
            </p>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="mt-3 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>
        </section>

        {/* Options */}
        <section className="mb-8">
          <label
            htmlFor="locale"
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            Locale
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="cursor-pointer rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="en-US" className="text-slate-800">
              English (US)
            </option>
            <option value="en-GB" className="text-slate-800">
              English (UK)
            </option>
            <option value="de-DE" className="text-slate-800">
              German
            </option>
            <option value="fr-FR" className="text-slate-800">
              French
            </option>
            <option value="es-ES" className="text-slate-800">
              Spanish
            </option>
            <option value="ja-JP" className="text-slate-800">
              Japanese
            </option>
            <option value="zh-CN" className="text-slate-800">
              Chinese (Simplified)
            </option>
            <option value="nb-NO" className="text-slate-800">
              Norwegian
            </option>
          </select>
        </section>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <footer className="text-white/70">
          <p>
            <a
              href="https://github.com/hakonkrogh/date-selector"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:underline"
            >
              View on GitHub
            </a>
            {' · '}
            MIT License
          </p>
        </footer>
      </main>

      {/* Date selector - positioned like a scrollbar at block-end */}
      <aside className="flex h-full items-center border-l border-white/10 bg-white/5 px-4 py-6 backdrop-blur-sm">
        <DateSelector
          startDate={startDate}
          value={selectedDate}
          onChange={setSelectedDate}
          locale={locale}
          orientation="vertical"
          className="h-full"
        />
      </aside>
    </div>
  )
}

export default App
