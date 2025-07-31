# Product Category Manager

A modern web application for managing products and categories built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products with categories
- **Modern UI**: Clean and responsive interface using shadcn/ui components
- **Form Validation**: Client-side validation using Zod
- **Type Safety**: Full TypeScript support
- **Real-time Updates**: Instant feedback with toast notifications

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── products/
│   │   └── page.tsx        # Products page
│   └── categories/
│       └── page.tsx        # Categories page
├── components/
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── ui/                 # Reusable UI components
│   ├── products/           # Product-specific components
│   └── categories/         # Category-specific components
├── lib/
│   ├── api.ts             # API utilities
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Dashboard
The dashboard provides an overview and quick access to manage products and categories.

### Products
- View all products in a table format
- Add new products with name, description, price, and category
- Edit existing products
- Delete products with confirmation

### Categories
- View all categories in a table format
- Add new categories with name and description
- Edit existing categories
- Delete categories with confirmation

## Development

The application uses mock data storage for demonstration purposes. In a production environment, you would replace the API functions in `src/lib/api.ts` with actual backend calls.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
