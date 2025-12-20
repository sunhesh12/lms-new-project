import { useState } from 'react'
import styles from '@/css/Calendar.module.css'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function CalendarApp({ auth }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr)
  }

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const clickedDate = new Date(year, month, day)
    setSelectedDate(formatDate(clickedDate))
    setShowModal(true)
  }

  const handleAddEvent = () => {
    if (!eventTitle.trim()) {
      alert('Please enter an event title')
      return
    }

    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      description: eventDescription,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
    }

    setEvents([...events, newEvent])
    
    setEventTitle('')
    setEventDescription('')
    setStartTime('09:00')
    setEndTime('10:00')
    setShowModal(false)
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId))
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
    const days = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.empty}`}></div>)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
      const dayEvents = getEventsForDate(dateStr)
      const isToday = dateStr === formatDate(new Date())
      
      days.push(
        <div 
          key={day} 
          className={`${styles.calendarDay} ${isToday ? styles.today : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={styles.dayNumber}>{day}</div>
          {dayEvents.length > 0 && (
            <div className={styles.eventIndicators}>
              {dayEvents.slice(0, 3).map(event => (
                <div key={event.id} className={styles.eventDot} title={event.title}>
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className={styles.eventMore}>+{dayEvents.length - 3} more</div>
              )}
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  return (
            <AuthenticatedLayout
                user={auth.user}
            >
    <div className={styles.calendarApp}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarMain}>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <div className={styles.calendarNav}>
              <button onClick={previousMonth} className={styles.navBtn}>← Previous</button>
              <button onClick={() => setCurrentDate(new Date())} className={styles.navBtn}>Today</button>
              <button onClick={nextMonth} className={styles.navBtn}>Next →</button>
            </div>
          </div>

          <div className={styles.calendarWeekdays}>
            {dayNames.map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {renderMonthView()}
          </div>
        </div>

        <div className={styles.calendarSidebar}>
          <h2 className={styles.sidebarTitle}>All Events ({events.length})</h2>
          
          {events.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📅</div>
              <p style={{ fontWeight: 600, fontSize: '16px' }}>No events yet</p>
              <p style={{ fontSize: '13px' }}>Click on any date to add an event</p>
            </div>
          ) : (
            events
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event) => (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventItemTitle}>{event.title}</div>
                  <div className={styles.eventItemDate}>{event.date}</div>
                  <div className={styles.eventItemTime}>
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.description && (
                    <div className={styles.eventItemDescription}>{event.description}</div>
                  )}
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalHeader}>Add New Event</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="text"
                className={styles.formInput}
                value={selectedDate || ''}
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Event Title *</label>
              <input
                type="text"
                className={styles.formInput}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description (optional)"
              />
            </div>

            <div className={styles.timeGroup}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Start Time</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>End Time</label>
                <input
                  type="time"
                  className={styles.formInput}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button 
                onClick={handleAddEvent} 
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Add Event
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
    </AuthenticatedLayout>
    
  )
}

export default CalendarApp