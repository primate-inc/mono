# Token Special Character Handling

## Overview

The MONO design system now supports flexible token key matching, allowing you to call tokens both **with** and **without** special characters. This makes the API more user-friendly and forgiving.

## Special Characters

The following special characters are used in the token system for specific purposes:

- `*` - Marks a variant as the default (e.g., `-default*`, `-none*`)
- `@` - Prefix for responsive/breakpoint keys (e.g., `@xx`, `@sm`, `@md`)
- `#` - Prefix for theme keys (e.g., `#blue`, `#green`, `#dark`)
- `:` - Prefix for state keys (e.g., `:initial`, `:hover`, `:focus`)
- `%` - Prefix for component/variant collections (e.g., `%button`)
- `-` - Prefix for variants (e.g., `-primary`, `-secondary`)
- `--` - Prefix for variant groups (e.g., `--color`, `--size`)

## Key Features

### 1. Asterisk (*) Removal in CSS Variables

When generating CSS custom properties, the `*` (default marker) is automatically removed:

**Token Definition:**
```scss
'--size': (
  '-default*': (  // ← Note the asterisk
    'padding-x': (...),
    'padding-y': (...)
  )
)
```

**Generated CSS:**
```css
--size-button---size--default-padding-x: 1.5rem;  /* ← No asterisk */
--size-button---size--default-padding-y: 0.75rem;
```

### 2. Flexible Token Lookup

You can call tokens **with or without** the special characters, and the system will find the correct token:

**Both of these work:**

```scss
// With asterisk (as defined in token map)
@include responsive-token(
  'padding', 
  ('size', '%button', '--size', '-default*', 'padding-x')
);

// Without asterisk (flexible matching)
@include responsive-token(
  'padding', 
  ('size', '%button', '--size', '-default', 'padding-x')
);
```

Both calls will return the same result: `("@xx": 1.5rem, "@sm": 1.5rem, "@md": 1.5rem)`

## Implementation Details

### sanitize-special-key() Function

Located in `/src/mono/utils/global.scss`, this function removes special characters when generating CSS variable names:

```scss
@function sanitize-special-key($key) {
  // ... removes #, @, :, %, and * characters
  // Ensures clean CSS variable names
}
```

### find_token_key() Function

Located in `/src/mono/api/tokens.scss`, this helper function enables flexible key matching:

```scss
@function find_token_key($map, $key) {
  // 1. Try exact key match first
  // 2. Try with special character suffixes
  // 3. Try without special character suffixes
  // Returns the actual key found in the map, or null
}
```

### get_token_value() Function

Updated to use `find_token_key()` for flexible matching:

```scss
@function get_token_value($keys...) {
  // Uses find_token_key() to match keys flexibly
  // Supports both with and without special characters
}
```

## Use Cases

### Calling Variants

```scss
// These are equivalent:
mono.get_token_value('size', '%button', '--size', '-default*', 'padding-x');
mono.get_token_value('size', '%button', '--size', '-default', 'padding-x');
```

### Using Responsive Mixins

```scss
// These produce the same result:
@include mono.responsive-token('border-radius', 
  ('size', '%button', '--radius', '-none*', 'radius'));

@include mono.responsive-token('border-radius', 
  ('size', '%button', '--radius', '-none', 'radius'));
```

### Direct Token Access

```scss
// With special chars (as defined):
$value: mono.token('size', '%button', '--size', '-default*', 'padding-x', '@xx');

// Without special chars (flexible):
$value: mono.token('size', '%button', '--size', '-default', 'padding-x', '@xx');
```

## Benefits

1. **User-Friendly API**: Don't need to remember whether a variant has an asterisk
2. **Cleaner CSS Output**: No special characters in CSS variable names
3. **Backwards Compatible**: Existing code with special characters continues to work
4. **Better DX**: Easier to write and read token paths

## Testing

A test file demonstrates the flexible matching:

```bash
cd /Users/raf/Work/mono
npx sass local/test-special-chars.scss:local/test-special-chars.css --load-path=src/mono
```

The debug output shows both syntaxes return identical values.

## Migration Notes

- **No Breaking Changes**: Existing code continues to work
- **Recommendation**: You can start omitting special characters in your code for cleaner syntax
- **CSS Variables**: Already clean (asterisks automatically removed)

## Example

**Before (still works):**
```scss
.button {
  @include mono.variants('button', 'size', 'button');
  // Internally uses: size/%button/--size/-default*/padding-x
}
```

**After (also works):**
```scss
.my-component {
  // Can now omit asterisk when manually calling tokens:
  @include mono.responsive-token('padding-inline', 
    ('size', '%button', '--size', '-default', 'padding-x')  // ← No asterisk
  );
}
```

Both approaches work seamlessly!

