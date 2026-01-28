# GitHub Profile Analytics Dashboard

A production-ready, enterprise-grade GitHub profile analytics dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This application transforms raw GitHub API data into meaningful insights for recruiters and developers.

![GitHub Analytics Dashboard](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Core Analytics
- **Profile Overview**: Display user avatar, bio, followers, following, and account age
- **Contribution Heatmap**: 12-month contribution activity visualization with interactive tooltips
- **Language Distribution**: Donut chart showing programming language usage across repositories
- **Repository Insights**: Sortable, searchable table with star/fork counts and activity status
- **Activity Score**: Composite metric based on contributions, stars, and recent activity

### User Experience
- **Server-Side Rendering**: Fast initial page loads with Next.js App Router
- **Skeleton Loaders**: Professional loading states (no spinners)
- **Error Handling**: Graceful error messages with retry functionality
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Accessibility**: Keyboard navigation and ARIA labels throughout
- **Empty States**: Meaningful placeholders for new/inactive profiles

### Technical Excellence
- **Type Safety**: Full TypeScript coverage with strict mode
- **Clean Architecture**: Separation of concerns (API → Transformers → Components)
- **Performance**: Server Components for data fetching, Client Components only where needed
- **Caching**: 1-hour revalidation with Next.js cache
- **Error Boundaries**: Production-grade error handling
- **SEO Optimized**: Semantic HTML and meta tags

## 🏗️ Architecture

```
app/
├── actions/
│   └── github.ts          # Server Actions for data fetching
├── components/
│   ├── ProfileCard.tsx     # User profile display
│   ├── ContributionChart.tsx  # Heatmap visualization
│   ├── LanguageChart.tsx   # Donut chart with legend
│   ├── RepoTable.tsx       # Filterable repository table
│   ├── ActivityScore.tsx   # Activity metrics
│   ├── ErrorDisplay.tsx    # Error states
│   └── Skeletons.tsx       # Loading skeletons
├── lib/
│   ├── github-api.ts       # GitHub API client with error handling
│   └── transformers.ts     # Data transformation logic
├── types/
│   └── github.ts           # TypeScript type definitions
├── globals.css             # Global styles and design tokens
├── layout.tsx              # Root layout with fonts
└── page.tsx                # Main dashboard page
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- GitHub account (for API testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd github-analytics
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. (Optional) Add GitHub Personal Access Token for higher rate limits:
```bash
# Create .env.local file
echo "GITHUB_TOKEN=your_github_token_here" > .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## 🎨 Design Philosophy

This dashboard follows a **refined data-visualization aesthetic** inspired by professional financial terminals:

- **Typography**: Custom font stack (Syne for display, IBM Plex Mono for data)
- **Color Palette**: Dark-first theme with neon accent (#00ff88) for emphasis
- **Layout**: Generous spacing, clear hierarchy, asymmetric grids
- **Animations**: Subtle fade-ins and slide-ups for progressive disclosure
- **Data Density**: High information density without clutter

## 🔧 Key Technical Decisions

### 1. Server Components First
All data fetching happens server-side for better performance and SEO. Client components are only used for interactivity (charts, filters).

### 2. Progressive Enhancement
The app works without JavaScript for initial load, with enhanced functionality when JS is available.

### 3. Data Transformation Layer
Raw GitHub API responses are transformed server-side into UI-ready data structures, minimizing client payload.

### 4. Synthetic Contribution Data
GitHub's contribution graph requires GraphQL API or web scraping. We generate synthetic data based on repository push activity for demonstration purposes.

### 5. Rate Limiting Strategy
- Cache API responses for 1 hour
- Display friendly error messages when rate limited
- Option to add GitHub token for 5000 req/hour (vs 60 unauthenticated)

## 🧪 Testing Example Usernames

Try these GitHub profiles to see the dashboard in action:

- `torvalds` - High activity, multiple languages
- `gaearon` - React ecosystem
- `tj` - Prolific Node.js contributor
- `sindresorhus` - Massive repository count
- `your-username` - Your own profile!

## 📊 Activity Score Calculation

The activity score (0-100) is a composite metric:

- **40 points**: Contribution frequency (total contributions / 500 * 40)
- **30 points**: Community impact (total stars / 100 * 30)
- **30 points**: Recent activity (active repos / 10 * 30)

**Note**: This is an engagement metric, not a talent rating.

## 🎯 Performance Optimizations

- Image optimization with Next.js `<Image>` component
- Code splitting via dynamic imports
- Memoization in expensive calculations
- Debounced search input
- Virtualized lists for large datasets (repository table)
- CSS containment for animation performance

## 🔐 Security Considerations

- Input sanitization for username queries
- HTTPS-only external requests
- No sensitive data stored client-side
- Rate limit protection
- XSS prevention via React's automatic escaping

## 🚧 Potential Enhancements

- [ ] Real contribution graph via GitHub GraphQL API
- [ ] Profile comparison mode (side-by-side)
- [ ] Recent search history (localStorage)
- [ ] Export to PDF functionality
- [ ] Dark/Light theme toggle
- [ ] OAuth login for personalized dashboard
- [ ] Follow/Watch tracking
- [ ] Advanced filtering (by year, language, org)

## 📝 Environment Variables

```bash
# Optional: Increases rate limit from 60 to 5000 requests/hour
GITHUB_TOKEN=your_personal_access_token

# Optional: Custom API base URL
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com
```

## 🤝 Contributing

This is a portfolio project demonstrating production-ready code practices. Feel free to fork and adapt for your own use cases.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- GitHub REST API for data access
- Next.js team for the excellent App Router
- Tailwind CSS for rapid styling
- Vercel for deployment platform

---

**Built with ❤️ for recruiters and developers who value clean code and thoughtful UX.**
