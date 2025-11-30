import { useState, useCallback, useMemo } from 'react'
import './DateSelector.css'

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
const MONTHS_IN_YEAR = 12

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
      // Create a date that falls on the correct day of week
      const date = new Date(2024, 0, dayIndex) // Jan 2024 starts on Monday
      // Adjust to get correct day
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

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(viewYear, viewMonth, day))
    }

    // Pad to complete the last week
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

  return (
    <div
      className={`date-selector ${disabled ? 'date-selector--disabled' : ''} ${className}`}
      role="application"
      aria-label="Date selector"
    >
      <div className="date-selector__header">
        <div className="date-selector__nav">
          <button
            type="button"
            className="date-selector__nav-button"
            onClick={goToPreviousYear}
            disabled={disabled}
            aria-label="Previous year"
          >
            ««
          </button>
          <button
            type="button"
            className="date-selector__nav-button"
            onClick={goToPreviousMonth}
            disabled={disabled}
            aria-label="Previous month"
          >
            «
          </button>
        </div>

        <div className="date-selector__title">
          <span className="date-selector__month">{monthName}</span>
          <span className="date-selector__year">{viewYear}</span>
        </div>

        <div className="date-selector__nav">
          <button
            type="button"
            className="date-selector__nav-button"
            onClick={goToNextMonth}
            disabled={disabled}
            aria-label="Next month"
          >
            »
          </button>
          <button
            type="button"
            className="date-selector__nav-button"
            onClick={goToNextYear}
            disabled={disabled}
            aria-label="Next year"
          >
            »»
          </button>
        </div>
      </div>

      <div className="date-selector__calendar" role="grid">
        <div className="date-selector__weekdays" role="row">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="date-selector__weekday"
              role="columnheader"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="date-selector__days">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="date-selector__day date-selector__day--empty"
                  role="gridcell"
                />
              )
            }

            const isSelected = isSameDay(value, date)
            const isToday = isSameDay(today, date)
            const isDisabled = isDateDisabled(date, minDate, maxDate)

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={`date-selector__day ${isSelected ? 'date-selector__day--selected' : ''} ${isToday ? 'date-selector__day--today' : ''} ${isDisabled ? 'date-selector__day--disabled' : ''}`}
                onClick={() => handleDateSelect(date)}
                onKeyDown={(e) => handleKeyDown(e, date)}
                disabled={disabled || isDisabled}
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

      {value && (
        <div className="date-selector__footer">
          <span className="date-selector__selected-date">
            Selected: {value.toLocaleDateString(locale, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <button
            type="button"
            className="date-selector__clear-button"
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
