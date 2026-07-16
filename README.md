# CareSync - Doctor & Patient Appointment Booking Portal

CareSync is a premium, fully-responsive web application designed to streamline the clinic appointment scheduling workflow. It features a passwordless direct-login portal for patients to request appointments and submit photo/text reviews, alongside a secure administrative portal for doctors to manage schedules, update details, adjust timings, and view feedback.

---

## Key Features

### 👤 Patient Portal
- **Passwordless Direct Login**: Access booking features instantly by entering your name and phone number.
- **Doctor Details**: View up-to-date details including education credentials, specialties, contact info, bio, and clinic location.
- **Interactive Booking**: Choose a consultation date and view real-time available time slots (already booked slots are dynamically hidden).
- **Patient Feedback**: Review the clinic with star ratings, comments, and image uploads (prescriptions, clinic pictures).
- **Personal Booking Ledger**: View past and upcoming appointments with status indicators (Pending, Completed, Cancelled).

### 🩺 Doctor Admin Portal
- **Secure Authentication**: Log in with administrative credentials (Username: `doctor`, Password: `admin`).
- **Appointments Ledger**: View all appointments, mark them as completed, or cancel them.
- **Clinical Hours Settings**: Adjust active workdays, start/end hours, and appointment slot durations.
- **Profile Manager**: Edit name, specialty, bio, qualifications, contact number, and profile picture.
- **Feedback & Review Gallery**: Browse patient feedbacks and click image attachments to view them in a high-resolution lightbox.

---

## Technology Stack

- **Frontend**: React 19, Vite, Lucide React (for icons)
- **Styling**: Vanilla CSS (Custom properties, grid, flexbox, glassmorphic filters, keyframe animations)
- **State Management**: Client-side state synchronized with `localStorage` for instant responsiveness and persistence.

---

## Installation & Setup

1. **Clone or navigate to the directory**:
   ```bash
   cd c:\Users\Hp\Downloads\project\doctor-patient-booking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```
