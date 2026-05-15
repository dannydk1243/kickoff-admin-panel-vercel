"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Wallet, Landmark } from "lucide-react"

interface WithdrawalStatsProps {
  dictionary: any
  walletData?: {
    balance: number
    withdrawalAmount: number
    withdrawableAmount: number
    currency: string
  }
}

export function WithdrawalStats({ dictionary, walletData }: WithdrawalStatsProps) {
  const stats = {
    totalEarned: walletData?.balance || 0,
    totalWithdrawn: walletData?.withdrawalAmount || 0,
    remainingWithdrawable: walletData?.withdrawableAmount || 0,
    currency: walletData?.currency || "SAR"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Total Amount (balance) */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Landmark className="h-24 w-24" />
        </div>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-2 font-semibold text-primary mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span>{dictionary.withdrawal?.stats?.totalEarned || "Total Amount"}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {stats.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-semibold text-muted-foreground">{stats.currency}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {dictionary.withdrawal?.stats?.earningsDescription || "Current wallet balance"}
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Withdrawal Status (Split) */}
      <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 h-full divide-x divide-border/60">
            {/* Total Withdrawn (withdrawalAmount) */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                <ArrowDownLeft className="h-4 w-4" />
                <span>{dictionary.withdrawal?.stats?.totalWithdrawn || "Total Withdrawn"}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {stats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{stats.currency}</span>
                </div>
                <div className="h-1.5 w-full bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${stats.totalEarned > 0 ? (stats.totalWithdrawn / stats.totalEarned) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Remaining Withdrawable (withdrawableAmount) */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Wallet className="h-4 w-4" />
                <span>{dictionary.withdrawal?.stats?.withdrawable || "Withdrawable"}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {stats.remainingWithdrawable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{stats.currency}</span>
                </div>
                <div className="h-1.5 w-full bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${stats.totalEarned > 0 ? (stats.remainingWithdrawable / stats.totalEarned) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
