"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Table } from "@tanstack/react-table"
import Cookies from "js-cookie"
import { DiamondPlus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ROLES } from "@/lib/enum"
import { getMyBeneficiary } from "@/components/dashboards/services/apiService"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import { AccountDetailsForm } from "../../../../../pages/withdrawal/_components/AccountDetailsForm"
import { WithdrawAmountForm } from "../../../../../pages/withdrawal/_components/WithdrawAmountForm"

interface WithdrawalTableToolbarProps<TTable> {
  table: Table<TTable>
  withdrawableBalance?: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedStatus?: string
  setSelectedStatus?: (role: string | undefined) => void
  callback?: () => void
  dictionary: any
}

export function WithdrawalTableToolbar<TTable>({
  table,
  withdrawableBalance,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  callback,
  dictionary
}: WithdrawalTableToolbarProps<TTable>) {
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | undefined>()
  const [hasAccountDetails, setHasAccountDetails] = useState(false)
  const [beneficiaryData, setBeneficiaryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dialogStep, setDialogStep] = useState<"ACCOUNT_DETAILS" | "WITHDRAW_AMOUNT">("ACCOUNT_DETAILS")

  const [inputValue, setInputValue] = useState(searchTerm)

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setInputValue(value)

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }

      debounceTimeout.current = setTimeout(() => {
        setSearchTerm(value)
      }, 1000)
    },
    [setSearchTerm]
  )

  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const value = Cookies.get("adminProfile") ?? ""
    if (value) {
      try {
        const adminData = JSON.parse(value)
        setUserRole(adminData.role)
      } catch (e) {
        console.error("Error parsing adminProfile cookie", e)
      }
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  const handlePlusClick = async () => {
    setLoading(true)
    const data = await getMyBeneficiary()
    setLoading(false)

    if (data) {
      setHasAccountDetails(true)
      setBeneficiaryData(data)
      setDialogStep("WITHDRAW_AMOUNT")
    } else {
      setHasAccountDetails(false)
      setBeneficiaryData(null)
      setDialogStep("ACCOUNT_DETAILS")
    }
    setOpen(true)
  }

  const handleAccountDetailsSuccess = (data: any) => {
    setHasAccountDetails(true)
    setBeneficiaryData(data)
    setDialogStep("WITHDRAW_AMOUNT")
  }

  const handleWithdrawSuccess = () => {
    setOpen(false)
    if (callback) callback()
  }

  return (
    <>
      <div className="flex items-center gap-x-4">
        {/* Plus Button - Visible only to OWNER and SUPERADMIN */}
        {(userRole === ROLES.OWNER || userRole === ROLES.SUPERADMIN) && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            disabled={loading}
            aria-label={dictionary.withdrawal?.request?.title || "Withdraw"}
            onClick={handlePlusClick}
          >
            <DiamondPlus className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </Button>
        )}

        {/* <Input
          placeholder={dictionary.search.search}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          value={inputValue}
          onChange={handleChange}
          aria-label="Search..."
          spellCheck={false}
          autoComplete="off"
        /> */}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {dialogStep === "ACCOUNT_DETAILS" ? (
            <AccountDetailsForm
              dictionary={dictionary}
              initialData={beneficiaryData}
              onSuccess={handleAccountDetailsSuccess}
            />
          ) : (
            <WithdrawAmountForm
              dictionary={dictionary}
              availableBalance={withdrawableBalance ?? 0}
              currency="SAR"
              userRole={userRole}
              onSuccess={handleWithdrawSuccess}
              onEditDetails={() => setDialogStep("ACCOUNT_DETAILS")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

