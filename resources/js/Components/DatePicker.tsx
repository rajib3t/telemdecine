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
  placeHolder?:string
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
    placeHolder
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

      // First check past dates
      if (!allowPastDates && isBefore(targetDate, today)) {
        return true
      }

      // Then check future dates
      if (typeof maxFutureDays === 'number' && maxFutureDays >= 0) {
        const maxDate = startOfDay(addDays(today, maxFutureDays))
        if (isAfter(targetDate, maxDate)) {
          return true
        }
      }

      // Finally check day-of-week restrictions
      if (Array.isArray(allowedDays) && allowedDays.length > 0) {
        return !allowedDays.includes(dayOfWeek)
      }

      if (Array.isArray(disabledDays) && disabledDays.includes(dayOfWeek)) {
        return true
      }

      return false
    }, [allowPastDates, maxFutureDays, allowedDays, disabledDays])

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
                {placeHolder ? placeHolder :'Pick a date'}
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
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
