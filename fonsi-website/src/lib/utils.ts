export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

function formatDollars(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`
}

export function formatPrice(min: number, max: number): string {
  if (min === max) {
    return formatDollars(min)
  }
  return `${formatDollars(min)} - ${formatDollars(max)}`
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const isAM = hour < 12
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${isAM ? 'AM' : 'PM'}`
}

export function getDayOfWeekName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[day]
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  bookedSlots: string[] = []
): string[] {
  const slots: string[] = []
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let currentTime = new Date()
  currentTime.setHours(startHour, startMin, 0, 0)

  const endDateTime = new Date()
  endDateTime.setHours(endHour, endMin, 0, 0)

  while (currentTime < endDateTime) {
    const hours = String(currentTime.getHours()).padStart(2, '0')
    const minutes = String(currentTime.getMinutes()).padStart(2, '0')
    const timeSlot = `${hours}:${minutes}`

    if (!bookedSlots.includes(timeSlot)) {
      slots.push(timeSlot)
    }

    currentTime.setMinutes(currentTime.getMinutes() + duration)
  }

  return slots
}
