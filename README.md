# Enchanted Hub - Life & Aim Tracker

A comprehensive personal productivity hub built with Next.js, Supabase, and modern web technologies. Track your goals, manage tasks, monitor gaming progress, maintain a daily journal, and discover productivity blueprints.

## 🌟 Features

### 📊 Dashboard
- **Personal Overview**: XP system, streak tracking, and activity summary
- **Quick Actions**: Fast access to create aims, games, tasks, and journal entries
- **Statistics Cards**: Real-time progress tracking across all modules

### 🎯 Aims Management
- Create and track personal goals with progress indicators
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Active, Completed, Paused, Archived)
- Color-coded organization

### 🎮 Gaming Progress
- Track gaming library with status management
- Hours played and rating system
- Platform tracking (PC, PS5, etc.)
- Game-specific task management

### ✅ Task Management
- Comprehensive task system with categories
- Link tasks to aims or games
- Priority and due date management
- Status tracking with progress indicators

### 📝 Daily Journal
- Calendar-based journal entries
- Mood tracking with visual indicators
- Link entries to specific aims or games
- Rich text content support

### 📚 Media Hub
- YouTube video and article management
- Watch progress tracking
- Resource categorization
- Notes and bookmarking system

### 👥 Social Features
- Friend system with requests and messaging
- Real-time chat functionality
- User discovery and profiles
- Social activity tracking

### 🗺️ Blueprints System
- **Create & Share**: Design reusable productivity routines
- **Discover**: Browse community-created blueprints
- **Clone**: Instantly add blueprint tasks to your list
- **Edit & Manage**: Full CRUD operations for your blueprints
- **Public/Private**: Control blueprint visibility
- **Like System**: Engage with community content

### 🏆 Gamification
- **XP System**: Earn experience points for completing activities
- **Level Progression**: Advance through levels with visual feedback
- **Streak Tracking**: Maintain daily activity streaks
- **Achievements**: Unlock badges for various milestones
- **Progress Visualization**: Animated progress bars and indicators

### 🌐 Internationalization
- **Multi-language Support**: English and Turkish
- **Real-time Language Switching**: Change language without page reload
- **Comprehensive Translation**: 200+ translated strings
- **User Preference Storage**: Language choice saved to user profile

### ⚙️ Settings & Customization
- **Profile Management**: Avatar, display name, bio, and handle
- **Notification Settings**: Granular control over alerts
- **Privacy Controls**: Public/private profile options
- **Language Preferences**: Multi-language interface
- **Account Statistics**: Detailed activity summaries

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation

### Backend & Database
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Relational database
- **Row Level Security**: Data protection
- **Real-time Subscriptions**: Live updates
- **Authentication**: Secure user management

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NathanIs60/Enchanted-hub-aim.git
cd Enchanted-hub-aim
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
Run the SQL scripts in the `scripts/` directory in order:
```bash
# Execute in Supabase SQL Editor
scripts/001_create_profiles.sql
scripts/002_profile_trigger.sql
# ... continue with all numbered scripts
```

5. **Start Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── aims/             # Aims-related components
│   ├── games/            # Gaming components
│   ├── tasks/            # Task management
│   ├── journal/          # Journal components
│   ├── media/            # Media hub components
│   ├── social/           # Social features
│   ├── blueprints/       # Blueprint system
│   ├── gamification/     # XP, levels, achievements
│   ├── settings/         # Settings components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility libraries
│   ├── contexts/         # React contexts
│   ├── supabase/         # Database client
│   ├── types/            # TypeScript definitions
│   ├── validations/      # Zod schemas
│   ├── gamification/     # XP and achievement logic
│   └── utils/            # Helper functions
├── scripts/              # Database migration scripts
└── public/               # Static assets
```

## 🎨 Key Features Deep Dive

### Blueprints System
The blueprint system allows users to create, share, and discover productivity routines:

- **Creation**: Design step-by-step task templates
- **Sharing**: Make blueprints public for community discovery
- **Cloning**: Instantly add blueprint tasks to personal task list
- **Management**: Full edit, delete, and privacy controls
- **Discovery**: Browse and like community blueprints

### Gamification Engine
Comprehensive gamification system to encourage engagement:

- **XP Calculation**: Points awarded for various activities
- **Level System**: Progressive advancement with visual feedback
- **Streak Tracking**: Daily activity monitoring
- **Achievement System**: Badge unlocking for milestones
- **Progress Visualization**: Animated bars and indicators

### Multi-language Support
Complete internationalization system:

- **Dynamic Translation**: Real-time language switching
- **User Preferences**: Language choice persisted to database
- **Comprehensive Coverage**: 200+ translated strings
- **Interpolation Support**: Dynamic variable insertion in translations

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Database Schema
The application uses a comprehensive PostgreSQL schema with:
- User profiles and authentication
- Aims, games, tasks, and journal entries
- Social features (friends, messages)
- Blueprints and likes system
- Gamification (XP, achievements, stats)
- Notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **Vercel** for seamless deployment
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

## 📞 Support

For support, email taha62batu@gmail.com or create an issue in this repository.

---

**Built with ❤️ by NathanIs**