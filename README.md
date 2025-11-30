# DateSelector

A flexible and accessible React date selector component.

[**Live Demo**](https://hakonkrogh.github.io/date-selector)

## Features

- Fully accessible with ARIA labels and keyboard navigation
- Locale-aware formatting for months and weekdays
- Configurable first day of week
- Optional min/max date constraints
- Dark mode support (automatic via Tailwind)
- Styled with Tailwind CSS
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

The component uses Tailwind CSS classes. You can customize the appearance by passing a `className` prop or by extending Tailwind's theme in your project.

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
