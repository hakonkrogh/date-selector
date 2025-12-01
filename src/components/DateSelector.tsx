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
  /** Reverse the order (newest first) */
  reversed?: boolean
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** Custom class name */
  className?: string
}

interface MonthSelectorProps {
  year: number
  position: { x: number; y: number }
  orientation: 'horizontal' | 'vertical'
  reversed: boolean
  locale: string
  selectedMonth: number | null
  hoveredFromBar: number | null
  onSelect: (month: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  startDate: Date
  endDate: Date
}

function MonthSelector({
  year,
  position,
  orientation,
  reversed,
  locale,
  selectedMonth,
  hoveredFromBar,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  startDate,
  endDate,
}: MonthSelectorProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)

  // Use local hover state if hovering directly on popup, otherwise use bar hover
  const displayedHoverMonth = hoveredMonth ?? hoveredFromBar

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

  const containerStyle: React.CSSProperties =
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

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      style={containerStyle}
      className="z-50 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Year label */}
      <div
        className={`text-center text-sm font-semibold text-slate-700 dark:text-slate-200 ${isHorizontal ? 'mb-2' : 'mb-2'}`}
      >
        {year}
      </div>

      {/* Month bar */}
      <div
        className={`relative flex cursor-pointer items-center ${
          isHorizontal ? 'h-8 w-48' : 'h-48 w-8 flex-col'
        }`}
      >
        {/* Background bar */}
        <div
          className={`relative rounded-full bg-slate-200 dark:bg-slate-600 ${
            isHorizontal ? 'h-2 w-full' : 'h-full w-2'
          }`}
        >
          {/* Month tick marks */}
          {months.map((month) => {
            const basePos = (month.index / 12) * 100
            const pos = reversed ? 100 - basePos - (100 / 12) : basePos
            const isSelected = selectedMonth === month.index
            const isHovered = displayedHoverMonth === month.index

            const tickStyle: React.CSSProperties = isHorizontal
              ? { left: `${pos}%` }
              : { top: `${pos}%` }

            return (
              <button
                key={month.index}
                type="button"
                disabled={month.disabled}
                onClick={() => onSelect(month.index)}
                onMouseEnter={() => setHoveredMonth(month.index)}
                onMouseLeave={() => setHoveredMonth(null)}
                className={`absolute h-3 w-3 rounded-full transition-all ${
                  isHorizontal
                    ? '-translate-x-1/2 -translate-y-1/2 top-1/2'
                    : '-translate-x-1/2 -translate-y-1/2 left-1/2'
                } ${
                  month.disabled
                    ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-700'
                    : isSelected
                      ? 'bg-blue-500 dark:bg-blue-400 scale-125'
                      : isHovered
                        ? 'bg-slate-500 dark:bg-slate-400 scale-110'
                        : 'bg-slate-400 dark:bg-slate-500 hover:scale-110'
                }`}
                style={tickStyle}
                aria-label={month.name}
              />
            )
          })}
        </div>
      </div>

      {/* Month label */}
      <div
        className={`text-center text-xs text-slate-500 dark:text-slate-400 ${isHorizontal ? 'mt-2' : 'mt-2'}`}
      >
        {displayedHoverMonth !== null
          ? months[displayedHoverMonth].name
          : selectedMonth !== null
            ? months[selectedMonth].name
            : '\u00A0'}
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
  reversed = false,
  locale = 'en-US',
  className = '',
}: DateSelectorProps) {
  const endDate = useMemo(() => endDateProp || new Date(), [endDateProp])
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hoverYear, setHoverYear] = useState<number | null>(null)
  const [hoverMonth, setHoverMonth] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [isPopupHovered, setIsPopupHovered] = useState(false)

  const years = useMemo(() => {
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()
    const result: number[] = []
    for (let year = startYear; year <= endYear; year++) {
      result.push(year)
    }
    return reversed ? result.reverse() : result
  }, [startDate, endDate, reversed])

  const selectedYear = value?.getFullYear() ?? null
  const selectedMonth = value?.getMonth() ?? null

  const handleBarMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Cancel any pending close timeout when moving on bar
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }

      // Don't update position while interacting with the popup
      if (isPopupHovered) {
        return
      }

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

      // Calculate which month within the year segment
      const yearSegmentSize = 1 / years.length
      const yearStartRatio = clampedIndex * yearSegmentSize
      const positionWithinYear = (ratio - yearStartRatio) / yearSegmentSize
      const baseMonthIndex = Math.min(Math.floor(positionWithinYear * 12), 11)
      const monthIndex = reversed ? 11 - baseMonthIndex : baseMonthIndex
      setHoverMonth(monthIndex)

      if (year !== hoverYear) {
        setHoverYear(year)
      }

      // Follow the cursor position along the bar's axis
      if (orientation === 'horizontal') {
        const cursorX = e.clientX - rect.left
        setHoverPosition({ x: cursorX, y: 0 })
      } else {
        const cursorY = e.clientY - rect.top
        setHoverPosition({ x: 0, y: cursorY })
      }
    },
    [orientation, years, hoverYear, isPopupHovered]
  )

  const handleBarMouseLeave = useCallback(() => {
    // Delay closing to give time to move to the popup
    closeTimeoutRef.current = setTimeout(() => {
      if (!isPopupHovered) {
        setHoverYear(null)
      }
    }, 150)
  }, [isPopupHovered])

  const handlePopupMouseEnter = useCallback(() => {
    // Cancel any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsPopupHovered(true)
  }, [])

  const handlePopupMouseLeave = useCallback(() => {
    setIsPopupHovered(false)
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const isHorizontal = orientation === 'horizontal'

  const containerClasses = isHorizontal
    ? 'relative flex w-full min-w-64 flex-col'
    : 'relative flex h-full min-h-64 flex-row'

  const barContainerClasses = isHorizontal
    ? 'relative flex h-16 w-full cursor-pointer items-center'
    : 'relative flex h-full w-16 cursor-pointer flex-col items-center'

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
            reversed={reversed}
            locale={locale}
            selectedMonth={selectedYear === hoverYear ? selectedMonth : null}
            hoveredFromBar={isPopupHovered ? null : hoverMonth}
            onSelect={handleMonthSelect}
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
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
