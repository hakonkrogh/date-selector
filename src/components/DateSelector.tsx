import { useState, useCallback, useMemo } from 'react'

export interface DateSelectorProps {
  /** The currently selected date */
  value?: Date | null
  /** Callback when a date is selected */
  onChange?: (date: Date | null) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Disable the selector */
  disabled?: boolean
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** First day of week (0 = Sunday, 1 = Monday, etc.) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Custom class name */
  className?: string
}

const DAYS_IN_WEEK = 7

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(date1: Date | null | undefined, date2: Date): boolean {
  if (!date1) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  return false
}

export function DateSelector({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  locale = 'en-US',
  firstDayOfWeek = 0,
  className = '',
}: DateSelectorProps) {
  const today = useMemo(() => new Date(), [])

  const [viewDate, setViewDate] = useState(() => {
    return value || today
  })

  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  const monthName = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(viewDate)
  }, [viewDate, locale])

  const weekDays = useMemo(() => {
    const days: string[] = []
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const dayIndex = (firstDayOfWeek + i) % DAYS_IN_WEEK
      const adjustedDate = new Date(2024, 0, 7 + dayIndex)
      days.push(formatter.format(adjustedDate))
    }
    return days
  }, [locale, firstDayOfWeek])

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
    const startOffset = (firstDay - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK

    const days: (Date | null)[] = []

    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(viewYear, viewMonth, day))
    }

    while (days.length % DAYS_IN_WEEK !== 0) {
      days.push(null)
    }

    return days
  }, [viewYear, viewMonth, firstDayOfWeek])

  const goToPreviousMonth = useCallback(() => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1))
  }, [viewYear, viewMonth])

  const goToNextMonth = useCallback(() => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1))
  }, [viewYear, viewMonth])

  const goToPreviousYear = useCallback(() => {
    setViewDate(new Date(viewYear - 1, viewMonth, 1))
  }, [viewYear, viewMonth])

  const goToNextYear = useCallback(() => {
    setViewDate(new Date(viewYear + 1, viewMonth, 1))
  }, [viewYear, viewMonth])

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (disabled || isDateDisabled(date, minDate, maxDate)) return
      onChange?.(date)
    },
    [disabled, minDate, maxDate, onChange]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, date: Date) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleDateSelect(date)
      }
    },
    [handleDateSelect]
  )

  const navButtonClasses =
    'flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-slate-50 text-sm text-slate-700 transition-colors hover:border-blue-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-slate-600'

  const dayBaseClasses =
    'flex aspect-square items-center justify-center rounded text-sm font-medium transition-colors'

  return (
    <div
      className={`w-80 select-none rounded-lg border border-slate-200 bg-white p-4 font-sans dark:border-slate-600 dark:bg-slate-800 ${disabled ? 'pointer-events-none opacity-60' : ''} ${className}`}
      role="application"
      aria-label="Date selector"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            type="button"
            className={navButtonClasses}
            onClick={goToPreviousYear}
            disabled={disabled}
            aria-label="Previous year"
          >
            ««
          </button>
          <button
            type="button"
            className={navButtonClasses}
            onClick={goToPreviousMonth}
            disabled={disabled}
            aria-label="Previous month"
          >
            «
          </button>
        </div>

        <div className="flex gap-2 font-semibold">
          <span className="text-slate-800 dark:text-slate-100">{monthName}</span>
          <span className="text-slate-500 dark:text-slate-400">{viewYear}</span>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            className={navButtonClasses}
            onClick={goToNextMonth}
            disabled={disabled}
            aria-label="Next month"
          >
            »
          </button>
          <button
            type="button"
            className={navButtonClasses}
            onClick={goToNextYear}
            disabled={disabled}
            aria-label="Next year"
          >
            »»
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div role="grid">
        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7" role="row">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="py-2 text-center text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
              role="columnheader"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className={`${dayBaseClasses}`}
                  role="gridcell"
                />
              )
            }

            const isSelected = isSameDay(value, date)
            const isToday = isSameDay(today, date)
            const isDisabledDate = isDateDisabled(date, minDate, maxDate)

            let dayClasses = dayBaseClasses
            if (isSelected) {
              dayClasses += ' bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
            } else if (isToday) {
              dayClasses += ' border-2 border-amber-500 bg-amber-50 text-slate-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-slate-100 dark:hover:bg-amber-900/50'
            } else if (isDisabledDate) {
              dayClasses += ' cursor-not-allowed text-slate-300 dark:text-slate-600'
            } else {
              dayClasses += ' text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
            }

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={dayClasses}
                onClick={() => handleDateSelect(date)}
                onKeyDown={(e) => handleKeyDown(e, date)}
                disabled={disabled || isDisabledDate}
                role="gridcell"
                aria-selected={isSelected}
                aria-label={date.toLocaleDateString(locale, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                tabIndex={isSelected ? 0 : -1}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      {value && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-600">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Selected: {value.toLocaleDateString(locale, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <button
            type="button"
            className="rounded border border-slate-200 bg-transparent px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-blue-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            onClick={() => onChange?.(null)}
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default DateSelector
