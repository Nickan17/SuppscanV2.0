# Supplement Scanner

A mobile app for scanning and evaluating nutritional supplements using AI.

## Features

- 📱 Barcode scanning for quick product lookup
- 🔍 Search for supplements by name or brand
- 🤖 AI-powered evaluation of supplement quality
- 📊 Detailed breakdown of ingredients and their benefits
- 💾 Save and view your scan history

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/supplement-scanner.git
   cd supplement-scanner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Update the values with your API keys

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter
EXPO_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
```

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: React Context API
- **Database**: Supabase
- **AI**: OpenRouter (with Llama 3)
- **Barcode Scanning**: Expo Barcode Scanner
- **UI**: React Native Paper

## Folder Structure

```
/
├── app/                  # App screens and navigation
├── components/           # Reusable UI components
├── lib/                  # Core libraries and configurations
├── services/             # API and service integrations
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
