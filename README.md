
![Banner](/public/banner1.png)

# MediTrack Pro - Clinical Operations Platform

A complete, production-ready clinical operations and patient monitoring platform built with Next.js, TypeScript, and Appwrite. Designed for healthcare facilities to manage patient records, clinical workflows, diagnostics, prescriptions, and more with security and compliance in mind.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-21.0.0-f02e65?style=flat-square&logo=appwrite)](https://appwrite.io/)
![Status](https://img.shields.io/badge/Status-Phase_1_Active-yellow?style=flat-square)
![Implementation](https://img.shields.io/badge/Implementation-15_Phases-blue?style=flat-square)

## ✨ Medical Features

### 🏥 Core Features (Implemented & Planned)

#### Phase 1: Authentication & Security ✅ IN PROGRESS
- Email/password and OAuth authentication
- Role-based access control (6 roles: Patient, Doctor, Nurse, Lab Tech, Pharmacist, Admin)
- Email verification system
- Password reset functionality
- Session management with auto-refresh
- Complete audit logging

#### Phase 2: Landing & Marketing ⏳ READY
- Medical-focused landing page
- Feature showcase
- Conversion optimization
- SEO optimization

#### Phase 3: Patient Portal 📋
- Patient profile management
- Medical records view
- Appointment tracking
- Lab results access
- Prescription management
- Download medical documents

#### Phase 4: Clinical Dashboard 👨‍⚕️
- Patient caseload management
- Visit recording (SOAP notes)
- Diagnosis entry (ICD-10)
- Treatment planning
- Lab ordering
- Prescription creation

#### Phase 5: Lab Management 🔬
- Test request queue
- Result entry & upload
- Automatic abnormal flagging
- Result verification workflow
- PDF report generation

#### Phase 6: Pharmacy Management 💊
- Prescription fulfillment
- Inventory management
- Refill handling
- Drug interaction checking
- Dispensing tracking

#### Phase 7: Admin Dashboard 👑
- User management
- System analytics
- Audit log viewing
- Role/permission management
- System settings

#### Phase 8-15: Advanced Features
- API documentation
- File management & storage
- Real-time notifications
- Advanced analytics & reporting
- Mobile optimization
- Performance optimization
- Production deployment

## 📚 Documentation

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn/bun
- **Appwrite** instance (cloud or self-hosted)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Alaric-senpai/nextjs-appwrite-starter.git
cd next-appwrite-starter
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key

# Database Configuration
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USERS_TABLE=your_users_collection_id

```

### 4. Set Up Appwrite

1. Create a new project in [Appwrite](https://appwrite.io/)
2. Create a database and collections for users
3. Set up authentication providers (Email/Password, OAuth)
4. Copy your project credentials to \`.env.local\`
5. Configure allowed domains in Appwrite console

### 5. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
├── actions/              # Server actions with next-safe-action
│   ├── safe-action.ts    # Action client configuration
│   └── server-action.ts  # Login/signup server actions
├── app/                  # Next.js App Router
│   ├── auth/            # Authentication pages
│   │   ├── login/       # Login page
│   │   └── signup/      # Signup page
│   ├── terms/           # Terms & conditions
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── forms/          # Form components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── SocialLogin.tsx
│   ├── providers/      # Context providers
│   │   ├── auth-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/             # UI components (shadcn/ui)
├── config/             # Configuration files
│   ├── appwrite.config.ts
│   └── helpers/        # Utility helpers
│       ├── logger.ts
│       ├── retry.helpers.ts
│       └── config.ts
├── hooks/              # Custom React hooks
├── lib/                # Shared utilities
│   ├── form-schema.ts  # Zod validation schemas
│   └── utils.ts        # Utility functions
├── public/             # Static assets
└── server/            # Server-side utilities
    ├── clients/       # Appwrite client setup
    └── cookies.ts     # Session cookie management
```

## 🔧 Configuration

### Appwrite Setup

The template includes pre-configured Appwrite clients:

- **Admin Session** - Full access using API key
- **User Session** - Scoped access with session tokens

See [config/README.md](./config/README.md) for detailed configuration options.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`APPWRITE_ENDPOINT\` | Appwrite API endpoint | ✅ |
| \`APPWRITE_PROJECT_ID\` | Your Appwrite project ID | ✅ |
| \`APPWRITE_API_KEY\` | Appwrite API key (server-side) | ✅ |
| \`APPWRITE_DATABASE_ID\` | Database ID for collections | ✅ |
| \`APPWRITE_USERS_TABLE\` | Users collection ID | ✅ |

## 📚 Documentation

Comprehensive documentation is provided for the complete 15-phase implementation plan:

### Main Documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Overview and quick reference for all 15 phases
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Detailed 15-phase breakdown with objectives, tasks, and deliverables
- **[QUICKSTART_DEVELOPMENT.md](./QUICKSTART_DEVELOPMENT.md)** - Setup guide and development workflow
- **[PHASE_1_CHECKLIST.md](./PHASE_1_CHECKLIST.md)** - Detailed Phase 1 (Auth System) implementation checklist
- **[PHASE_2_CHECKLIST.md](./PHASE_2_CHECKLIST.md)** - Detailed Phase 2 (Landing Page) implementation checklist
- **[AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md)** - Authentication system details
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - System architecture overview

### Quick Start
New to the project? Start here:
1. Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview
2. Follow [QUICKSTART_DEVELOPMENT.md](./QUICKSTART_DEVELOPMENT.md) for setup
3. Check [PHASE_1_CHECKLIST.md](./PHASE_1_CHECKLIST.md) to start coding

## 🎨 Customization

### Styling

The template uses Tailwind CSS v4 with a custom configuration. Modify:

- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration
- Component styles inline with Tailwind classes

### Theme

Colors and theme settings are defined in \`app/globals.css\`:

```css
@theme {
  --color-primary: oklch(0.7 0.2 270);
  --color-secondary: oklch(0.6 0.15 240);
  /* ... more theme variables */
}
```

### Components

All components are built with shadcn/ui. Add new components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

## 🔒 Security Features

- **HTTP-only Cookies** - Session tokens stored securely
- **CSRF Protection** - Built-in CSRF protection
- **Input Validation** - Zod schemas for all inputs
- **XSS Protection** - Sanitized outputs
- **Rate Limiting** - Appwrite built-in rate limiting
- **Retry Logic** - Exponential backoff for network requests

## 🧪 Testing

```bash
# Run linting
pnpm lint

# Type checking
pnpm tsc --noEmit
```

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

This template works with any platform supporting Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Appwrite](https://appwrite.io/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [next-safe-action](https://next-safe-action.dev/) - Type-safe server actions

## 📞 Support

For issues and questions:
- [Open an issue](https://github.com/Alaric-senpai/nextjs-appwrite-starter/issues)
- [Discussions](https://github.com/Alaric-senpai/nextjs-appwrite-starter/discussions)

---

**Built with ❤️ using Next.js and Appwrite by [Alaric senpai](https://devcharles.me)**
