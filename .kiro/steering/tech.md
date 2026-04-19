# Technology Stack

## Framework & Core Libraries

- **Angular**: v21.2.9 (latest stable)
- **TypeScript**: v5.9.3
- **RxJS**: v7.8.0 for reactive programming
- **Zone.js**: v0.15.1 for change detection

## Build System & Tooling

- **Nx**: v22.6.5 (monorepo build system)
- **Angular CLI**: v21.2.7
- **Vite**: Used for development server and builds
- **ESLint**: Code linting with Angular-specific rules
- **Prettier**: Code formatting

## UI Libraries

- **FontAwesome**: v7.2.0 with Angular integration
- **Numeral.js**: v2.0.6 for number formatting

## Testing

- **Vitest**: v4.1.4 for unit testing
- **JSDOM**: v29.0.2 for DOM testing

## Common Commands

### Development

```bash
npm start              # Start dev server (uses nx serve)
nx serve              # Alternative dev server command
```

### Building

```bash
npm run build         # Production build
nx build              # Alternative build command
npm run watch         # Build with watch mode
```

### Code Quality

```bash
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes
nx lint               # Run ESLint
```

### Testing

```bash
npm test              # Run unit tests
nx test               # Alternative test command
```

## TypeScript Configuration

- **Target**: ES2022
- **Module**: ES2022 with bundler resolution
- **Strict mode**: Partially enabled (strict: false, but with specific strict checks)
- **Decorators**: Experimental decorators enabled for Angular
- **Source maps**: Enabled for debugging
