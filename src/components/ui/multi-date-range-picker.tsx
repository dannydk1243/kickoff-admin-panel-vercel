// "use client"

// import * as React from "react"
// import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns"
// import { DateRange } from "react-day-picker"
// import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react"

// import { cn } from "@/lib/utils"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// export type DateRangeWithTime = {
//   id: string
//   from: Date
//   to: Date
//   startTime: string // e.g., "10:00"
//   endTime: string // e.g., "16:00"
//   isFullMonth?: boolean
// }

// export function MultiDateRangeWithTime({
//   onChange,
//   onRangeSelectAction, // Your custom function call per selection
// }: {
//   onChange: (ranges: DateRangeWithTime[]) => void
//   onRangeSelectAction?: (range: DateRangeWithTime) => void
// }) {
//   const [selections, setSelections] = React.useState<DateRangeWithTime[]>([])
//   const [activeRange, setActiveRange] = React.useState<DateRange | undefined>()

//   // Helper to trigger external functions
//   const updateSelections = (newSelections: DateRangeWithTime[]) => {
//     setSelections(newSelections)
//     onChange(newSelections)
//   }

//   const addRange = (range: DateRange | undefined) => {
//     if (range?.from && range?.to) {
//       const newRange: DateRangeWithTime = {
//         id: Math.random().toString(36).substr(2, 9),
//         from: range.from,
//         to: range.to,
//         startTime: "10:00",
//         endTime: "16:00",
//       }
//       const updated = [...selections, newRange]
//       updateSelections(updated)
//       onRangeSelectAction?.(newRange) // Trigger your custom function
//       setActiveRange(undefined) // Reset picker
//     }
//   }

//   const removeRange = (id: string) => {
//     updateSelections(selections.filter((s) => s.id !== id))
//   }

//   const selectFullMonth = () => {
//     const start = startOfMonth(new Date())
//     const end = endOfMonth(new Date())
//     addRange({ from: start, to: end })
//   }

//   return (
//     <div className="space-y-4 w-full">
//       <div className="flex flex-wrap gap-2">
//         <Popover modal>
//           <PopoverTrigger asChild>
//             <Button variant="outline" className="h-10 border-dashed">
//               <Plus className="mr-2 h-4 w-4" /> Add Date Range
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <div className="p-3 border-b flex justify-between items-center">
//               <span className="text-sm font-medium">Select Range</span>
//               <Button size="sm" variant="ghost" onClick={selectFullMonth}>
//                 Select Whole Month
//               </Button>
//             </div>
//             <Calendar
//               mode="range"
//               selected={activeRange}
//               onSelect={(range) => {
//                 setActiveRange(range)
//                 if (range?.to) addRange(range)
//               }}
//               numberOfMonths={2}
//             />
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Render Selected Ranges with Time Inputs */}
//       <div className="grid gap-3">
//         {selections.map((item) => (
//           <div
//             key={item.id}
//             className="flex flex-col p-3 border rounded-lg bg-card space-y-3"
//           >
//             <div className="flex justify-between items-center">
//               <div className="flex items-center text-sm font-medium">
//                 <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
//                 {format(item.from, "PPP")} - {format(item.to, "PPP")}
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => removeRange(item.id)}
//               >
//                 <X className="h-4 w-4 text-destructive" />
//               </Button>
//             </div>

//             <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-md">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-xs uppercase font-bold text-muted-foreground">
//                   Time Range:
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="time"
//                   value={item.startTime}
//                   className="h-8 w-[110px]"
//                   onChange={(e) => {
//                     const updated = selections.map((s) =>
//                       s.id === item.id ? { ...s, startTime: e.target.value } : s
//                     )
//                     updateSelections(updated)
//                   }}
//                 />
//                 <span className="text-sm text-muted-foreground">to</span>
//                 <Input
//                   type="time"
//                   value={item.endTime}
//                   className="h-8 w-[110px]"
//                   onChange={(e) => {
//                     const updated = selections.map((s) =>
//                       s.id === item.id ? { ...s, endTime: e.target.value } : s
//                     )
//                     updateSelections(updated)
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }


"use client";

import * as React from "react";
import { format, parseISO, addDays, isBefore, startOfToday, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, X, Plus, Clock, Lock, Edit2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type CourtRange = {
  id: string;
  from: Date;
  to: Date;
  startTime: string;
  endTime: string;
  type: "EXISTING" | "NEW";
  scope: "FULL" | "PARTIAL";
  originalData?: any;
};

export function AdvancedCourtCalendar({ 
  existingData, 
  onAddSelection 
}: { 
  existingData: any[], 
  onAddSelection: (range: CourtRange) => void 
}) {
  const [selections, setSelections] = React.useState<CourtRange[]>([]);
  const [activeRange, setActiveRange] = React.useState<DateRange | undefined>();
  const [currentScope, setCurrentScope] = React.useState<"FULL" | "PARTIAL">("PARTIAL");

  React.useEffect(() => {
  const mappedExisting: CourtRange[] = existingData.map(item => ({
    id: item._id,
    from: parseISO(item.startDatetime),
    to: parseISO(item.endDatetime),
    startTime: format(parseISO(item.startDatetime), "HH:mm"),
    endTime: format(parseISO(item.endDatetime), "HH:mm"),
    type: "EXISTING" as const,
    scope: item.scope as "FULL" | "PARTIAL",
    reason: item.reason,
  }))

  setSelections(mappedExisting)
}, [existingData])

  // Logic: Prevent selecting dates that overlap with existing ranges
  const isDateOccupied = (date: Date) => {
    return selections.some(s => 
      isWithinInterval(date, { start: s.from, end: s.to })
    );
  };

  const handleSelect = (range: DateRange | undefined) => {
    setActiveRange(range);
    if (range?.from && range?.to) {
      const newRange: CourtRange = {
        id: `new-${Math.random().toString(36).substr(2, 5)}`,
        from: range.from,
        to: range.to,
        scope: currentScope,
        startTime: currentScope === "FULL" ? "00:00" : "09:00",
        endTime: currentScope === "FULL" ? "23:59" : "17:00",
        type: "NEW"
      };
      setSelections(prev => [...prev, newRange]);
      onAddSelection(newRange);
      setActiveRange(undefined);
    }
  };

  const tomorrow = addDays(startOfToday(), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> Schedule Exceptions
          </h3>
          <p className="text-sm text-muted-foreground">Manage court downtime and maintenance.</p>
        </div>

        <div className="flex items-center gap-6 bg-muted/50 p-2 px-4 rounded-lg border">
          <RadioGroup 
            defaultValue="PARTIAL" 
            onValueChange={(v) => setCurrentScope(v as "FULL" | "PARTIAL")}
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PARTIAL" id="partial" />
              <Label htmlFor="partial" className="text-xs cursor-pointer">Partial Day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FULL" id="full" />
              <Label htmlFor="full" className="text-xs cursor-pointer">Full Day</Label>
            </div>
          </RadioGroup>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Select Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={activeRange}
                onSelect={handleSelect}
                disabled={(date) => isBefore(date, tomorrow) || isDateOccupied(date)}
                numberOfMonths={2}
                className="rounded-md border shadow"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4">
        {selections.map((item) => (
          <div key={item.id} className={cn(
            "group relative flex flex-col p-4 border rounded-xl transition-all",
            item.type === "EXISTING" ? "" : " border-primary/20 shadow-sm"
          )}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  item.scope === "FULL" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                )}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {format(item.from, "PPP")} — {format(item.to, "PPP")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Scope: {item.scope} {item.type === "EXISTING" && "• (System Locked)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {item.type === "EXISTING" ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => console.log(item.originalData)}>
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={() => setSelections(s => s.filter(x => x.id !== item.id))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 pl-11 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  type="time" 
                  min="09:00" max="17:00"
                  disabled={item.type === "EXISTING" || item.scope === "FULL"}
                  value={item.startTime}
                  className="w-32 h-9 text-sm"
                />
                <span className="text-muted-foreground text-xs font-medium">to</span>
                <Input 
                  type="time" 
                  min="09:00" max="17:00"
                  disabled={item.type === "EXISTING" || item.scope === "FULL"}
                  value={item.endTime}
                  className="w-32 h-9 text-sm"
                />
              </div>
              {item.scope === "PARTIAL" && item.type === "NEW" && (
                <span className="text-[10px] text-muted-foreground italic">Allowed: 09:00 - 17:00</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}