"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Hash,
  History,
  Copy,
  User,
  Users,
  Filter,
} from "lucide-react"

import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { loaderManager } from "@/lib/loading-manager"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getWalletTransactions } from "@/components/dashboards/services/apiService"

type UserWalletType = {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  userType: string
  currency: string
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

type Transaction = {
  _id: string
  wallet: string
  type: "CREDIT" | "DEBIT"
  source: string
  sourceId: any
  amount: number
  balanceAfter: number
  createdAt: string
  updatedAt: string
}

type PaymentStats = {
  totalCredit: number
  totalDebit: number
}

type UserWalletFormProps = {
  onClose?: () => void
  userWalletDetails?: UserWalletType
  dictionary: any
}

export function UserWalletForm({
  onClose,
  userWalletDetails,
  dictionary,
}: UserWalletFormProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [sourceFilter, setSourceFilter] = useState<string>("ALL")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const observerTarget = useRef(null)

  const fetchTransactions = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      if (!userWalletDetails?._id) return

      if (isInitial) {
        loaderManager.setLoading(true)
      }
      setIsLoading(true)
      try {
        const fromDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
        const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")

        const response = await getWalletTransactions(
          userWalletDetails._id,
          pageNum,
          15,
          typeFilter === "ALL" ? "" : typeFilter,
          fromDate,
          toDate,
          sourceFilter === "ALL" ? "" : sourceFilter
        )

        if (response && response.transactions) {
          if (isInitial) {
            setTransactions(response.transactions)
            if (response.stats) setStats(response.stats)
          } else {
            setTransactions((prev) => [...prev, ...response.transactions])
          }
          setPage(pageNum)
          setHasMore(pageNum < (response.pagination?.pages || 1))
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
        if (isInitial) {
          loaderManager.setLoading(false)
        }
      }
    },
    [userWalletDetails?._id, typeFilter, sourceFilter, dateRange]
  )

  useEffect(() => {
    if (userWalletDetails?._id) {
      fetchTransactions(1, true)
    }
  }, [userWalletDetails?._id, typeFilter, sourceFilter, dateRange, fetchTransactions])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          await fetchTransactions(page + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, page, fetchTransactions])

  if (!userWalletDetails) return null

  let {
    _id,
    user,
    userType,
    currency,
    balance,
    isActive,
    createdAt,
    updatedAt,
  } = userWalletDetails

  if (userType == 'Admin') { userType = 'Owner' }

  return (
    <div className="flex flex-col h-full space-y-4 pr-2 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight">
            {dictionary?.tableColumnLabels?.walletDetails ||
              "User Wallet Details"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span className="font-mono">{_id}</span>
          </div>
        </div>
        <Badge
          variant={isActive ? "default" : "destructive"}
          className="px-2 py-0.5 text-xs"
        >
          {isActive
            ? dictionary?.userWallet?.active || "Active"
            : dictionary?.userWallet?.inactive || "Inactive"}
        </Badge>
      </div>

      <Separator />

      <div className={`grid grid-cols-1 ${stats ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-primary text-sm">
              <User className="h-4 w-4" />
              <span>
                {dictionary?.profile?.personalInformation || "User Information"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="font-semibold text-base leading-tight truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/2 border-primary/20">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-primary text-sm">
              <DollarSign className="h-4 w-4" />
              <span>
                {dictionary?.userWallet?.walletBalance || "Wallet Balance"}
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-3xl font-black text-primary tracking-tight">
                  {balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-lg text-muted-foreground font-semibold">
                  {currency}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 capitalize">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">{userType}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {stats && (
          <Card className="bg-gradient-to-br from-primary/5 to-primary/2 border-primary/20">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-primary text-sm">
                <History className="h-4 w-4" />
                <span>
                  {dictionary?.userWallet?.statistics || "Statistics"}
                </span>
              </div>
              <div className="space-y-2 mt-1">
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/10 p-2 rounded-lg border border-green-100 dark:border-green-900/20">
                  <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-xs">{dictionary?.userWallet?.totalCredit || "Total Credit"}</span>
                  </div>
                  <span className="font-bold text-sm text-green-700 dark:text-green-400">
                    +{stats.totalCredit.toLocaleString()} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                  <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400">
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                    <span className="font-medium text-xs">{dictionary?.userWallet?.totalDebit || "Total Debit"}</span>
                  </div>
                  <span className="font-bold text-sm text-red-700 dark:text-red-400">
                    -{stats.totalDebit.toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardHeader className="pb-2 pt-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 m-0 whitespace-nowrap">
              <History className="h-4 w-4 text-primary" />
              {dictionary?.userWallet?.transactionHistory || "Transaction History"}
            </CardTitle>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-[200px]">
                <DateRangePicker
                  value={dateRange}
                  onValueChange={setDateRange}
                  placeholder={dictionary?.userWallet?.selectDateRange || "Select Date Range"}
                  disablePastDates={false}
                />
              </div>
              <div className="w-[120px]">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={dictionary?.userWallet?.type || "Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{dictionary?.userWallet?.allTypes || "All Types"}</SelectItem>
                    <SelectItem value="CREDIT">{dictionary?.userWallet?.credit || "Credit"}</SelectItem>
                    <SelectItem value="DEBIT">{dictionary?.userWallet?.debit || "Debit"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[130px]">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={dictionary?.userWallet?.source || "Source"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{dictionary?.userWallet?.allSources || "All Sources"}</SelectItem>
                    <SelectItem value="Payment">{dictionary?.userWallet?.payment || "Payment"}</SelectItem>
                    <SelectItem value="Booking">{dictionary?.userWallet?.booking || "Booking"}</SelectItem>
                    <SelectItem value="Refund">{dictionary?.userWallet?.refund || "Refund"}</SelectItem>
                    <SelectItem value="Withdrawal">{dictionary?.userWallet?.withdrawal || "Withdrawal"}</SelectItem>
                    <SelectItem value="Voucher">{dictionary?.userWallet?.voucher || "Voucher"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 min-h-0 overflow-hidden mt-2">
          <ScrollArea className="h-full">
            <div className="px-6 pb-6 pt-0">
              {transactions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {transactions.map((tx) => {
                    const filteredSource = tx.sourceId ? {
                      source: tx.sourceId.source || tx.sourceId,
                      createdAt: tx.sourceId.createdAt,
                      gateway: tx.sourceId.gateway,
                      description: tx.sourceId.description
                    } : null;

                    return (
                      <AccordionItem
                        value={tx._id}
                        key={tx._id}
                        className="border rounded-lg px-4 bg-card hover:bg-accent/30 transition-colors data-[state=open]:bg-accent/30"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center justify-between w-full pr-4 text-left">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${tx.type === "CREDIT"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                              >
                                {tx.type === "CREDIT" ? (
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                ) : (
                                  <ArrowDownLeft className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-semibold text-sm leading-none flex items-center gap-2">
                                  {tx.source.replace("_", " ")}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-mono">
                                  {tx._id}
                                </p>
                              </div>
                            </div>
                            <div className="text-right space-y-0.5">
                              <p
                                className={`font-bold text-sm ${tx.type === "CREDIT"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                                  }`}
                              >
                                {tx.type === "CREDIT" ? "+" : "-"}
                                {tx.amount.toLocaleString()} {currency}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {dictionary?.userWallet?.balanceAfter || "Balance After :"} {tx.balanceAfter.toLocaleString()} {currency}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-1 p-3 bg-muted/40 rounded-md border">
                            <div className="mb-2 border-b pb-2 border-border/50">
                              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {dictionary?.userWallet?.transactionDetails || "Transaction Details"}
                              </span>
                            </div>
                            {filteredSource ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground font-medium mb-0.5">{dictionary?.userWallet?.createdAt || "Created At"}</span>
                                  <span>{filteredSource.createdAt ? new Date(filteredSource.createdAt).toLocaleString() : "-"}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground font-medium mb-0.5">{dictionary?.userWallet?.gateway || "Gateway"}</span>
                                  <span className="capitalize">{filteredSource.gateway || "-"}</span>
                                </div>
                                <div className="flex flex-col col-span-full">
                                  <span className="text-muted-foreground font-medium mb-0.5">{dictionary?.userWallet?.description || "Description"}</span>
                                  <span>{filteredSource.description || "-"}</span>
                                </div>

                                {filteredSource.source && typeof filteredSource.source === 'object' && (
                                  <>
                                    <div className="col-span-full mt-2 mb-1 border-t pt-2 border-border/30">
                                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {dictionary?.userWallet?.sourceInformation || "Source Information"}
                                      </span>
                                    </div>
                                    {Object.entries(filteredSource.source).map(([key, value]) => (
                                      <div className="flex flex-col" key={key}>
                                        <span className="text-muted-foreground font-medium capitalize mb-0.5">
                                          {key.replace(/_/g, ' ')}
                                        </span>
                                        <span className="break-words">
                                          {value !== null && value !== undefined && value !== "" ? String(value) : "-"}
                                        </span>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">{dictionary?.userWallet?.noDetailsAvailable || "No details available"}</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                  <div
                    ref={observerTarget}
                    className="h-4 flex items-center justify-center pt-2"
                  >
                    {isLoading && (
                      <span className="text-xs text-muted-foreground">
                        {dictionary?.userWallet?.loadingMore ||
                          "Loading more..."}
                      </span>
                    )}
                  </div>
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  {!isLoading && (
                    <>
                      <History className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-sm">
                        {dictionary?.userWallet?.noTransactionsFound ||
                          "No transactions found"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {dictionary?.userWallet?.created || "Created"}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {new Date(createdAt).toLocaleDateString()}&nbsp;
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {dictionary?.userWallet?.lastUpdated || "Last Updated"}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {new Date(updatedAt).toLocaleDateString()}&nbsp;
                {new Date(updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
