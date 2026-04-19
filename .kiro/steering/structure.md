# Project Structure

## Directory Organization

```
src/
├── app/
│   ├── scenario-slider/          # Feature component (scenario slider demo)
│   ├── shared/                    # Shared/reusable components and services
│   │   ├── directives/           # Custom directives
│   │   ├── range-input/          # Core range input component
│   │   └── service/              # Shared services (converters, utilities)
│   ├── app.component.*           # Root application component
│   ├── app.module.ts             # Root module
│   └── app-routing.module.ts     # Application routing
├── assets/                        # Static assets
└── styles.scss                    # Global styles
```

## Architecture Patterns

### Module Structure

- **AppModule**: Root module that imports SharedModule and feature components
- **SharedModule**: Exports reusable components and directives for use across the app
- Components use `standalone: false` (traditional module-based approach)

### Component Organization

Each component follows a consistent file structure:

- `component-name.ts` - Component logic
- `component-name.html` - Template
- `component-name.scss` - Styles
- `component-name-*.ts` - Related services/converters (if needed)

### Base Classes & Abstractions

The project uses inheritance for form control functionality:

1. **ValueAccessor<TViewValue, TModelValue>**: Abstract base class implementing `ControlValueAccessor`
   - Handles bidirectional data binding between view and model
   - Provides hooks for value transformation (before/after conversion)
   - Generic types allow type-safe view/model value conversion

2. **InputControl<TViewValue, TModelValue>**: Extends ValueAccessor
   - Adds Angular forms integration via `NgControl`
   - Provides validation handling
   - Exposes `invalid` and `failures` properties for error display

3. **ValueConverter<TViewValue, TModelValue>**: Abstract service for value transformation
   - `toView()`: Converts model value to display format
   - `fromView()`: Parses display value back to model format
   - Used for number formatting, currency, percentages, etc.

### Dependency Injection Patterns

Components provide their own dependencies at the component level:

```typescript
providers: [
  { provide: InputControl, useExisting: ComponentClass },
  { provide: ValueConverter, useExisting: ConverterClass },
];
```

### Naming Conventions

- **Component prefix**: `mg-` (e.g., `mg-range-input`, `mg-scenario-slider`)
- **Directive prefix**: `mg` in camelCase (e.g., `mgBoundedFormat`)
- **File naming**: kebab-case for files, PascalCase for classes
- **Component IDs**: Generated with pattern `{component-name}-${index++}`

## Code Style Rules

### ESLint Configuration

- Component selectors must use `mg` prefix with kebab-case
- Directive selectors must use `mg` prefix with camelCase
- Import ordering: alphabetical, no newlines between groups
- Sort imports within declarations
- Standalone components preference disabled (using modules)

### Prettier Configuration

- Single quotes
- Semicolons required
- 2-space indentation
- 120 character line width
- Trailing commas everywhere
- LF line endings
- Angular parser for HTML templates

## Key Architectural Decisions

1. **Generic Type System**: Components use generics to maintain type safety between view (string) and model (number) values
2. **RxJS Observables**: Heavy use of reactive patterns for debouncing, event handling, and value changes
3. **Renderer2**: Direct DOM manipulation uses Angular's Renderer2 for platform independence
4. **Provider Hierarchy**: Components override base class providers to inject custom converters
5. **Lifecycle Hooks**: Proper cleanup with `takeUntil` pattern and Subject-based destruction
