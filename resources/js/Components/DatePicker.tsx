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
  allowedDays?: number[] // 0 = Sunday, 1 = Monday, etc.
  disabledDays?: number[]
  className?: string
  placeHolder?: string
  disableNavigation?: boolean // New prop to control navigation
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
    allowPastDates = false,
    maxFutureDays,
    dateFormat = "PPP",
    onChange,
    value,
    allowedDays,
    disabledDays,
    className,
    placeHolder,
    disableNavigation = false,
    minDate,
    maxDate
  }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(() =>
      value ? startOfDay(value) : undefined
    )

    React.useEffect(() => {
      if (value) {
        setDate(startOfDay(value))
      }
    }, [value])

    const handleDateChange = React.useCallback((newDate: Date | undefined) => {
      const normalizedDate = newDate ? startOfDay(newDate) : undefined
      setDate(normalizedDate)
      onChange?.(normalizedDate)
    }, [onChange])

    const isDateDisabled = React.useCallback((date: Date) => {
      if (!date || isNaN(date.getTime())) {
        return true
      }

      const today = startOfDay(new Date())
      const targetDate = startOfDay(date)
      const dayOfWeek = getDay(targetDate)

      // Check min date
      if (minDate && isBefore(targetDate, startOfDay(minDate))) {
        return true
      }

      // Check max date
      if (maxDate && isAfter(targetDate, startOfDay(maxDate))) {
        return true
      }

      // Check past dates
      if (!allowPastDates && isBefore(targetDate, today)) {
        return true
      }

      // Check future dates
      if (typeof maxFutureDays === 'number' && maxFutureDays >= 0) {
        const maxFutureDate = startOfDay(addDays(today, maxFutureDays))
        if (isAfter(targetDate, maxFutureDate)) {
          return true
        }
      }

      // Check day-of-week restrictions
      if (Array.isArray(allowedDays) && allowedDays.length > 0) {
        return !allowedDays.includes(dayOfWeek)
      }

      if (Array.isArray(disabledDays) && disabledDays.includes(dayOfWeek)) {
        return true
      }

      return false
    }, [allowPastDates, maxFutureDays, allowedDays, disabledDays, minDate, maxDate])

    const formattedDate = React.useMemo(() => {
      try {
        return date ? format(date, dateFormat) : undefined
      } catch (error) {
        console.error('Error formatting date:', error)
        return undefined
      }
    }, [date, dateFormat])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ? formattedDate : <span>
                {placeHolder ? placeHolder : 'Pick a date'}
            </span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={isDateDisabled}
            initialFocus
            fromDate={minDate}
            toDate={maxDate}
            captionLayout={disableNavigation ? "buttons" : "dropdown"}
            hideHead={disableNavigation}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
