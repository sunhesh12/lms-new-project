import { useState, useEffect } from 'react'
import styles from '@/css/calendar.module.css'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

function CalendarApp({ auth }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [loading, setLoading] = useState(false)
  
  // Filter states
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1)
  const [searchDate, setSearchDate] = useState('')
  const [eventFilter, setEventFilter] = useState('this-month') // 'all' or 'this-month'
  const [notificationFilter, setNotificationFilter] = useState('today') // 'all' or 'today'
  const [todayEvents, setTodayEvents] = useState([])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Fetch events from the server
  useEffect(() => {
    fetchEvents();
  }, [])

  // Apply filters whenever events or filter values change
  useEffect(() => {
    applyFilters();
    updateTodayEvents();
  }, [events, filterYear, filterMonth, searchDate, eventFilter])

  // Update filters when currentDate changes
  useEffect(() => {
    setFilterYear(currentDate.getFullYear());
    setFilterMonth(currentDate.getMonth() + 1);
  }, [currentDate])

  const updateTodayEvents = () => {
    const today = formatDate(new Date());
    const eventsToday = events.filter(event => event.date === today);
    setTodayEvents(eventsToday);
  }

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  const applyFilters = () => {
    let filtered = [...events];

    // If specific date is searched, show only that date's events
    if (searchDate) {
      filtered = filtered.filter(event => event.date === searchDate);
    } 
    // Otherwise apply event filter (all or this month)
    else if (eventFilter === 'this-month') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth() + 1;
        
        return eventYear === filterYear && eventMonth === filterMonth;
      });
    }
    // If 'all', no filtering needed - show all events

    setFilteredEvents(filtered);
  }

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

  const handleAddEvent = async () => {
    if (!eventTitle.trim()) {
      alert('Please enter an event title')
      return
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/events', {
        title: eventTitle,
        description: eventDescription,
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
      });

      setEvents([...events, response.data]);
      
      // Reset form
      setEventTitle('')
      setEventDescription('')
      setStartTime('09:00')
      setEndTime('10:00')
      setShowModal(false)
      
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('Failed to add event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setFilterYear(today.getFullYear());
    setFilterMonth(today.getMonth() + 1);
    setSearchDate('');
  }

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setFilterYear(year);
    setCurrentDate(new Date(year, filterMonth - 1, 1));
  }

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setFilterMonth(month);
    setCurrentDate(new Date(filterYear, month - 1, 1));
  }

  const clearDateFilter = () => {
    setSearchDate('');
  }

  const handleDateSearch = (e) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
    
    // Move calendar to the selected date's month and year
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
      setFilterYear(date.getFullYear());
      setFilterMonth(date.getMonth() + 1);
    }
  }

  const getSidebarTitle = () => {
    if (searchDate) {
      return `Events on ${searchDate}`;
    } else if (eventFilter === 'all') {
      return 'All Events';
    } else {
      return `Events in ${monthNames[filterMonth - 1]} ${filterYear}`;
    }
  }

  const getNotificationsToDisplay = () => {
    if (notificationFilter === 'today') {
      return todayEvents;
    } else {
      // Show all upcoming events (today and future)
      const today = formatDate(new Date());
      return events.filter(event => event.date >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
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
      const isSearchedDate = searchDate && dateStr === searchDate
      
      days.push(
        <div 
          key={day} 
          className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${isSearchedDate ? styles.searchedDate : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={styles.dayNumber}>{day}</div>
          {dayEvents.length > 0 && (
            <div className={styles.eventIndicators}>
              {dayEvents.slice(0, 2).map(event => (
                <div key={event.id} className={styles.eventBadge} title={event.title}>
                  <span className={styles.eventTime}>{event.start_time}</span>
                  <span className={styles.eventTitle}>{event.title}</span>
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className={styles.eventMore}>+{dayEvents.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className={styles.calendarApp}>
        {/* Notifications Panel */}
        <div className={styles.notificationsPanel}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>
              📢 {notificationFilter === 'today' ? "Today's Events" : 'Upcoming Events'}
            </h3>
            <div className={styles.notificationFilterButtons}>
              <button 
                className={`${styles.notifFilterBtn} ${notificationFilter === 'today' ? styles.notifFilterBtnActive : ''}`}
                onClick={() => setNotificationFilter('today')}
              >
                Today
              </button>
              <button 
                className={`${styles.notifFilterBtn} ${notificationFilter === 'all' ? styles.notifFilterBtnActive : ''}`}
                onClick={() => setNotificationFilter('all')}
              >
                All Upcoming
              </button>
            </div>
          </div>
          
          <div className={styles.notificationList}>
            {getNotificationsToDisplay().length === 0 ? (
              <div className={styles.noNotifications}>
                <span className={styles.noNotifIcon}>🎉</span>
                <p>{notificationFilter === 'today' ? 'No events today!' : 'No upcoming events!'}</p>
              </div>
            ) : (
              getNotificationsToDisplay().map((event) => (
                <div key={event.id} className={styles.notificationItem}>
                  <div className={styles.notifTime}>{event.start_time}</div>
                  <div className={styles.notifContent}>
                    <div className={styles.notifEventTitle}>{event.title}</div>
                    <div className={styles.notifEventDate}>{event.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {loading && (
          <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            background: '#4F46E5', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '8px',
            zIndex: 1000 
          }}>
            Loading...
          </div>
        )}
        
        <div className={styles.calendarContainer}>
          <div className={styles.calendarMain}>
            <div className={styles.calendarHeader}>
              <div className={styles.calendarTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              
              {/* Search Date Filter */}
              <div className={styles.searchDateContainer}>
                <input 
                  type="date"
                  value={searchDate}
                  onChange={handleDateSearch}
                  className={styles.searchDateInput}
                  placeholder="Search date"
                />
                {searchDate && (
                  <button onClick={clearDateFilter} className={styles.clearSearchBtn} title="Clear date filter">
                    ✕
                  </button>
                )}
              </div>

              <div className={styles.calendarNav}>
                <button onClick={previousMonth} className={styles.navBtn}>← Previous</button>
                <button onClick={goToToday} className={styles.navBtn}>Today</button>
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
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>
                {getSidebarTitle()} ({filteredEvents.length})
              </h2>
              
              {/* Event Filter Buttons */}
              {!searchDate && (
                <div className={styles.eventFilterButtons}>
                  <button 
                    className={`${styles.filterBtn} ${eventFilter === 'this-month' ? styles.filterBtnActive : ''}`}
                    onClick={() => setEventFilter('this-month')}
                  >
                    This Month
                  </button>
                  <button 
                    className={`${styles.filterBtn} ${eventFilter === 'all' ? styles.filterBtnActive : ''}`}
                    onClick={() => setEventFilter('all')}
                  >
                    All Events
                  </button>
                </div>
              )}
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>📅</div>
                <p style={{ fontWeight: 600, fontSize: '16px' }}>No events found</p>
                <p style={{ fontSize: '13px' }}>
                  {searchDate ? 'No events on this date' : 'Click on any date to add an event'}
                </p>
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventItemTitle}>{event.title}</div>
                    <div className={styles.eventItemDate}>{event.date}</div>
                    <div className={styles.eventItemTime}>
                      {event.start_time} - {event.end_time}
                    </div>
                    {event.description && (
                      <div className={styles.eventItemDescription}>{event.description}</div>
                    )}
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Event'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={loading}
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