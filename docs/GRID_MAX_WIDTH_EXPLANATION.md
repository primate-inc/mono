# Grid Max-Width Explanation

## Why Max-Width Includes Margins

The max-width is calculated to include both margin columns to ensure that the measurement is from the outer edge of the first margin to the outer edge of the last margin (edge-to-edge of the entire grid).

## Visual Representation

```
┌───────────────────────────── max-width: 76rem ─────────────────────────────┐
│                                                                              │
│  ┌─────────┬─────────────────────────────────────────────┬─────────┐       │
│  │ MARGIN  │          CONTENT AREA (75rem)               │ MARGIN  │       │
│  │ 0.5rem  │          (flexible 1fr columns)             │ 0.5rem  │       │
│  └─────────┴─────────────────────────────────────────────┴─────────┘       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Calculation

For each breakpoint:

### XX Breakpoint
- Token max-width: `75rem`
- Left margin: `0.5rem`
- Right margin: `0.5rem`
- **Actual max-width: `76rem`** = `calc(75rem + 0.5rem + 0.5rem)`

### SM Breakpoint  
- Token max-width: `75rem`
- Left margin: `2rem`
- Right margin: `2rem`
- **Actual max-width: `79rem`** = `calc(75rem + 2rem + 2rem)`

### MD Breakpoint
- Token max-width: `75rem`
- Left margin: `4rem`
- Right margin: `4rem`
- **Actual max-width: `83rem`** = `calc(75rem + 4rem + 4rem)`

## Why This Matters

### Without margin adjustment:
```css
/* WRONG - margins would eat into the 75rem content area */
max-width: 75rem;
grid-template-columns: 4rem 1fr ... 1fr 4rem;

/* At max-width, the 1fr columns would only have 67rem (75 - 8) */
```

### With margin adjustment:
```css
/* CORRECT - content area gets the full 75rem */
max-width: 83rem;  /* 75rem + 4rem + 4rem */
grid-template-columns: 4rem 1fr ... 1fr 4rem;

/* At max-width, the 1fr columns get the full 75rem */
```

## Formula

```scss
actual-max-width = token-max-width + left-margin + right-margin
```

In the SCSS code:
```scss
max-width: calc($max-width + $margin + $margin);
```

## Real-World Example

With MD breakpoint settings:
- Content area should be: `75rem` (as designed)
- Left margin: `4rem`
- Right margin: `4rem`
- **Total width**: `83rem`

This ensures that:
1. The content area gets exactly `75rem` of space
2. The margins are `4rem` on each side as specified in tokens
3. The total grid measures `83rem` from edge to edge

## Testing

You can verify this by inspecting the compiled CSS:

```css
body {
  grid-template-columns: 4rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 4rem;
  max-width: 83rem;
}
```

When the viewport is exactly `83rem` wide:
- First column (margin): `4rem`
- Content columns (1fr each): They share the remaining `75rem`
- Last column (margin): `4rem`
- Total: `4rem + 75rem + 4rem = 83rem` ✓

