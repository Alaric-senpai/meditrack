# MediTrack Pro - Quick Start Guide

## 🚀 Project Overview

MediTrack Pro is a clinical operations and patient monitoring platform built with Next.js, TypeScript, and Appwrite. This guide will help you get started with development and understand the current state of the project.

## 📊 Current Status

- ✅ **Phase 0**: Foundation & Setup (Complete)
  - Next.js 16 App Router with TypeScript
  - Appwrite BaaS integration
  - Authentication system (email/password + OAuth)
  - RBAC with admin/client roles
  - UI component library (shadcn/ui + Tailwind CSS v4)

- 🟡 **Phase 1**: Auth System (In Progress)
  - Role-based signup flows
  - Email verification
  - Password reset
  - Enhanced RBAC enforcement

- ⏳ **Phase 2**: Landing Page (Pending)
  - Hero section redesign
  - Medical features showcase
  - Call-to-action optimization

## 🛠️ Tech Stack

```
Frontend:    Next.js 16 + TypeScript + Tailwind CSS v4
Backend:     Appwrite (Auth, Database, Storage)
Forms:       React Hook Form + Zod
Components:  shadcn/ui + Radix UI
Icons:       Lucide React, Tabler Icons
```

## 📋 Prerequisites

- Node.js 18+ (npm, pnpm, or yarn)
- Appwrite account (Cloud or Self-hosted)
- Git

## ⚙️ Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Alaric-senpai/meditrack.git
cd meditrack
pnpm install  # or npm install
```

### 2. Environment Variables

Create `.env.local` in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID=your_users_table_id

# Medical Collections (Phase 3+)
NEXT_PUBLIC_APPWRITE_PATIENTS_TABLE_ID=patients
NEXT_PUBLIC_APPWRITE_VISITS_TABLE_ID=visits
NEXT_PUBLIC_APPWRITE_DIAGNOSES_TABLE_ID=diagnoses
NEXT_PUBLIC_APPWRITE_TREATMENTS_TABLE_ID=treatments
NEXT_PUBLIC_APPWRITE_VITALS_TABLE_ID=vitals
NEXT_PUBLIC_APPWRITE_LAB_REQUESTS_TABLE_ID=lab_requests
NEXT_PUBLIC_APPWRITE_LAB_RESULTS_TABLE_ID=lab_results
NEXT_PUBLIC_APPWRITE_PRESCRIPTIONS_TABLE_ID=prescriptions
NEXT_PUBLIC_APPWRITE_AUDIT_LOGS_TABLE_ID=audit_logs

# Storage Buckets (Phase 9)
NEXT_PUBLIC_APPWRITE_MEDICAL_FILES_BUCKET_ID=medical_files
NEXT_PUBLIC_APPWRITE_LAB_REPORTS_BUCKET_ID=lab_reports
NEXT_PUBLIC_APPWRITE_PATIENT_DOCUMENTS_BUCKET_ID=patient_documents

# App Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Appwrite Setup

#### Option A: Appwrite Cloud (Recommended for Development)

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project
3. Create a database
4. Create the required collections (or they'll be auto-created)
5. Copy credentials to `.env.local`

#### Option B: Self-Hosted Appwrite

```bash
docker run -d \
  -h localhost \
  -p 80:80 \
  -p 443:443 \
  --name=appwrite \
  appwrite/appwrite:latest
```

Then access at `http://localhost`

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
meditrack/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (route group)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify/page.tsx
│   │   ├── fail/page.tsx
│   │   ├── success/page.tsx
│   │   └── oauth/route.ts
│   ├── (client)/             # Client dashboard routes
│   │   └── dashboard/
│   ├── (admin)/              # Admin dashboard routes
│   │   └── admin/
│   ├── api/                  # API routes
│   │   └── medical/          # Medical API endpoints
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── actions/                  # Server actions (next-safe-action)
│   ├── auth.actions.ts       # Authentication actions
│   ├── medical.actions.ts    # Medical domain actions
│   └── safe-action.ts        # Action client setup
│
├── components/               # React components
│   ├── forms/                # Form components
│   ├── layout/               # Layout components
│   ├── providers/            # Context providers
│   └── ui/                   # UI components (shadcn/ui)
│
├── config/                   # Configuration files
│   ├── appwrite.config.ts    # Appwrite IDs & endpoints
│   ├── app.config.ts         # App configuration
│   └── helpers/              # Config helpers
│
├── lib/                      # Utility functions
│   ├── medical-schema.ts     # Medical data models
│   ├── medical-validation.ts # Zod validation schemas
│   ├── audit-logger.ts       # Audit logging system
│   ├── rbac.ts               # Role-based access control
│   └── utils.ts              # General utilities
│
├── server/                   # Server-only code
│   ├── clients/index.ts      # Appwrite client setup
│   └── cookies.ts            # Session cookie management
│
├── public/                   # Static assets
├── docs/                     # Documentation
└── IMPLEMENTATION_PLAN.md    # 15-phase implementation plan
```

## 🔐 Authentication System

### Current Features
- Email/password login & signup
- OAuth integration (Google, GitHub, Microsoft, Apple, Facebook)
- Session management with auto-refresh
- Role-based dashboards (admin/client)
- Account linking
- Session revocation

### Default Roles

```typescript
enum MedicalRoles {
  PATIENT = "patient",
  DOCTOR = "doctor",
  NURSE = "nurse",
  LAB_TECHNICIAN = "lab_technician",
  PHARMACIST = "pharmacist",
  ADMIN = "admin"
}
```

### Auth Flow

```
User → Login → Validate Credentials → Create Session
       → Store in HttpOnly Cookie → Redirect to Dashboard
```

## 🏥 Medical Features Status

| Feature | Phase | Status |
|---------|-------|--------|
| Patient Management | 3 | ⏳ Pending |
| Clinical Visits | 4 | ⏳ Pending |
| Diagnosis Tracking | 4 | ⏳ Pending |
| Vital Signs Recording | 4 | ⏳ Pending |
| Lab Ordering & Results | 5 | ⏳ Pending |
| Prescriptions | 4/6 | ⏳ Pending |
| Pharmacy Management | 6 | ⏳ Pending |
| Audit Logging | All | ✅ Foundation Ready |
| Admin Dashboard | 7 | 🟡 Partial |
| API Documentation | 8 | ⏳ Pending |

## 🚀 Development Workflow

### Creating a Feature (Example: Phase 3 - Patient Profile)

#### 1. Create API Actions (`actions/patient-profile.actions.ts`)
```typescript
export const createPatientAction = actionClient
  .schema(patientProfileSchema)
  .action(async ({ parsedInput }) => {
    // Implementation
  });
```

#### 2. Create Database Types (`lib/patient-schema.ts`)
```typescript
export interface PatientProfile {
  firstName: string;
  lastName: string;
  // ... other fields
}
```

#### 3. Create Validation Schema (`lib/patient-validation.ts`)
```typescript
export const patientProfileSchema = z.object({
  firstName: z.string().min(2),
  // ... other fields
});
```

#### 4. Create Components (`components/forms/PatientProfileForm.tsx`)
```typescript
export function PatientProfileForm() {
  // Component implementation
}
```

#### 5. Create Pages (`app/(patient)/profile/page.tsx`)
```typescript
export default function PatientProfilePage() {
  // Page implementation
}
```

#### 6. Add Audit Logging
```typescript
await logAuditEvent({
  userId: user.$id,
  userRole: MedicalRoles.DOCTOR,
  action: AuditAction.PATIENT_CREATED,
  resourceType: "patient",
  resourceId: patientId,
  patientId,
  severity: "info",
  status: "success",
});
```

### Git Workflow

```bash
# Start a phase
git checkout -b phase/1-auth

# Make changes, commit frequently
git add .
git commit -m "feat: implement email verification"

# Push to GitHub
git push origin phase/1-auth

# Create PR for review
# Once approved, merge to main
git checkout main
git merge phase/1-auth
git push origin main
```

## 🧪 Testing

### Run Type Check
```bash
pnpm tsc --noEmit
```

### Run Linter
```bash
pnpm lint
```

### Manual Testing Checklist

**Auth Testing**
- [ ] Register new account
- [ ] Login with email/password
- [ ] OAuth login (Google/GitHub)
- [ ] Session expires after timeout
- [ ] Logout clears session

**RBAC Testing**
- [ ] Register as different roles
- [ ] Verify role-based routing
- [ ] Test permission restrictions
- [ ] Admin can access admin routes
- [ ] Patient cannot access admin routes

## 📖 Key Files to Understand

### Core Auth Files
- `actions/auth.actions.ts` - All authentication logic
- `components/providers/auth-provider.tsx` - Auth context
- `components/forms/LoginForm.tsx` - Login UI
- `middleware.ts` - Route protection

### Medical Domain Files
- `lib/medical-schema.ts` - Data models
- `lib/medical-validation.ts` - Validation schemas
- `lib/audit-logger.ts` - Audit system
- `actions/medical.actions.ts` - Medical actions

### Config Files
- `config/appwrite.config.ts` - Appwrite configuration
- `server/clients/index.ts` - Appwrite SDK setup
- `server/cookies.ts` - Session management

## 🔧 Common Tasks

### Create a New Page

```bash
# Create page directory
mkdir -p app/(section)/new-feature

# Create page file
touch app/(section)/new-feature/page.tsx
```

### Create a New Component

```bash
# Create component file
touch components/section/new-component.tsx
```

### Add a New API Route

```bash
# Create API route
mkdir -p app/api/section
touch app/api/section/route.ts
```

### Update Environment Variables

```bash
# Edit .env.local
vim .env.local

# Restart dev server to apply changes
```

## 📚 Useful Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod Validation](https://zod.dev)

### Project Docs
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - 15-phase plan
- [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md) - Auth details
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - System architecture

## 🐛 Troubleshooting

### Build Errors

**Issue**: `Cannot find module '@/...'`
```bash
# Clear .next folder and rebuild
rm -rf .next
pnpm build
```

**Issue**: Appwrite connection errors
- Verify `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct
- Check Appwrite server is running
- Verify API key in `APPWRITE_API_KEY`

### Session Issues

**Issue**: Session expires immediately
- Check cookie settings in `server/cookies.ts`
- Verify session duration in Appwrite console
- Ensure HttpOnly cookies are enabled

### Development Server

**Issue**: Port 3000 already in use
```bash
pnpm dev -p 3001  # Use different port
```

**Issue**: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

## 📞 Support & Questions

- Check [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed phase breakdown
- Review [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md) for auth details
- Look at component examples in `components/`
- Review action examples in `actions/`

## 🎯 Next Steps

1. **Complete Phase 1**: Fix and enhance authentication
   - Review `actions/auth.actions.ts`
   - Implement email verification
   - Add password reset
   - Test all flows

2. **Start Phase 2**: Landing page redesign
   - Update `app/page.tsx`
   - Create landing components
   - Optimize for conversions

3. **Deploy**: Get feedback early
   - Deploy to Vercel
   - Share staging URL
   - Gather user feedback

## 📝 Development Notes

- Always use TypeScript for type safety
- Use Zod for input validation
- Log all critical actions to audit logs
- Test RBAC before merging to main
- Keep components small and reusable
- Document complex logic with comments
- Follow existing code style and patterns

---

**Last Updated**: January 22, 2026
**Status**: Ready for Development
**Current Phase**: Phase 1 (Auth) & Phase 2 (Landing Page)
