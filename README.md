# CryptoWeather Nexus

A modern, multi-page dashboard combining real-time weather data, cryptocurrency information, and news updates. Built with Next.js 13+, React, Zustand, and Tailwind CSS.

## 🌟 Live Demo

Visit the live application: [https://nextjs-assignmnet-mu.vercel.app/](https://nextjs-assignmnet-mu.vercel.app/)

## 🚀 Features

### Dashboard Components
- **Weather Section**
  - Real-time weather data for New York, London, and Tokyo
  - Temperature, humidity, wind conditions, and air quality metrics
  - Interactive weather cards with hover animations
  
- **Cryptocurrency Section**
  - Live price updates via WebSocket for Bitcoin, Ethereum, and other major cryptocurrencies
  - 24-hour price changes and market statistics
  - Favorites system with persistent storage
  
- **News Section**
  - Top 5 cryptocurrency-related headlines
  - Auto-refreshing content
  - Link to full articles

### Real-Time Features
- WebSocket integration for live cryptocurrency price updates
- Price change notifications with visual indicators
- Simulated weather alerts based on conditions
- Toast notifications for significant events

### Detail Pages
- **Weather Details**
  - 7-day weather forecast
  - Historical weather data visualization
  - Detailed meteorological metrics
  
- **Cryptocurrency Details**
  - Comprehensive market statistics
  - Price history and trends
  - Supply information and market rankings

## 🛠 Technical Implementation

### Core Technologies
- **Frontend Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Real-time Data**: WebSocket (CoinCap API)
- **Notifications**: Sonner Toast (Shadcn UI)

### API Integrations
- **Weather**: WeatherAPI.com
- **Cryptocurrency**: CoinGecko API, CoinCap WebSocket
- **News**: NewsData.io

## 🔧 Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/dikjain/crypto-weather-nexus.git
cd crypto-weather-nexus
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📐 Architecture Decisions

### State Management
- Chose Zustand over Redux for its simplicity and built-in async support
- Implemented a centralized store with separate concerns for weather, crypto, and news data
- Used localStorage for persisting user preferences

### Real-Time Updates
- WebSocket connection for live cryptocurrency prices
- Periodic API polling (60s intervals) for weather and news updates
- Optimistic UI updates with error handling

### Performance Optimizations
- Image optimization with Next.js Image component
- Lazy loading for off-screen content
- Debounced API calls and WebSocket reconnection logic

### UI/UX Considerations
- Responsive design with mobile-first approach
- Consistent animation patterns using Framer Motion
- Error boundaries and fallback UI components
- Toast notifications for important updates

## 🎯 Challenges and Solutions

### Challenge 1: API Rate Limits
- Implemented caching layer for API responses
- Added retry logic with exponential backoff
- Used stale-while-revalidate pattern for data freshness

### Challenge 2: Real-Time Data Management
- Created WebSocket connection manager with automatic reconnection
- Implemented data normalization for consistent state updates
- Added error handling for connection failures

### Challenge 3: Performance Optimization
- Implemented component code-splitting
- Optimized re-renders using React.memo and useMemo
- Added loading states and skeleton screens

## 📱 Responsive Design

The application is fully responsive across all device sizes:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security Considerations

- API keys stored in environment variables
- Input sanitization for user-provided data
- Security headers configured in Next.js

## 🧪 Testing

To run tests:
```bash
npm run test
```

## 📦 Deployment

The application is deployed on Vercel with the following configuration:
- Automatic deployments on main branch updates
- Environment variables configured in Vercel dashboard
- Edge caching enabled for static assets

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

Dikshit Mahanot
- Portfolio: [https://portfolio-web-seven-beta.vercel.app/](https://portfolio-web-seven-beta.vercel.app/)
