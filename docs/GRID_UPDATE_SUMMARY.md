# Grid System Update Summary

## Changes Made

The grid generation system has been updated to meet the following requirements:

### ✅ 1. Respect minimal margin defined by a token
**Implementation:** Margins are now defined as the first and last columns of the grid, using token-based fixed widths.

**Before:**
```scss
grid-template-columns: repeat(4, 1fr);
margin: 0 2rem; // Applied to container
```

**After:**
```scss
grid-template-columns: 0.5rem 1fr 0.25rem 1fr 0.25rem 1fr 0.25rem 1fr 0.5rem;
//                      ^^^^^^                                           ^^^^^^
//                      margin                                           margin
```

### ✅ 2. Change gaps to columns with set width
**Implementation:** Gaps are now actual grid columns with fixed widths from tokens, instead of using CSS `gap` property.

**Before:**
```scss
grid-template-columns: repeat(4, 1fr);
gap: 0.25rem;
```

**After:**
```scss
grid-template-columns: 0.5rem 1fr 0.25rem 1fr 0.25rem 1fr 0.25rem 1fr 0.5rem;
//                                  ^^^^^       ^^^^^       ^^^^^
//                                  gaps with fixed widths
```

### ✅ 3. Max width should be a container max-width
**Implementation:** Max-width is applied directly to the grid container, constraining the entire grid system. **The max-width includes the margins**, measuring from outer edge to outer edge.

**CSS Output:**
```css
body {
  display: grid;
  margin: 0 auto;
  grid-template-columns: 0.5rem 1fr 0.25rem 1fr 0.25rem 1fr 0.25rem 1fr 0.5rem;
  max-width: 76rem; /* calc(75rem + 0.5rem + 0.5rem) */
}

@media (min-width: 45rem) {
  body {
    max-width: 83rem; /* calc(75rem + 4rem + 4rem) */
  }
}
```

**Formula:** `max-width = token_max_width + left_margin + right_margin`

## Updated Files

### 1. `/src/mono/grid.scss`
- Updated `responsive-grid()` mixin
- Updated `grid()` mixin
- Added comprehensive documentation
- Added visual grid structure diagram

**Key Changes:**
- Build grid template with margin columns at start and end
- Insert gap columns between content columns
- Content columns use flexible `1fr` units
- Fixed quoted `"1fr"` issue by using unquoted `1fr`

### 2. `/local/main.scss`
- Updated grid visualization styles
- Added visual distinction for margin, gap, and content columns
- Added comments explaining grid structure

### 3. `/local/index.html`
- Updated to include correct number of grid items (25 for md breakpoint)
- Added comments explaining grid structure per breakpoint

## Grid Structure

### Formula
For N content columns:
- Total columns = 1 margin + N content + (N-1) gaps + 1 margin
- Total columns = 2 + N + (N-1) = N + N + 1 = 2N + 1

### Examples

#### XX Breakpoint (4 columns)
```
Total: 2(4) + 1 = 9 columns
[0.5rem][1fr][0.25rem][1fr][0.25rem][1fr][0.25rem][1fr][0.5rem]
```

#### SM Breakpoint (6 columns)
```
Total: 2(6) + 1 = 13 columns
[2rem][1fr][1rem][1fr][1rem][1fr][1rem][1fr][1rem][1fr][1rem][1fr][2rem]
```

#### MD Breakpoint (12 columns)
```
Total: 2(12) + 1 = 25 columns
[4rem][1fr][2rem][1fr]...[1fr][2rem][1fr][4rem]
```

## Usage Examples

### Basic Container
```scss
.container {
  @include mono.responsive-grid();
}
```

### Content that respects margins
```scss
.content {
  // Start at column 2 (skip left margin)
  // End at column -2 (skip right margin)
  grid-column: 2 / -2;
}
```

### Full-width content
```scss
.full-width {
  grid-column: 1 / -1; // Include margins
}
```

## Token Requirements

The system expects these tokens:

```scss
'size': (
  'grid': (
    'columns': (@xx, @sm, @md...),    // Number of content columns
    'gap': (@xx, @sm, @md...),        // Width of gap columns
    'margin': (@xx, @sm, @md...),     // Width of margin columns
    'max-width': (@xx, @sm, @md...)   // Container max-width
  )
)
```

## Responsive Behavior

The grid adapts at each breakpoint:

| Breakpoint | Columns | Gap   | Margin | Total Cols | Token Max | Actual Max |
|------------|---------|-------|--------|------------|-----------|------------|
| xx (0px)   | 4       | 0.25rem | 0.5rem  | 9          | 75rem     | 76rem      |
| sm (350px) | 6       | 1rem  | 2rem   | 13         | 75rem     | 79rem      |
| md (720px) | 12      | 2rem  | 4rem   | 25         | 75rem     | 83rem      |

**Note:** Actual max-width includes margins for proper edge-to-edge measurement.

## Benefits

1. **Token-driven**: All spacing comes from design tokens
2. **Precise control**: Fixed-width margins and gaps ensure consistency
3. **Flexible content**: Content columns grow and shrink with available space
4. **Responsive**: Different configurations per breakpoint
5. **Visual debugging**: Easy to visualize with colored columns

## Testing

To test the implementation:

1. Compile SCSS: `npx sass local/main.scss:local/main.css --load-path=src/mono`
2. Open `local/index.html` in a browser
3. Resize browser to see responsive behavior
4. Check that:
   - Margins appear at edges (red in demo)
   - Gaps separate content columns (blue in demo)
   - Content columns are flexible (green in demo)
   - Max-width constrains the container

## Documentation

- **Full guide**: See `GRID_SYSTEM.md`
- **Code documentation**: See comments in `src/mono/grid.scss`
- **Visual example**: See `local/main.scss` and `local/index.html`

## Migration Notes

If you have existing code using the old grid system:

1. **Update grid-column values**: Account for margin columns
   - Old: `grid-column: 1 / -1` (full width)
   - New: `grid-column: 2 / -2` (respect margins) or `1 / -1` (true full width)

2. **Remove gap usage**: Gap is now built into the grid template
   - Remove any `gap: ...` declarations
   - Gaps are automatic based on tokens

3. **Update column spans**: Account for gap columns in spans
   - Old: Spanning 3 columns = `grid-column: span 3`
   - New: Spanning 3 content columns = `grid-column: 2 / 8` (3 content + 2 gaps)

## Backward Compatibility

⚠️ **Breaking Change**: This is a breaking change from the previous grid system.

Projects using the old system will need to:
1. Update their grid-column declarations
2. Recompile their SCSS
3. Test responsive behavior
4. Update any custom grid calculations

## Success Criteria

All requirements have been met:

- ✅ Margins defined as first and last columns with token values
- ✅ Gaps converted to columns with fixed widths from tokens  
- ✅ Max-width applied to container
- ✅ Fully responsive across all breakpoints
- ✅ Works with token system
- ✅ Comprehensive documentation
- ✅ Visual examples provided
- ✅ Code compiles without errors

