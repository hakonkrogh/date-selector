# DateSelector

A flexible and accessible React date selector component.

[**Live Demo**](https://hakonkrogh.github.io/date-selector)

## Features

- Fully accessible with ARIA labels and keyboard navigation
- Locale-aware formatting for months and weekdays
- Configurable first day of week
- Optional min/max date constraints
- Dark mode support
- Zero external dependencies (only React as peer dependency)
- Fully typed with TypeScript

## Installation

```bash
npm install @hakonkrogh/date-selector
```

## Usage

```tsx
import { useState } from 'react'
import { DateSelector } from '@hakonkrogh/date-selector'
import '@hakonkrogh/date-selector/styles.css'

function App() {
  const [date, setDate] = useState<Date | null>(null)

  return (
    <DateSelector
      value={date}
      onChange={setDate}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | The currently selected date |
| `onChange` | `(date: Date \| null) => void` | - | Callback when a date is selected |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Disable the selector |
| `locale` | `string` | `'en-US'` | Locale for formatting |
| `firstDayOfWeek` | `0-6` | `0` | First day of week (0 = Sunday) |
| `className` | `string` | `''` | Custom class name |

## Customization

The component uses CSS custom properties for theming. Override these to customize the appearance:

```css
.date-selector {
  --ds-primary: #3b82f6;
  --ds-primary-hover: #2563eb;
  --ds-background: #ffffff;
  --ds-surface: #f8fafc;
  --ds-border: #e2e8f0;
  --ds-text: #1e293b;
  --ds-text-muted: #64748b;
  --ds-text-disabled: #cbd5e1;
  --ds-today-bg: #fef3c7;
  --ds-today-border: #f59e0b;
  --ds-selected-bg: var(--ds-primary);
  --ds-selected-text: #ffffff;
  --ds-hover-bg: #f1f5f9;
  --ds-radius: 8px;
  --ds-radius-sm: 4px;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build the library
pnpm build:lib

# Build the preview site
pnpm build:preview

# Type check
pnpm typecheck
```

## License

MIT
