# StackOverflowNext 📚

A modern, community-driven platform for asking and answering programming questions. Built with Next.js 13, featuring a robust Q&A system, user authentication, and a beautiful responsive UI.

## 🌟 Features

### Core Functionality

- **Question & Answer System**: Create, edit, and delete questions and answers
- **Advanced Search**: Global search with filters and local search capabilities
- **Voting System**: Upvote/downvote questions and answers
- **Tag Management**: Organize content with custom tags
- **User Profiles**: Comprehensive user profiles with reputation system
- **Collections**: Save and organize favorite questions
- **Community**: Browse and connect with other developers

### User Experience

- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Rich Text Editor**: TinyMCE integration for formatting content
- **Syntax Highlighting**: Prism.js for beautiful code display
- **Pagination**: Efficient content browsing
- **Real-time Updates**: Dynamic content updates

### Technical Features

- **Authentication**: Clerk integration with webhook support
- **Database**: MongoDB with Mongoose ODM
- **Server Actions**: Next.js 13 server actions for data handling
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation
- **SEO Optimized**: Metadata management and semantic HTML

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Rich Text**: TinyMCE
- **Syntax Highlighting**: Prism.js

### Backend

- **Runtime**: Node.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: Clerk
- **Validation**: Zod
- **Webhooks**: Svix

### Developer Experience

- **Linting**: ESLint with Next.js, Standard, and Tailwind configs
- **Formatting**: Prettier
- **Git Hooks**: Husky (if configured)

## 📁 Project Structure

```
├── app/                          # Next.js 13 App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                  # Main application routes
│   │   ├── (home)/             # Home page
│   │   ├── ask-question/       # Question creation
│   │   ├── collection/         # Saved questions
│   │   ├── community/          # User directory
│   │   ├── profile/            # User profiles
│   │   ├── question/           # Question details
│   │   └── tags/               # Tag management
│   ├── api/webhook/            # Clerk webhooks
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable UI components
│   ├── cards/                  # Card components
│   ├── forms/                  # Form components
│   ├── home/                   # Home page components
│   ├── shared/                 # Shared components
│   │   ├── navbar/
│   │   ├── search/
│   │   └── sidebar/
│   └── ui/                     # Base UI components
├── constants/                  # Application constants
├── context/                    # React context providers
├── database/                   # Database models
│   └── models/
├── lib/                        # Utility functions
│   └── actions/               # Server actions
├── public/                     # Static assets
│   └── assets/
├── styles/                     # Additional stylesheets
└── types/                      # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/LomachenkoDev/StackOverflowNext.git
   cd StackOverflowNext
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URL=your_mongodb_connection_string

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_CLERK_WEBHOOK_SECRET=your_webhook_secret

   # TinyMCE (Optional)
   NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key

   # OpenAI (Optional)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Users

1. **Sign Up/Login**: Create an account using Clerk authentication
2. **Ask Questions**: Navigate to "Ask a Question" to post your queries
3. **Answer Questions**: Browse questions and provide helpful answers
4. **Vote**: Use the voting system to rate content quality
5. **Save Content**: Add questions to your collection for later reference
6. **Customize**: Toggle between light and dark themes

### For Developers

1. **Extend Models**: Add new fields to database models in `database/models/`
2. **Create Actions**: Implement server actions in `lib/actions/`
3. **Add Components**: Build reusable components in `components/`
4. **Configure Routes**: Add new pages in the `app/` directory

## 🔧 Configuration

### Database Models

- **User**: Profile information and authentication data
- **Question**: Question content, metadata, and relationships
- **Answer**: Answer content and associations
- **Tag**: Category and organization system
- **Interaction**: User activity tracking

### Key Features Configuration

- **Theme Management**: Configured in `context/ThemeProvider.tsx`
- **Authentication**: Managed by Clerk with custom webhooks
- **Validation**: Schema validation using Zod in `lib/validation.ts`
- **Styling**: Customizable theme in `tailwind.config.ts`

## 📚 API Routes

### Webhooks

- `POST /api/webhook` - Clerk user management webhooks

### Server Actions

- Question management (CRUD operations)
- Answer management
- User operations
- Tag operations
- Voting system
- Search functionality

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication services
- Tailwind CSS for styling utilities
- MongoDB for database services
- Vercel for hosting platform

## 📞 Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

---

**Made with ❤️ by [LomachenkoDev](https://github.com/LomachenkoDev)**
