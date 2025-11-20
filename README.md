# AI & ML Club - Oriental College of Technology

<div align="center">
  <img src="public/images/logo aiml.png" alt="AIML Club Logo" width="200"/>
  <h3>Innovate • Implement • Inspire</h3>
  <p>Official website for the AI & Machine Learning Club at Oriental College of Technology, Bhopal</p>
</div>

---

## 🌟 Features

### Public Website
- ✨ Modern, responsive design with dark mode support
- 🎨 Beautiful animations using Framer Motion
- 📱 Mobile-first approach
- 🏠 Home page with hero section, stats, and previews
- 👥 Team page with core member profiles
- 📅 Events page (upcoming & past events)
- 🎯 Highlights/Blog section
- 🖼️ Gallery with lightbox viewer
- 📝 Join membership form
- 💡 Anonymous suggestion box
- 🔔 Notification center

### Admin Panel
- 🔐 Secure authentication with role-based access
- 📊 Dashboard with statistics
- 📅 Event management (create, edit, delete)
- 👥 Team management
- 🎓 Member approval system
- 🖼️ Gallery management
- 💡 Suggestion review with ChatGPT auto-reply
- 🔔 Notification & email broadcast system
- ✨ Highlights/Blog management

---

## 🚀 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- React Hot Toast

**Backend**
- Appwrite Cloud (BaaS)
- Appwrite Auth
- Appwrite Databases
- Appwrite Storage
- Appwrite Functions

**Deployment**
- Vercel (Frontend)
- Appwrite Cloud (Backend)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account at [cloud.appwrite.io](https://cloud.appwrite.io)

### Quick Setup (Automated) ⚡

1. **Clone and Install**
   ```bash
   git clone https://github.com/aimlcluboct/website.git
   cd website
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in your Appwrite credentials:
     ```env
     NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
     NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
     APPWRITE_API_KEY=your_api_key_with_permissions
     ```

3. **Run Automated Setup**
   ```bash
   npm run setup:complete
   ```
   This will automatically:
   - Create all required collections and buckets in Appwrite
   - Update `.env.local` with generated collection IDs
   - Create necessary API routes
   - Verify the connection

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### ✅ Verification

After setup, check:
- No "TBD" values in `.env.local`
- Homepage loads without errors
- All collections visible in Appwrite Console

### 📖 Detailed Setup Guide

For troubleshooting and manual setup options, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Setup & Configuration
npm run setup:complete     # Complete automated setup
npm run setup:appwrite     # Create Appwrite collections only
npm run fix:permissions    # Fix Appwrite permissions

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking
```

---

## 🔧 Manual Appwrite Setup (Optional)

If you prefer manual setup, follow the schema in `APPWRITE_SCHEMA.md`.

### Step 1: Create Project & Database
1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Copy the **Project ID**

### Step 2: Create Database
1. Navigate to **Databases** → Create Database
2. Copy the **Database ID**

### Step 3: Create Collections

Create the following collections with these attributes:

#### **events**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| title | string | 255 | Yes | No |
| description | string | 5000 | Yes | No |
| startDate | datetime | - | Yes | No |
| endDate | datetime | - | Yes | No |
| location | string | 255 | Yes | No |
| posterUrl | string | 500 | No | No |
| status | enum | - | Yes | No |
| slug | string | 255 | Yes | No |
| type | enum | - | Yes | No |
| gallery | string | 100 | No | Yes |

**Status values:** Scheduled, Completed, Cancelled  
**Type values:** Talk, Session, Workshop, Test, Event, Hackathon, Guest Lecture, Orientation

#### **highlights**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| title | string | 255 | Yes | No |
| slug | string | 255 | Yes | No |
| excerpt | string | 500 | Yes | No |
| content | string | 50000 | Yes | No |
| author | string | 100 | Yes | No |
| createdAt | datetime | - | Yes | No |
| coverImage | string | 500 | No | No |

#### **team**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| name | string | 100 | Yes | No |
| role | string | 100 | Yes | No |
| category | enum | - | Yes | No |
| photo | string | 500 | No | No |
| email | string | 255 | No | No |
| phone | string | 15 | No | No |
| instagram | string | 255 | No | No |
| linkedin | string | 255 | No | No |
| github | string | 255 | No | No |
| order | integer | - | Yes | No |

**Category values:** Faculty, President, Vice President, Event Head, Media, Tech, Discipline, Editor, Stage

#### **members**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| name | string | 100 | Yes | No |
| email | string | 255 | Yes | No |
| phone | string | 15 | Yes | No |
| semester | string | 10 | Yes | No |
| course | string | 100 | Yes | No |
| reason | string | 1000 | Yes | No |
| status | enum | - | Yes | No |
| subscribe | boolean | - | Yes | No |

**Status values:** Pending, Approved, Rejected

#### **suggestions**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| content | string | 5000 | Yes | No |
| anonymous | boolean | - | Yes | No |
| userName | string | 100 | No | No |
| userEmail | string | 255 | No | No |
| response | string | 5000 | No | No |
| status | enum | - | Yes | No |

**Status values:** Pending, Responded

#### **notifications**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| title | string | 255 | Yes | No |
| message | string | 1000 | Yes | No |
| type | enum | - | Yes | No |
| read | boolean | - | Yes | No |
| link | string | 500 | No | No |

**Type values:** Info, Event, Alert, Success

#### **subscribers**
| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| email | string | 255 | Yes | No |
| active | boolean | - | Yes | No |

### Step 4: Create Storage Buckets
1. Navigate to **Storage**
2. Create three buckets:
   - `gallery` - For event photos
   - `events` - For event posters
   - `team` - For team member photos

### Step 5: Set Permissions
For all collections and buckets, configure:
- **Read access:** Anyone
- **Write access:** Users (for forms) / Role-based for admin

### Step 6: Setup Authentication
1. Navigate to **Auth**
2. Enable **Email/Password** authentication
3. Create admin users manually with preferences:
   ```json
   {
     "role": "President"
   }
   ```

---

## 🔐 User Roles & Permissions

| Role | Access Level |
|------|-------------|
| President | Full access to everything |
| Vice President | Almost full access |
| Faculty | Read + Approve permissions |
| Core Team | Limited admin access |
| Members | Profile access only |

---

## 📧 Email Integration

### Setup Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an **App Password**:
   - Go to Google Account → Security
   - App Passwords → Generate
3. Add credentials to `.env.local`

### Appwrite Function for Email
Create an Appwrite Function named `sendEmail`:

```javascript
// In Appwrite Functions editor
const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

module.exports = async ({ req, res, log, error }) => {
  const { to, subject, html } = JSON.parse(req.payload);

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return res.json({ success: true });
  } catch (err) {
    error(err);
    return res.json({ success: false, error: err.message });
  }
};
```

---

## 🤖 ChatGPT Integration

### Setup OpenAI Function
Create an Appwrite Function named `aiResponder`:

```javascript
const OpenAI = require('openai');

module.exports = async ({ req, res, log, error }) => {
  const { question } = JSON.parse(req.payload);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for the AIML Club at OCT.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    return res.json({ success: true, answer });
  } catch (err) {
    error(err);
    return res.json({ success: false, error: err.message });
  }
};
```

---

## 📂 Project Structure

```
aiml-club-oct/
├── app/
│   ├── (public)/           # Public website routes
│   │   ├── page.tsx        # Home page
│   │   ├── team/
│   │   ├── events/
│   │   ├── highlights/
│   │   ├── gallery/
│   │   ├── join/
│   │   └── suggestions/
│   ├── admin/              # Admin panel routes
│   │   ├── login/
│   │   ├── page.tsx        # Dashboard
│   │   ├── events/
│   │   ├── team/
│   │   ├── members/
│   │   ├── gallery/
│   │   ├── suggestions/
│   │   └── notifications/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── context/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   ├── appwrite.ts         # Appwrite client
│   ├── database.ts         # Database services
│   └── utils.ts            # Utility functions
├── public/
│   └── images/
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 Customization

### Update Club Information
Edit the constants in:
- `components/Footer.tsx` - Social links
- `components/Navbar.tsx` - Navigation items
- `app/(public)/page.tsx` - Home page content

### Change Theme Colors
Modify `tailwind.config.ts`:
```typescript
colors: {
  primary: { ... },  // Your primary color
  secondary: { ... }, // Your secondary color
}
```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables on Vercel
Add all `.env.local` variables to Vercel project settings.

---

## 📱 Social Links

- **Instagram:** https://tr.ee/hJjcCHWnGT
- **LinkedIn:** https://www.linkedin.com/company/aimlcluboct
- **GitHub:** https://github.com/aimlcluboct
- **Email:** aimlcluboct@gmail.com
- **WhatsApp Channel:** https://whatsapp.com/channel/0029VbAthv38V0tfulumuV1D

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**Faculty Leadership**
- Dr. Rajesh Kumar Nigam — HOD, AIML Dept
- Shamaila Khan — Coordinating Faculty

**Core Team**
- Vishal Kumar — President
- Umesh Patel — Vice President
- Kinshuk Verma — Tech Lead

---

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Email: aimlcluboct@gmail.com
- Contact the Tech Lead

---

<div align="center">
  <p>Made with ❤️ by AIML Club Tech Team</p>
  <p>© 2024 AI & ML Club - Oriental College of Technology</p>
</div>
