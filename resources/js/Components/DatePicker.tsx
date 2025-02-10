import * as React from "react"
import { format, isBefore, isAfter, startOfDay, addDays, getDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

interface DatePickerProps {
  allowPastDates?: boolean
  maxFutureDays?: number
  dateFormat?: string
  onChange?: (date: Date | undefined) => void
  value?: Date
  // New props for dynamic day selection
  allowedDays?: number[] // 0 = Sunday, 1 = Monday, etc.
  disabledDays?: number[]
}

export function DatePicker({
  allowPastDates = false,
  maxFutureDays,
  dateFormat = "PPP",
  onChange,
  value,
  allowedDays,
  disabledDays
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  // Function to handle date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onChange?.(newDate)
  }

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date())
    const dayOfWeek = getDay(date)

    // Check if the day is specifically allowed
    if (allowedDays && allowedDays.length > 0) {
      return !allowedDays.includes(dayOfWeek)
    }

    // Check if the day is specifically disabled
    if (disabledDays && disabledDays.includes(dayOfWeek)) {
      return true
    }

    // Past dates check
    if (!allowPastDates && isBefore(date, today)) {
      return true
    }

    // Future dates check
    if (maxFutureDays !== undefined) {
      const maxDate = addDays(today, maxFutureDays)
      if (isAfter(date, maxDate)) {
        return true
      }
    }

    return false
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          disabled={isDateDisabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker;
