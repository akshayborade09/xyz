# Development Guidelines

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run validation checks
npm run validate
```

## 🔧 Code Quality Tools

### Pre-commit Hooks
- **ESLint**: Catches syntax errors and enforces code style
- **Prettier**: Formats code consistently
- **TypeScript**: Type checking
- **Lint-staged**: Runs checks only on staged files

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run validate` - Run all validation checks

## 📝 Coding Standards

### TypeScript/React
- Use TypeScript for all new files
- Prefer functional components with hooks
- Use proper TypeScript interfaces
- Avoid `any` type - use proper typing

### Code Style
- Use single quotes for strings
- Always use semicolons
- Use 2 spaces for indentation
- Maximum line length: 80 characters
- Use trailing commas in objects/arrays

### File Organization
- Use PascalCase for component files
- Use camelCase for utility files
- Group related files in folders
- Use index.ts files for clean exports

## 🚨 Common Issues to Avoid

### Syntax Errors
- **Extra closing braces**: Always match opening/closing braces
- **Missing semicolons**: Always end statements with semicolons
- **Unclosed JSX tags**: Ensure all JSX tags are properly closed
- **Missing imports**: Always import required dependencies

### Build Issues
- **Dynamic imports**: Use `next/dynamic` for large client components
- **SSR conflicts**: Use `ssr: false` for client-only components
- **Missing dependencies**: Always install required packages

## 🔍 Debugging

### Common Commands
```bash
# Clear Next.js cache
rm -rf .next && npm run dev

# Check for syntax errors
npm run type-check

# Fix formatting issues
npm run format

# Fix linting issues
npm run lint:fix
```

### VS Code Setup
- Install recommended extensions
- Enable format on save
- Enable auto-imports
- Use bracket pair colorization

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] All tests pass (`npm run validate`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code is properly formatted
- [ ] Build completes successfully

### Vercel Deployment
- Automatic deployment on push to main branch
- Build validation runs before deployment
- Type checking and linting enforced

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
