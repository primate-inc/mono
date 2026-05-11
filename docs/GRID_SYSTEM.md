# MONO Grid System

## Overview

The MONO grid system is a token-based CSS Grid layout system that uses fixed-width margins and gaps as actual grid columns, providing precise control over spacing and content areas.

## Grid Structure

The grid follows this pattern:
```
┌─────────┬───┬───┬───┬───┬───┬───┬───┬───┬─────────┐
│ margin  │col│gap│col│gap│col│gap│col│gap│  margin │
└─────────┴───┴───┴───┴───┴───┴───┴───┴───┴─────────┘
```

### Components

- **Margin columns** (first and last): Fixed-width columns using token values
- **Gap columns**: Fixed-width columns between content columns
- **Content columns**: Flexible columns using `1fr` units
- **Max-width**: Container constraint

## Key Features

1. **Respects minimal margin**: Margins are defined as first and last columns with token-based values
2. **Gaps as columns**: Gaps use fixed widths as grid columns instead of CSS `gap` property
3. **Container max-width**: Max-width properly constrains the entire grid container
4. **Fully responsive**: Different configurations for each breakpoint

## Token Configuration

The grid system requires these tokens in your design system:

```scss
$tokens: (
  'size': (
    'grid': (
      'columns': (
        '@xx': 4,    // Number of content columns
        '@sm': 6,
        '@md': 12
      ),
      'gap': (
        '@xx': 0.25rem,  // Width of gap columns
        '@sm': 1rem,
        '@md': 2rem
      ),
      'margin': (
        '@xx': 0.5rem,   // Width of margin columns
        '@sm': 2rem,
        '@md': 4rem
      ),
      'max-width': (
        '@xx': 75rem,    // Container max-width
        '@sm': 75rem,
        '@md': 75rem
      )
    )
  )
);
```

## Generated Grid Template Examples

### XX Breakpoint (4 columns)
```css
grid-template-columns: 0.5rem 1fr 0.25rem 1fr 0.25rem 1fr 0.25rem 1fr 0.5rem;
max-width: 76rem; /* 75rem + 0.5rem + 0.5rem - includes margins */
```
Total: 1 margin + 4 content + 3 gaps + 1 margin = **9 grid columns**

### SM Breakpoint (6 columns)
```css
grid-template-columns: 2rem 1fr 1rem 1fr 1rem 1fr 1rem 1fr 1rem 1fr 1rem 1fr 2rem;
max-width: 79rem; /* 75rem + 2rem + 2rem - includes margins */
```
Total: 1 margin + 6 content + 5 gaps + 1 margin = **13 grid columns**

### MD Breakpoint (12 columns)
```css
grid-template-columns: 4rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 2rem 1fr 4rem;
max-width: 83rem; /* 75rem + 4rem + 4rem - includes margins */
```
Total: 1 margin + 12 content + 11 gaps + 1 margin = **25 grid columns**

## Usage

### Basic Usage

```scss
@use 'mono';

.container {
  @include mono.responsive-grid();
}

.content {
  // Span from first content column to last content column
  // Skip the margin columns (first and last)
  grid-column: 2 / -2;
}
```

### Custom Grid Path

```scss
@use 'mono';

.container {
  @include mono.grid('custom-grid');
}
```

### Spanning Specific Columns

```scss
// Span from 2nd content column to 5th content column (xx breakpoint)
// Remember: grid-column index includes margins and gaps
// Column 2 = first content column
// Column 4 = second content column
// Column 6 = third content column
.wide-content {
  grid-column: 2 / 8;  // Spans 3 content columns + 2 gaps
}

// Full width including margins
.full-width {
  grid-column: 1 / -1;
}

// Exclude margins but include all content
.content-width {
  grid-column: 2 / -2;
}
```

## Visual Grid Demonstration

Add this to your HTML to visualize the grid:

```html
<div class="grid">
  <!-- Add items equal to the total grid columns -->
  <!-- For MD breakpoint: 25 items -->
  <div class="grid__item"></div>
  <!-- ... repeat for all columns ... -->
</div>
```

```scss
.grid {
  @include mono.responsive-grid();
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100vh;
  
  & > * {
    height: 100vh;
  }

  // Margin columns (red)
  & > :first-child,
  & > :last-child {
    background: rgba(255, 0, 0, 0.1);
    border: 1px dashed rgba(255, 0, 0, 0.3);
  }

  // Gap columns (blue) - adjust nth-child for your breakpoint
  & > :nth-child(3), 
  & > :nth-child(5), 
  & > :nth-child(7) {
    background: rgba(0, 0, 255, 0.1);
    border: 1px dashed rgba(0, 0, 255, 0.3);
  }
  
  // Content columns (green)
  & > :nth-child(2), 
  & > :nth-child(4), 
  & > :nth-child(6), 
  & > :nth-child(8) {
    background: rgba(0, 255, 0, 0.1);
    border: 1px dashed rgba(0, 255, 0, 0.3);
  }
}
```

## Benefits

1. **Precise control**: Fixed-width margins and gaps ensure consistent spacing
2. **Token-based**: All values come from design tokens, ensuring design consistency
3. **Flexible content**: Content columns use `1fr` for fluid layouts
4. **Responsive**: Different configurations per breakpoint
5. **Accessible**: Standard CSS Grid properties work as expected

## Migration from Old Grid System

### Old System (gap property)
```scss
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  max-width: 75rem;
}
```

### New System (gap as columns)
```scss
.container {
  @include responsive-grid();
  // grid-template-columns: 0.5rem 1fr 0.25rem 1fr 0.25rem 1fr 0.25rem 1fr 0.5rem;
  // max-width: 75rem;
}

.content {
  grid-column: 2 / -2;  // Important: Skip margin columns
}
```

## Column Index Reference

For the **XX breakpoint (4 columns)**:

| Index | Type    | Description         |
|-------|---------|---------------------|
| 1     | Margin  | Left margin         |
| 2     | Content | 1st content column  |
| 3     | Gap     | 1st gap             |
| 4     | Content | 2nd content column  |
| 5     | Gap     | 2nd gap             |
| 6     | Content | 3rd content column  |
| 7     | Gap     | 3rd gap             |
| 8     | Content | 4th content column  |
| 9     | Margin  | Right margin        |

## Troubleshooting

### Content not respecting margins
Make sure to use `grid-column: 2 / -2` to skip the margin columns.

### Grid items not aligning
Check that you have the correct number of grid items for your breakpoint:
- XX: 9 items
- SM: 13 items
- MD: 25 items

### Max-width not applied
The max-width is applied to the grid container itself, not to individual items.

## API Reference

### `responsive-grid()`
Applies the default grid layout using tokens from `size.grid`.

```scss
@mixin responsive-grid()
```

### `grid($keys...)`
Applies a custom grid layout using tokens from a custom path.

```scss
@mixin grid($keys...)
```

**Parameters:**
- `$keys`: Token path keys (e.g., `'custom-grid'`)

**Example:**
```scss
.container {
  @include grid('page', 'layout');
}
```

## Best Practices

1. **Always use tokens**: Don't hardcode margin, gap, or column values
2. **Span from 2 / -2**: Most content should span `grid-column: 2 / -2` to respect margins
3. **Visualize during development**: Use the grid visualization styles during development
4. **Test all breakpoints**: Ensure your content works across all responsive breakpoints
5. **Document custom spans**: If using custom grid-column values, document why

## Examples

See `/local/main.scss` and `/local/index.html` for a working implementation example.

