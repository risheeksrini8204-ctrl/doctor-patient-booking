import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Award, 
  Phone, 
  MapPin, 
  Star, 
  Camera, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Lock, 
  Moon, 
  Sun, 
  Plus, 
  Trash2,
  FileText,
  Eye,
  Mail,
  Stethoscope
} from 'lucide-react'

// Default mock data in case localStorage is empty
const defaultDoctorProfile = {
  name: "Dr. Adrian Bennett, MD",
  specialty: "Cardiologist & Internal Medicine",
  education: "Harvard Medical School (MD), Residency at Johns Hopkins Hospital",
  phone: "+1 (555) 839-2001",
  email: "dr.bennett@caresync.com",
  clinicLocation: "Suite 405, Metro Health Plaza, New York, NY",
  bio: "Dr. Adrian Bennett is a double-board certified cardiologist with over 15 years of experience. He specializes in preventative cardiology, heart failure management, and comprehensive cardiac health assessments. He is dedicated to patient-centric care using cutting-edge medical insights.",
  avatar: "" // Base64 or empty for placeholder icon
}

const defaultTimings = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startTime: "09:00",
  endTime: "17:00",
  slotDuration: 30 // in minutes
}

const defaultFeedbacks = [
  {
    id: "f1",
    patientName: "Sarah Jenkins",
    rating: 5,
    comment: "Dr. Bennett was extremely patient and explained everything in detail. Highly recommend his clinic!",
    imageUrl: "",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "f2",
    patientName: "Robert Dow",
    rating: 4,
    comment: "Friendly staff and clean clinic. The wait time was minimal and the appointment was very professional.",
    imageUrl: "",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
]

const defaultAppointments = [
  {
    id: "a1",
    patientName: "Sarah Jenkins",
    patientPhone: "555-0199",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    reason: "Routine cardiovascular checkup",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "a2",
    patientName: "Michael Chang",
    patientPhone: "555-0144",
    date: new Date().toISOString().split('T')[0],
    time: "11:30 AM",
    reason: "Follow up on high blood pressure prescription",
    status: "completed",
    createdAt: new Date().toISOString()
  }
]

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || false
  })

  // Toast Notification State
  const [notification, setNotification] = useState(null)

  // Trigger Toast Notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  // App data states loaded from localStorage
  const [doctorProfile, setDoctorProfile] = useState(() => {
    const saved = localStorage.getItem('doctor_profile')
    return saved ? JSON.parse(saved) : defaultDoctorProfile
  })

  const [clinicTimings, setClinicTimings] = useState(() => {
    const saved = localStorage.getItem('clinic_timings')
    return saved ? JSON.parse(saved) : defaultTimings
  })

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments')
    return saved ? JSON.parse(saved) : defaultAppointments
  })

  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('feedbacks')
    return saved ? JSON.parse(saved) : defaultFeedbacks
  })

  // User session state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('current_user')
    return saved ? JSON.parse(saved) : null // { role: 'patient'|'doctor', name: string, phone?: string }
  })

  // UI Navigation / Temporary States
  const [activeAuthTab, setActiveAuthTab] = useState('patient') // 'patient' or 'doctor'
  const [patientLoginName, setPatientLoginName] = useState('')
  const [patientLoginPhone, setPatientLoginPhone] = useState('')
  const [doctorUsername, setDoctorUsername] = useState('')
  const [doctorPassword, setDoctorPassword] = useState('')
  
  // Patient Booking states
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [bookingReason, setBookingReason] = useState('')

  // Patient Feedback states
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackImage, setFeedbackImage] = useState('') // base64 string

  // Doctor Admin sub-tabs
  const [doctorActiveTab, setDoctorActiveTab] = useState('appointments') // 'appointments', 'timings', 'profile', 'feedback'
  const [editProfileForm, setEditProfileForm] = useState({ ...doctorProfile })
  const [editTimingsForm, setEditTimingsForm] = useState({ ...clinicTimings })

  // Image Modal View state
  const [modalImage, setModalImage] = useState(null)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('doctor_profile', JSON.stringify(doctorProfile))
  }, [doctorProfile])

  useEffect(() => {
    localStorage.setItem('clinic_timings', JSON.stringify(clinicTimings))
  }, [clinicTimings])

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks))
  }, [feedbacks])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('current_user')
    }
  }, [currentUser])

  // Apply dark mode CSS class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Handle patient login (direct, no password)
  const handlePatientLogin = (e) => {
    e.preventDefault()
    if (!patientLoginName.trim() || !patientLoginPhone.trim()) {
      showToast("Please enter both Name and Contact Number", "error")
      return
    }
    const user = {
      role: 'patient',
      name: patientLoginName.trim(),
      phone: patientLoginPhone.trim()
    }
    setCurrentUser(user)
    showToast(`Welcome back, ${user.name}!`, "success")
    setPatientLoginName('')
    setPatientLoginPhone('')
  }

  // Handle doctor login
  const handleDoctorLogin = (e) => {
    e.preventDefault()
    if (doctorUsername === 'doctor' && doctorPassword === 'admin') {
      const user = {
        role: 'doctor',
        name: 'Dr. Adrian Bennett'
      }
      setCurrentUser(user)
      showToast("Admin Dashboard loaded successfully!", "success")
      setDoctorUsername('')
      setDoctorPassword('')
    } else {
      showToast("Invalid credentials. Try doctor / admin", "error")
    }
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    showToast("Logged out successfully.")
  }

  // Generate available time slots based on doctor settings
  const generateTimeSlots = () => {
    const slots = []
    const startStr = clinicTimings.startTime // e.g. "09:00"
    const endStr = clinicTimings.endTime // e.g. "17:00"
    const duration = clinicTimings.slotDuration // e.g. 30

    let [startH, startM] = startStr.split(':').map(Number)
    let [endH, endM] = endStr.split(':').map(Number)

    let currentMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    while (currentMinutes + duration <= endMinutes) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      const ampm = h >= 12 ? 'PM' : 'AM'
      const displayH = h % 12 === 0 ? 12 : h % 12
      const displayM = m < 10 ? `0${m}` : m
      
      slots.push(`${displayH}:${displayM} ${ampm}`)
      currentMinutes += duration
    }

    return slots
  }

  // Filter slots to remove already booked slots on the selected date
  const getAvailableSlotsForDate = (date) => {
    if (!date) return []
    const dayIndex = new Date(date).getDay()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const selectedDayName = daysOfWeek[dayIndex]

    // Verify if doctor is available on this day
    if (!clinicTimings.days.includes(selectedDayName)) {
      return [] // Doctor not available
    }

    const allSlots = generateTimeSlots()
    const bookedTimes = appointments
      .filter(app => app.date === date && app.status !== 'cancelled')
      .map(app => app.time)

    return allSlots.filter(slot => !bookedTimes.includes(slot))
  }

  // Handle Booking form submission
  const handleBookAppointment = (e) => {
    e.preventDefault()
    if (!bookingDate) {
      showToast("Please choose a date", "error")
      return
    }
    if (!bookingTime) {
      showToast("Please choose a time slot", "error")
      return
    }
    if (!bookingReason.trim()) {
      showToast("Please specify the reason for booking", "error")
      return
    }

    const newApp = {
      id: "a_" + Date.now(),
      patientName: currentUser.name,
      patientPhone: currentUser.phone,
      date: bookingDate,
      time: bookingTime,
      reason: bookingReason.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    }

    setAppointments(prev => [newApp, ...prev])
    showToast("Appointment booked successfully!", "success")
    
    // reset form
    setBookingDate('')
    setBookingTime('')
    setBookingReason('')
  }

  // Image Upload helper
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // limit 2MB
        showToast("Image size must be less than 2MB", "error")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeedbackImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Feedback Submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedbackComment.trim() && !feedbackImage) {
      showToast("Please write a comment or upload a picture", "error")
      return
    }

    const newFeedback = {
      id: "f_" + Date.now(),
      patientName: currentUser.name,
      rating: feedbackRating,
      comment: feedbackComment.trim(),
      imageUrl: feedbackImage,
      createdAt: new Date().toISOString()
    }

    setFeedbacks(prev => [newFeedback, ...prev])
    showToast("Thank you for your feedback!", "success")

    // reset
    setFeedbackRating(5)
    setFeedbackComment('')
    setFeedbackImage('')
  }

  // Admin: Complete/Cancel Appointment
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus }
      }
      return app
    }))
    showToast(`Appointment status updated to ${newStatus}`)
  }

  // Admin: Save profile info
  const handleSaveProfile = (e) => {
    e.preventDefault()
    setDoctorProfile(editProfileForm)
    showToast("Profile details updated successfully!")
  }

  // Helper for Profile Image Upload
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditProfileForm(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Admin: Save Timing settings
  const handleSaveTimings = (e) => {
    e.preventDefault()
    setClinicTimings(editTimingsForm)
    showToast("Clinic timings updated successfully!")
  }

  // Admin: Toggle day in timings
  const handleToggleDay = (day) => {
    const index = editTimingsForm.days.indexOf(day)
    let updatedDays = [...editTimingsForm.days]
    if (index > -1) {
      updatedDays.splice(index, 1)
    } else {
      updatedDays.push(day)
    }
    setEditTimingsForm(prev => ({ ...prev, days: updatedDays }))
  }

  // Date formatter
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString(undefined, options)
  }

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {notification && (
        <div className={`notification-banner ${notification.type === 'error' ? 'btn-danger' : 'btn-primary'}`}>
          {notification.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Modern Navigation Header */}
      <nav className="app-nav">
        <div className="logo-container" onClick={() => currentUser ? null : setActiveAuthTab('patient')}>
          <div className="logo-mark">
            <Stethoscope size={24} color="white" />
          </div>
          <div className="logo-text">CareSync</div>
        </div>

        <div className="nav-actions">
          {/* Light/Dark mode toggle */}
          <button 
            className="btn-icon" 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser ? (
            <>
              <div className="user-badge">
                <User size={14} />
                <span>{currentUser.name} ({currentUser.role})</span>
              </div>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="user-badge" style={{ background: 'transparent', border: '1px dashed var(--border-light)' }}>
              <span>Not Signed In</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      {!currentUser ? (
        /* ================= AUTHENTICATION / LOGIN LANDING ================= */
        <div className="auth-wrapper">
          <div className="glass-card auth-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Access Portal</h2>
              <p style={{ color: 'var(--text-light-secondary)', fontSize: '0.95rem' }}>Select your portal and complete your details to continue</p>
            </div>

            <div className="auth-tabs">
              <div 
                className={`auth-tab ${activeAuthTab === 'patient' ? 'active' : ''}`}
                onClick={() => setActiveAuthTab('patient')}
              >
                Patient Portal
              </div>
              <div 
                className={`auth-tab ${activeAuthTab === 'doctor' ? 'active' : ''}`}
                onClick={() => setActiveAuthTab('doctor')}
              >
                Doctor Admin
              </div>
            </div>

            {activeAuthTab === 'patient' ? (
              /* Patient Quick Access (No password) */
              <form onSubmit={handlePatientLogin}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                  💡 Patients can access booking and feedback boards instantly without password authorization. Just enter your profile credentials.
                </p>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Eleanor Vance" 
                    value={patientLoginName} 
                    onChange={e => setPatientLoginName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. (555) 012-3456" 
                    value={patientLoginPhone} 
                    onChange={e => setPatientLoginPhone(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Access Booking Dashboard
                </button>
              </form>
            ) : (
              /* Doctor Secure Login (Standard Admin credentials) */
              <form onSubmit={handleDoctorLogin}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                  🔑 Access is restricted to clinic staff. Please log in with your administrative credentials.
                </p>
                <div className="form-group">
                  <label className="form-label">Admin Username</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Username" 
                    value={doctorUsername} 
                    onChange={e => setDoctorUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Password" 
                    value={doctorPassword} 
                    onChange={e => setDoctorPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-light-muted)', margin: '-0.5rem 0 1.5rem 0' }}>
                  Demo credentials: <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px' }}>doctor</code> / <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px' }}>admin</code>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Authenticate & Enter
                </button>
              </form>
            )}
          </div>
        </div>
      ) : currentUser.role === 'patient' ? (
        /* ================= PATIENT DASHBOARD VIEW ================= */
        <div className="dashboard-grid">
          {/* Doctor Details Profile Panel */}
          <div className="glass-card doctor-info-panel">
            <div className="avatar-wrapper">
              {doctorProfile.avatar ? (
                <img src={doctorProfile.avatar} alt={doctorProfile.name} className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  <User size={64} style={{ color: 'var(--primary)' }} />
                </div>
              )}
            </div>
            <div>
              <h3 className="doctor-name">{doctorProfile.name}</h3>
              <span className="doctor-specialty">{doctorProfile.specialty}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div className="info-row">
                <Award size={18} className="info-icon" />
                <div className="info-content">
                  <div className="info-label">Qualifications</div>
                  <div className="info-value">{doctorProfile.education}</div>
                </div>
              </div>

              <div className="info-row">
                <Phone size={18} className="info-icon" />
                <div className="info-content">
                  <div className="info-label">Clinic Number</div>
                  <div className="info-value">{doctorProfile.phone}</div>
                </div>
              </div>

              <div className="info-row">
                <Mail size={18} className="info-icon" />
                <div className="info-content">
                  <div className="info-label">Contact Email</div>
                  <div className="info-value">{doctorProfile.email}</div>
                </div>
              </div>

              <div className="info-row">
                <MapPin size={18} className="info-icon" />
                <div className="info-content">
                  <div className="info-label">Address</div>
                  <div className="info-value">{doctorProfile.clinicLocation}</div>
                </div>
              </div>
            </div>

            {/* Doctor timings summary */}
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Clock size={16} /> Clinic Hours
              </h4>
              <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                {clinicTimings.days.join(', ')}
              </p>
              <span className="doctor-specialty" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.8rem' }}>
                {clinicTimings.startTime} - {clinicTimings.endTime} ({clinicTimings.slotDuration} min slots)
              </span>
            </div>
          </div>

          {/* Booking & Review Core Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Book Appointment Card */}
            <div className="glass-card">
              <div className="booking-header">
                <h3 className="booking-title">Book an Appointment</h3>
                <p style={{ color: 'var(--text-light-secondary)', fontSize: '0.9rem' }}>Choose your slot and request an consultation timing.</p>
              </div>

              <form onSubmit={handleBookAppointment}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Consultation Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={e => {
                        setBookingDate(e.target.value)
                        setBookingTime('') // Reset selected slot
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Appointment Reason</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Checkup, prescription refill" 
                      value={bookingReason}
                      onChange={e => setBookingReason(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {bookingDate && (
                  <div className="form-group" style={{ marginTop: '0.75rem' }}>
                    <label className="form-label">Select Available Time Slot</label>
                    {getAvailableSlotsForDate(bookingDate).length > 0 ? (
                      <div className="slots-grid">
                        {getAvailableSlotsForDate(bookingDate).map((slot, index) => (
                          <div 
                            key={index} 
                            className={`slot-card ${bookingTime === slot ? 'selected' : ''}`}
                            onClick={() => setBookingTime(slot)}
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--accent-danger)', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                        ⚠️ Doctor is not available or fully booked on this date. Please select another date.
                      </div>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={!bookingDate || !bookingTime || !bookingReason.trim()}
                  style={{ marginTop: '1.5rem', width: '100%' }}
                >
                  <Calendar size={18} /> Confirm Appointment
                </button>
              </form>
            </div>

            {/* Patient Booking History */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} /> Your Appointments
              </h3>
              
              {appointments.filter(app => app.patientPhone === currentUser.phone).length > 0 ? (
                <div className="appointment-list">
                  {appointments
                    .filter(app => app.patientPhone === currentUser.phone)
                    .map((app) => (
                      <div key={app.id} className="appointment-card">
                        <div className="patient-info">
                          <span className="patient-name">{app.reason}</span>
                          <div className="appointment-meta">
                            <span className="meta-item"><Calendar size={13} /> {formatDate(app.date)}</span>
                            <span className="meta-item"><Clock size={13} /> {app.time}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className={`appointment-status status-${app.status}`}>
                            {app.status}
                          </span>
                          {app.status === 'pending' && (
                            <button 
                              className="btn btn-icon" 
                              onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                              title="Cancel Appointment"
                              style={{ color: 'var(--accent-danger)' }}
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p style={{ color: 'var(--text-light-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  No bookings found under your number ({currentUser.phone}). Use the booking form above to schedule one.
                </p>
              )}
            </div>

            {/* Patient Feedback Submission Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Share Clinic Feedback</h3>
              <p style={{ color: 'var(--text-light-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Help us improve by leaving a review. You can optionally upload clinic photos or images of your prescriptions.
              </p>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label className="form-label">Review Rating</label>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        style={{ color: star <= feedbackRating ? 'var(--accent-warning)' : 'var(--text-light-muted)' }}
                        onClick={() => setFeedbackRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Comments</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Write details of your clinic experience..."
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Picture (Optional)</label>
                  <div className="file-upload-zone" onClick={() => document.getElementById('feedback-file-input').click()}>
                    <Camera size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
                      Drag and drop, or click to upload clinic picture
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light-muted)' }}>JPEG, PNG up to 2MB</span>
                  </div>
                  <input 
                    type="file" 
                    id="feedback-file-input" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload} 
                  />

                  {feedbackImage && (
                    <div className="img-preview-container">
                      <div style={{ position: 'relative' }}>
                        <img src={feedbackImage} alt="Feedback preview" className="img-preview-thumb" />
                        <button 
                          type="button" 
                          className="btn-icon" 
                          onClick={() => setFeedbackImage('')}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent-danger)', color: 'white', width: '20px', height: '20px', padding: 0 }}
                        >
                          <XCircle size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Submit Clinic Review
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ================= DOCTOR ADMIN PORTAL VIEW ================= */
        <div>
          {/* Admin Navigation Tabs */}
          <div className="doctor-tabs">
            <button 
              className={`doctor-tab-btn ${doctorActiveTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setDoctorActiveTab('appointments')}
            >
              Appointments Manager
            </button>
            <button 
              className={`doctor-tab-btn ${doctorActiveTab === 'timings' ? 'active' : ''}`}
              onClick={() => setDoctorActiveTab('timings')}
            >
              Update Timings
            </button>
            <button 
              className={`doctor-tab-btn ${doctorActiveTab === 'profile' ? 'active' : ''}`}
              onClick={() => setDoctorActiveTab('profile')}
            >
              Clinic & Professional Details
            </button>
            <button 
              className={`doctor-tab-btn ${doctorActiveTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setDoctorActiveTab('feedback')}
            >
              Patient Feedback ({feedbacks.length})
            </button>
          </div>

          {/* Doctor tab contents */}
          <div className="glass-card">
            {doctorActiveTab === 'appointments' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={22} /> Appointment Bookings Ledger
                </h3>

                {appointments.length > 0 ? (
                  <div className="appointment-list">
                    {appointments.map((app) => (
                      <div key={app.id} className="appointment-card" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="patient-info">
                          <span className="patient-name">{app.patientName}</span>
                          <div className="appointment-meta" style={{ flexWrap: 'wrap' }}>
                            <span className="meta-item"><Phone size={13} /> {app.patientPhone}</span>
                            <span className="meta-item"><Calendar size={13} /> {formatDate(app.date)}</span>
                            <span className="meta-item"><Clock size={13} /> {app.time}</span>
                          </div>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-light-secondary)' }}>
                            <strong>Reason:</strong> {app.reason}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className={`appointment-status status-${app.status}`}>
                            {app.status}
                          </span>

                          {app.status === 'pending' && (
                            <div className="action-buttons">
                              <button 
                                className="btn btn-success" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                onClick={() => updateAppointmentStatus(app.id, 'completed')}
                              >
                                <CheckCircle size={14} /> Mark Done
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                              >
                                <XCircle size={14} /> Cancel
                              </button>
                            </div>
                          )}

                          {app.status !== 'pending' && (
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                              onClick={() => updateAppointmentStatus(app.id, 'pending')}
                            >
                              Reset status
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-light-muted)' }}>
                    No appointments taken yet.
                  </div>
                )}
              </div>
            )}

            {doctorActiveTab === 'timings' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={22} /> Update Clinic Consultation Hours
                </h3>

                <form onSubmit={handleSaveTimings}>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.75rem' }}>Active Workdays</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                        const active = editTimingsForm.days.includes(day)
                        return (
                          <div 
                            key={day}
                            className={`slot-card ${active ? 'selected' : ''}`}
                            onClick={() => handleToggleDay(day)}
                            style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '20px' }}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Start Time</label>
                      <input 
                        type="time" 
                        className="form-input" 
                        value={editTimingsForm.startTime} 
                        onChange={e => setEditTimingsForm(prev => ({ ...prev, startTime: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Time</label>
                      <input 
                        type="time" 
                        className="form-input" 
                        value={editTimingsForm.endTime} 
                        onChange={e => setEditTimingsForm(prev => ({ ...prev, endTime: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Consultation Slot Duration (Minutes)</label>
                    <select 
                      className="form-input" 
                      value={editTimingsForm.slotDuration} 
                      onChange={e => setEditTimingsForm(prev => ({ ...prev, slotDuration: Number(e.target.value) }))}
                    >
                      <option value="15">15 Minutes</option>
                      <option value="20">20 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                    Save Timings Configuration
                  </button>
                </form>
              </div>
            )}

            {doctorActiveTab === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={22} /> Edit Professional Profile & Clinic Details
                </h3>

                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <div className="avatar-wrapper" style={{ margin: 0 }}>
                      {editProfileForm.avatar ? (
                        <img src={editProfileForm.avatar} alt="Profile photo" className="avatar-img" />
                      ) : (
                        <div className="avatar-placeholder">
                          <User size={48} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Profile Picture</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfileImageUpload} 
                        className="form-input" 
                        style={{ border: 'none', background: 'transparent', padding: 0 }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Doctor Name & Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editProfileForm.name} 
                        onChange={e => setEditProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Medical Specialty</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editProfileForm.specialty} 
                        onChange={e => setEditProfileForm(prev => ({ ...prev, specialty: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Education & Qualifications</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editProfileForm.education} 
                      onChange={e => setEditProfileForm(prev => ({ ...prev, education: e.target.value }))}
                      required 
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Clinic Contact Phone</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editProfileForm.phone} 
                        onChange={e => setEditProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Clinic Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={editProfileForm.email} 
                        onChange={e => setEditProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Clinic Location Address</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editProfileForm.clinicLocation} 
                      onChange={e => setEditProfileForm(prev => ({ ...prev, clinicLocation: e.target.value }))}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Bio / Description</label>
                    <textarea 
                      className="form-input" 
                      rows="4" 
                      value={editProfileForm.bio} 
                      onChange={e => setEditProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Save Professional Details
                  </button>
                </form>
              </div>
            )}

            {doctorActiveTab === 'feedback' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={22} className="info-icon" style={{ color: 'var(--accent-warning)' }} /> Patient Reviews & Feedbacks
                </h3>

                {feedbacks.length > 0 ? (
                  <div className="feedback-grid">
                    {feedbacks.map((f) => (
                      <div key={f.id} className="feedback-card">
                        <div className="feedback-header">
                          <strong style={{ fontSize: '1.05rem' }}>{f.patientName}</strong>
                          <div className="rating-stars">
                            {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                          </div>
                        </div>

                        <p className="feedback-comment">
                          "{f.comment || 'No comment text provided'}"
                        </p>

                        {f.imageUrl && (
                          <div className="feedback-image-container" onClick={() => setModalImage(f.imageUrl)}>
                            <img src={f.imageUrl} alt="Patient attachment" className="feedback-image" />
                          </div>
                        )}

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light-muted)', textAlign: 'right', marginTop: 'auto' }}>
                          {formatDate(f.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-light-muted)' }}>
                    No patient feedback has been submitted yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button 
              className="btn-icon" 
              onClick={() => setModalImage(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.05)' }}
            >
              <XCircle size={22} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', width: '100%', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Attached Clinic Image Preview
            </h3>
            <img 
              src={modalImage} 
              alt="Full size feedback preview" 
              style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px', objectFit: 'contain', boxShadow: 'var(--shadow-md)' }} 
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '3rem', paddingBottom: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-light-muted)' }}>
        <p>&copy; {new Date().getFullYear()} CareSync Professional Clinic Systems. All rights reserved.</p>
        <p style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <span>Secure AES-256 Storage</span>
          <span>&bull;</span>
          <span>Direct Access patient portal</span>
        </p>
      </footer>
    </div>
  )
}
