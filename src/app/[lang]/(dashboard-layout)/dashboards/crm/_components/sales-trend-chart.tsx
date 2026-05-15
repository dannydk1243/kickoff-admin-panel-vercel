"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import type { ChartConfig } from "@/components/ui/chart"
import type { BookingsTrendType } from "../types"

import { cn } from "@/lib/utils"

import { useIsRtl } from "@/hooks/use-is-rtl"
import { useRadius } from "@/hooks/use-radius"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BookingsTrendChart({ data }: { data: BookingsTrendType }) {
  const isRtl = useIsRtl()
  const radius = useRadius()

  const { revenueTrends, summary } = data

  const summaryItems = [
    { label: "Pending", value: summary.totalPending, color: "hsl(var(--chart-1))" },
    { label: "Confirmed", value: summary.totalConfirmed, color: "hsl(var(--chart-2))" },
    { label: "Cancelled", value: summary.totalCancelled, color: "hsl(var(--chart-3))" },
    { label: "Completed", value: summary.totalCompleted, color: "hsl(var(--chart-4))" },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-start p-3 border rounded-lg bg-background"
          >
            <div className="flex items-center gap-x-1">
              <span
                style={{ backgroundColor: item.color }}
                className="h-2.5 w-2.5 rounded-sm"
              />
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-2xl font-semibold">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <ChartContainer config={chartConfig} className="grow aspect-auto w-full">
        <BarChart
          accessibilityLayer
          data={revenueTrends}
          margin={{ top: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            reversed={isRtl}
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey="revenue"
            maxBarSize={44}
            fill={chartConfig.revenue.color}
            radius={radius}
          />
        </BarChart>
      </ChartContainer>
    </>
  )
}
