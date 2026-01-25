# MediCare Pro - Backend Architecture & Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Architecture](#backend-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Local Development Setup](#local-development-setup)
7. [Deployment Guide](#deployment-guide)

---

## 🏥 Project Overview

MediCare Pro is a comprehensive Hospital Management System with the following modules:
- **Dashboard** - Real-time hospital metrics and quick actions
- **Patients** - Patient registration, medical records, and history
- **Doctors** - Staff management and scheduling
- **Appointments** - Scheduling and calendar management
- **Departments** - Department-wise resource allocation
- **Emergency** - Triage and emergency queue management
- **Pharmacy** - Inventory and dispensing management
- **Laboratory** - Test requests and result management
- **Billing** - Invoice generation and payment tracking
- **Reports** - Analytics and data visualization
- **Settings** - System configuration and user preferences

---

## 🏗️ Backend Architecture

### Recommended Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│   React 18 + TypeScript + Vite + TailwindCSS + React Query  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER (REST/GraphQL)                 │
│         Node.js + Express / Supabase Edge Functions          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│              PostgreSQL (Supabase / Self-hosted)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE & AUTH                            │
│          Supabase Storage + Supabase Auth / JWT              │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Options

#### Option 1: Supabase (Recommended - Fastest Setup)
- **Database**: PostgreSQL (managed)
- **Authentication**: Supabase Auth (email, OAuth)
- **Storage**: Supabase Storage (for medical files/images)
- **API**: Auto-generated REST API + Edge Functions
- **Real-time**: Built-in subscriptions

#### Option 2: Self-Hosted Node.js
- **Runtime**: Node.js 18+
- **Framework**: Express.js / Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Storage**: AWS S3 / Local filesystem

#### Option 3: Python/Django
- **Framework**: Django REST Framework
- **Database**: PostgreSQL with Django ORM
- **Authentication**: Django Auth + JWT
- **Storage**: Django Storages (S3 compatible)

---

## 🗃️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   patients   │     │   doctors    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email        │     │ name         │     │ name         │
│ password     │     │ email        │     │ email        │
│ role         │     │ phone        │     │ phone        │
│ created_at   │     │ dob          │     │ specialty    │
│ updated_at   │     │ gender       │     │ department_id│
└──────────────┘     │ blood_type   │     │ experience   │
                     │ address      │     │ status       │
                     │ department_id│     │ schedule     │
                     │ status       │     │ created_at   │
                     │ created_at   │     └──────────────┘
                     └──────────────┘            │
                           │                     │
                           ▼                     ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ appointments │     │ departments  │
                     ├──────────────┤     ├──────────────┤
                     │ id (PK)      │     │ id (PK)      │
                     │ patient_id   │◄────│ name         │
                     │ doctor_id    │     │ head_doctor  │
                     │ date         │     │ bed_capacity │
                     │ time         │     │ occupied_beds│
                     │ type         │     │ staff_count  │
                     │ status       │     │ created_at   │
                     │ notes        │     └──────────────┘
                     │ created_at   │
                     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  medicines   │     │  lab_tests   │     │  invoices    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ name         │     │ patient_id   │     │ patient_id   │
│ category     │     │ test_name    │     │ date         │
│ stock        │     │ ordered_by   │     │ due_date     │
│ unit_price   │     │ status       │     │ subtotal     │
│ expiry_date  │     │ result       │     │ tax          │
│ supplier     │     │ notes        │     │ total        │
│ reorder_level│     │ sample_date  │     │ status       │
│ created_at   │     │ result_date  │     │ paid_amount  │
└──────────────┘     │ created_at   │     │ created_at   │
                     └──────────────┘     └──────────────┘
       │                                        │
       ▼                                        ▼
┌──────────────┐                         ┌──────────────┐
│ dispensings  │                         │invoice_items │
├──────────────┤                         ├──────────────┤
│ id (PK)      │                         │ id (PK)      │
│ medicine_id  │                         │ invoice_id   │
│ patient_id   │                         │ description  │
│ quantity     │                         │ quantity     │
│ prescribed_by│                         │ unit_price   │
│ dispensed_at │                         │ total        │
└──────────────┘                         └──────────────┘

┌──────────────┐     ┌──────────────┐
│ emergencies  │     │  settings    │
├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │
│ patient_name │     │ user_id      │
│ condition    │     │ key          │
│ severity     │     │ value        │
│ status       │     │ updated_at   │
│ assigned_to  │     └──────────────┘
│ arrival_time │
│ treatment    │
│ created_at   │
└──────────────┘
```

### SQL Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_tech')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_doctor_id UUID REFERENCES doctors(id),
    bed_capacity INTEGER DEFAULT 0,
    occupied_beds INTEGER DEFAULT 0,
    staff_count INTEGER DEFAULT 0,
    color VARCHAR(7), -- Hex color for UI
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., P001
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Admitted', 'Discharged', 'Critical')),
    medical_history JSONB DEFAULT '[]',
    allergies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., D001
    user_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    specialty VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    experience_years INTEGER DEFAULT 0,
    qualification TEXT,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'In Surgery', 'On Leave', 'Busy')),
    schedule JSONB DEFAULT '{}', -- Working hours per day
    consultation_fee DECIMAL(10, 2),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., APT001
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Checkup', 'Follow-up', 'Consultation', 'Emergency', 'Surgery', 'Lab Test')),
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show')),
    notes TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    prescription TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency cases table
CREATE TABLE emergencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., EM001
    patient_id UUID REFERENCES patients(id),
    patient_name VARCHAR(200) NOT NULL,
    age INTEGER,
    condition TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'Serious', 'Moderate', 'Minor')),
    status VARCHAR(50) DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'In Treatment', 'Stabilized', 'Discharged', 'Admitted')),
    assigned_doctor_id UUID REFERENCES doctors(id),
    triage_notes TEXT,
    treatment_notes TEXT,
    arrival_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    treatment_start_time TIMESTAMP WITH TIME ZONE,
    discharge_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines/Pharmacy inventory table
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., MED001
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    category VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(200),
    stock_quantity INTEGER DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'tablets',
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    expiry_date DATE,
    reorder_level INTEGER DEFAULT 10,
    storage_conditions TEXT,
    requires_prescription BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock', 'Expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicine dispensing records
CREATE TABLE dispensings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    prescribed_by UUID REFERENCES doctors(id),
    quantity INTEGER NOT NULL,
    dosage VARCHAR(100),
    instructions TEXT,
    dispensed_by UUID REFERENCES users(id),
    dispensed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Laboratory tests table
CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., LAB001
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(200) NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    test_category VARCHAR(100),
    ordered_by UUID REFERENCES doctors(id),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Sample Collected', 'Processing', 'Completed', 'Cancelled')),
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Urgent', 'Normal', 'Routine')),
    sample_type VARCHAR(100),
    sample_collected_at TIMESTAMP WITH TIME ZONE,
    result TEXT,
    result_values JSONB,
    normal_range VARCHAR(100),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., INV001
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 10.00,
    tax_amount DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Partial', 'Paid', 'Overdue', 'Cancelled')),
    payment_method VARCHAR(50),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment records
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Cash', 'Card', 'Insurance', 'Bank Transfer', 'Check')),
    reference_number VARCHAR(100),
    notes TEXT,
    received_by UUID REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings/preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, setting_key)
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for tracking changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_department ON patients(department_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_doctors_department ON doctors(department_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_emergencies_severity ON emergencies(severity);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_medicines_category ON medicines(category);
CREATE INDEX idx_medicines_status ON medicines(status);
CREATE INDEX idx_lab_tests_status ON lab_tests(status);
CREATE INDEX idx_lab_tests_patient ON lab_tests(patient_id);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergencies_updated_at BEFORE UPDATE ON emergencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_tests_updated_at BEFORE UPDATE ON lab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/me` | Get current user profile |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients (with pagination) |
| GET | `/api/patients/:id` | Get patient by ID |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |
| GET | `/api/patients/:id/history` | Get patient medical history |
| GET | `/api/patients/:id/appointments` | Get patient appointments |
| GET | `/api/patients/:id/invoices` | Get patient invoices |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| POST | `/api/doctors` | Create new doctor |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/doctors/:id/schedule` | Get doctor schedule |
| PUT | `/api/doctors/:id/schedule` | Update doctor schedule |
| GET | `/api/doctors/:id/appointments` | Get doctor appointments |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments (filter by date/doctor/patient) |
| GET | `/api/appointments/:id` | Get appointment by ID |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| GET | `/api/appointments/calendar` | Get calendar view data |

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List all departments |
| GET | `/api/departments/:id` | Get department by ID |
| POST | `/api/departments` | Create department |
| PUT | `/api/departments/:id` | Update department |
| GET | `/api/departments/:id/stats` | Get department statistics |

### Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emergencies` | List emergency cases |
| GET | `/api/emergencies/:id` | Get emergency case by ID |
| POST | `/api/emergencies` | Register emergency case |
| PUT | `/api/emergencies/:id` | Update emergency case |
| PUT | `/api/emergencies/:id/triage` | Update triage info |
| PUT | `/api/emergencies/:id/discharge` | Discharge patient |

### Pharmacy
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | List medicines (with stock info) |
| GET | `/api/medicines/:id` | Get medicine by ID |
| POST | `/api/medicines` | Add medicine |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |
| POST | `/api/medicines/:id/dispense` | Dispense medicine |
| GET | `/api/medicines/low-stock` | Get low stock alerts |
| GET | `/api/medicines/expiring` | Get expiring medicines |

### Laboratory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lab-tests` | List lab tests |
| GET | `/api/lab-tests/:id` | Get lab test by ID |
| POST | `/api/lab-tests` | Order lab test |
| PUT | `/api/lab-tests/:id` | Update lab test |
| PUT | `/api/lab-tests/:id/sample` | Mark sample collected |
| PUT | `/api/lab-tests/:id/result` | Add test result |

### Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List invoices |
| GET | `/api/invoices/:id` | Get invoice by ID |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |
| POST | `/api/invoices/:id/payment` | Record payment |
| GET | `/api/invoices/:id/pdf` | Generate PDF |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Dashboard statistics |
| GET | `/api/reports/patients` | Patient analytics |
| GET | `/api/reports/revenue` | Revenue reports |
| GET | `/api/reports/departments` | Department statistics |
| POST | `/api/reports/generate` | Generate custom report |
| GET | `/api/reports/export` | Export report (CSV/PDF) |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/user` | Get user settings |
| PUT | `/api/settings/user` | Update user settings |
| GET | `/api/settings/system` | Get system settings (admin) |
| PUT | `/api/settings/system` | Update system settings |

---

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **admin** | Full access to all modules and settings |
| **doctor** | View/edit patients, appointments, prescriptions |
| **nurse** | View patients, update vitals, assist with treatments |
| **receptionist** | Manage appointments, patient registration |
| **pharmacist** | Manage pharmacy inventory, dispense medicines |
| **lab_tech** | Process lab tests, update results |

### JWT Token Structure
```json
{
  "sub": "user-uuid",
  "email": "user@hospital.com",
  "role": "doctor",
  "department_id": "dept-uuid",
  "permissions": ["patients.read", "patients.write", "appointments.write"],
  "iat": 1699999999,
  "exp": 1700003599
}
```

### Security Best Practices
1. Use HTTPS in production
2. Implement rate limiting on auth endpoints
3. Store passwords with bcrypt (cost factor 12+)
4. Use HTTP-only cookies for refresh tokens
5. Implement CORS properly
6. Sanitize all user inputs
7. Use parameterized queries (prevent SQL injection)
8. Enable Row Level Security (RLS) if using Supabase

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher (or bun/yarn/pnpm)
- Git
- PostgreSQL 14+ (if self-hosting database)

### Frontend Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd medicare-pro

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your settings:
#   VITE_API_URL=http://localhost:3001/api
#   VITE_SUPABASE_URL=your-supabase-url (if using Supabase)
#   VITE_SUPABASE_ANON_KEY=your-anon-key

# 5. Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Backend Setup (Node.js/Express Example)

```bash
# 1. Create backend directory
mkdir backend && cd backend

# 2. Initialize project
npm init -y

# 3. Install dependencies
npm install express cors helmet dotenv pg prisma @prisma/client jsonwebtoken bcryptjs
npm install -D typescript @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken ts-node nodemon

# 4. Initialize Prisma
npx prisma init

# 5. Configure database in prisma/schema.prisma
# Copy the schema from DATABASE SCHEMA section above

# 6. Run migrations
npx prisma migrate dev --name init

# 7. Generate Prisma client
npx prisma generate

# 8. Create server.ts and implement API routes

# 9. Start development server
npm run dev
```

### Using Supabase (Recommended)

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref your-project-ref

# 4. Push database migrations
supabase db push

# 5. Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Frontend Environment Variables
VITE_APP_NAME="MediCare Pro"
VITE_API_URL=http://localhost:3001/api

# Supabase (if using)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend Environment Variables (if self-hosting)
DATABASE_URL=postgresql://user:password@localhost:5432/medicare_pro
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=another-secret-key-for-refresh
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
PORT=3001
NODE_ENV=development
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test

# Type checking
npm run typecheck
```

---

## 🚀 Deployment Guide

### Option 1: Lovable Deployment (Simplest)
1. Click "Publish" in Lovable interface
2. Enable Lovable Cloud for backend features
3. Your app is live!

### Option 2: Vercel/Netlify (Frontend) + Supabase (Backend)
1. Connect GitHub repo to Vercel/Netlify
2. Set environment variables in dashboard
3. Deploy automatically on push

### Option 3: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 4: VPS Deployment
1. SSH into your VPS
2. Install Node.js, PM2, Nginx
3. Clone repo and build
4. Configure Nginx as reverse proxy
5. Use PM2 for process management

---

## 📁 Project Structure

```
medicare-pro/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   ├── patients/      # Patient-related dialogs
│   │   ├── doctors/       # Doctor-related dialogs
│   │   ├── appointments/  # Appointment components
│   │   ├── pharmacy/      # Pharmacy components
│   │   ├── laboratory/    # Lab components
│   │   ├── billing/       # Billing components
│   │   ├── emergency/     # Emergency components
│   │   └── dashboard/     # Dashboard widgets
│   ├── pages/             # Page components (routes)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── services/          # API service functions
│   ├── context/           # React context providers
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 📞 Support & Resources

- **Lovable Documentation**: https://docs.lovable.dev
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

## 📝 License

This project is created as a final year project for educational purposes.

---

*Generated by MediCare Pro HMS - Built with ❤️ using Lovable*
