import { useState, useCallback, useMemo, useRef, useEffect } from 'react'

export interface DateSelectorProps {
  /** The start date for the timeline (required) */
  startDate: Date
  /** The end date for the timeline (defaults to today) */
  endDate?: Date
  /** The currently selected month */
  value?: Date | null
  /** Callback when a month is selected */
  onChange?: (date: Date | null) => void
  /** Orientation of the timeline bar */
  orientation?: 'horizontal' | 'vertical'
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** Custom class name */
  className?: string
}

interface MonthSelectorProps {
  year: number
  position: { x: number; y: number }
  orientation: 'horizontal' | 'vertical'
  locale: string
  selectedMonth: number | null
  onSelect: (month: number) => void
  startDate: Date
  endDate: Date
}

function MonthSelector({
  year,
  position,
  orientation,
  locale,
  selectedMonth,
  onSelect,
  startDate,
  endDate,
}: MonthSelectorProps) {
  const months = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(year, i, 1)
      return {
        index: i,
        name: formatter.format(date),
        disabled:
          date < new Date(startDate.getFullYear(), startDate.getMonth(), 1) ||
          date > new Date(endDate.getFullYear(), endDate.getMonth(), 1),
      }
    })
  }, [year, locale, startDate, endDate])

  const style: React.CSSProperties =
    orientation === 'horizontal'
      ? {
          position: 'absolute',
          left: position.x,
          bottom: '100%',
          transform: 'translateX(-50%)',
          marginBottom: 8,
        }
      : {
          position: 'absolute',
          top: position.y,
          left: '100%',
          transform: 'translateY(-50%)',
          marginLeft: 8,
        }

  return (
    <div
      style={style}
      className="z-50 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
    >
      <div className="mb-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
        {year}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {months.map((month) => (
          <button
            key={month.index}
            type="button"
            disabled={month.disabled}
            onClick={() => onSelect(month.index)}
            className={`rounded px-2 py-1.5 text-xs font-medium transition-colors ${
              selectedMonth === month.index
                ? 'bg-blue-500 text-white'
                : month.disabled
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {month.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DateSelector({
  startDate,
  endDate: endDateProp,
  value,
  onChange,
  orientation = 'vertical',
  locale = 'en-US',
  className = '',
}: DateSelectorProps) {
  const endDate = useMemo(() => endDateProp || new Date(), [endDateProp])
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverYear, setHoverYear] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  const years = useMemo(() => {
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()
    const result: number[] = []
    for (let year = startYear; year <= endYear; year++) {
      result.push(year)
    }
    return result
  }, [startDate, endDate])

  const selectedYear = value?.getFullYear() ?? null
  const selectedMonth = value?.getMonth() ?? null

  const handleBarMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      let ratio: number

      if (orientation === 'horizontal') {
        ratio = (e.clientX - rect.left) / rect.width
      } else {
        ratio = (e.clientY - rect.top) / rect.height
      }

      ratio = Math.max(0, Math.min(1, ratio))
      const yearIndex = Math.floor(ratio * years.length)
      const clampedIndex = Math.min(yearIndex, years.length - 1)
      const year = years[clampedIndex]

      if (year !== hoverYear) {
        setHoverYear(year)
      }

      if (orientation === 'horizontal') {
        const yearWidth = rect.width / years.length
        const yearStartX = clampedIndex * yearWidth
        setHoverPosition({ x: yearStartX, y: 0 })
      } else {
        const yearHeight = rect.height / years.length
        const yearStartY = clampedIndex * yearHeight
        setHoverPosition({ x: 0, y: yearStartY })
      }
    },
    [orientation, years, hoverYear]
  )

  const handleBarMouseLeave = useCallback(() => {
    setHoverYear(null)
  }, [])

  const handleMonthSelect = useCallback(
    (month: number) => {
      if (hoverYear !== null) {
        const selectedDate = new Date(hoverYear, month, 1)
        onChange?.(selectedDate)
      }
    },
    [hoverYear, onChange]
  )

  // Close month selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setHoverYear(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHorizontal = orientation === 'horizontal'

  const containerClasses = isHorizontal
    ? 'relative flex h-16 w-full min-w-64 flex-col'
    : 'relative flex h-full min-h-64 w-16 flex-row'

  const barContainerClasses = isHorizontal
    ? 'relative flex h-8 w-full cursor-pointer items-center'
    : 'relative flex h-full w-8 cursor-pointer flex-col items-center'

  const barClasses = isHorizontal
    ? 'relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-600'
    : 'relative h-full w-2 rounded-full bg-slate-200 dark:bg-slate-600'

  const labelsContainerClasses = isHorizontal
    ? 'relative mt-1 flex h-6 w-full justify-between'
    : 'relative ml-1 flex h-full w-6 flex-col justify-between'

  return (
    <div
      ref={containerRef}
      className={`select-none font-sans ${containerClasses} ${className}`}
      role="application"
      aria-label="Date selector"
    >
      {/* Bar container */}
      <div
        className={barContainerClasses}
        onMouseMove={handleBarMouseMove}
        onMouseLeave={handleBarMouseLeave}
      >
        {/* Background bar */}
        <div className={barClasses}>
          {/* Year tick marks */}
          {years.map((year, index) => {
            const position = (index / years.length) * 100
            const isSelected = year === selectedYear
            const isHovered = year === hoverYear

            const tickStyle: React.CSSProperties = isHorizontal
              ? { left: `${position}%` }
              : { top: `${position}%` }

            return (
              <div
                key={year}
                className={`absolute ${isHorizontal ? '-translate-x-1/2' : '-translate-y-1/2'} h-2 w-2 rounded-full transition-all ${
                  isSelected
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : isHovered
                      ? 'bg-slate-500 dark:bg-slate-400'
                      : 'bg-slate-400 dark:bg-slate-500'
                }`}
                style={tickStyle}
              />
            )
          })}
        </div>

        {/* Month selector popup */}
        {hoverYear !== null && (
          <MonthSelector
            year={hoverYear}
            position={hoverPosition}
            orientation={orientation}
            locale={locale}
            selectedMonth={selectedYear === hoverYear ? selectedMonth : null}
            onSelect={handleMonthSelect}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>

      {/* Year labels */}
      <div className={labelsContainerClasses}>
        {years.length <= 10 ? (
          // Show all years if 10 or fewer
          years.map((year, index) => {
            const position = (index / years.length) * 100
            const style: React.CSSProperties = isHorizontal
              ? { left: `${position}%`, transform: 'translateX(-50%)' }
              : { top: `${position}%`, transform: 'translateY(-50%)' }

            return (
              <span
                key={year}
                className="absolute text-xs text-slate-500 dark:text-slate-400"
                style={style}
              >
                {year}
              </span>
            )
          })
        ) : (
          // Show only first and last year if more than 10
          <>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {years[0]}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {years[years.length - 1]}
            </span>
          </>
        )}
      </div>

      {/* Selected date indicator */}
      {value && (
        <div
          className={`mt-2 text-sm text-slate-600 dark:text-slate-300 ${isHorizontal ? 'text-center' : ''}`}
        >
          {new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
          }).format(value)}
        </div>
      )}
    </div>
  )
}

export default DateSelector
