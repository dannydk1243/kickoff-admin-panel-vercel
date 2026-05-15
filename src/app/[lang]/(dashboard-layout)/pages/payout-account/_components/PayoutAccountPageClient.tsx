"use client"

import { useEffect, useState } from "react"
import { getMyPayoutAccount, deletePayoutAccount } from "@/components/dashboards/services/payoutAccountService"
import { PayoutAccountForm } from "./PayoutAccountForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Landmark, CreditCard, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function PayoutAccountPageClient({ dictionary }: { dictionary: any }) {
  const [formOpen, setFormOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshSignal, setRefreshSignal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await getMyPayoutAccount()
      if (res) {
        setAccount(res)
      } else {
        setAccount(null)
      }
      setLoading(false)
    }

    fetchData()
  }, [refreshSignal])

  const handleDelete = async () => {
    const success = await deletePayoutAccount()
    if (success) {
      setAccount(null)
      setRefreshSignal((prev) => prev + 1)
    }
    setShowDeleteDialog(false)
  }

  const handleSuccess = () => {
    setRefreshSignal((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {account ? (
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Landmark className="h-6 w-6 text-primary" />
                {dictionary?.payoutAccount?.title || "Payout Account"}
              </CardTitle>
              <CardDescription>
                {dictionary?.payoutAccount?.description || "Your registered bank details for payouts."}
              </CardDescription>
            </div>
            <Button onClick={() => setShowDeleteDialog(true)} size="sm" variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              {dictionary?.rowControlLabels?.delete || "Delete"}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{dictionary?.payoutAccount?.type || "Type"}</p>
                <Badge variant="secondary" className="capitalize">
                  {account.type}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{dictionary?.payoutAccount?.bank || "Bank"}</p>
                <p className="font-medium text-lg">
                  {dictionary?.payoutAccount?.banks?.[account.bank] || account.bank}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {dictionary?.payoutAccount?.iban || "IBAN"}
                </p>
                <p className="font-mono text-sm tracking-wider">{account.iban}</p>
              </div>
              
              {account.corporate_id && (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {dictionary?.payoutAccount?.corporateId || "Corporate ID"}
                  </p>
                  <p className="font-mono text-sm">{account.corporate_id}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <span>{dictionary?.payoutAccount?.created || "Created"}:</span>
              <span>{new Date(account.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle>{dictionary?.payoutAccount?.noAccountFound || "No Payout Account"}</CardTitle>
            <CardDescription>
              {dictionary?.payoutAccount?.addAccountDescription || "You haven't added a payout account yet. Add one to receive payments."}
            </CardDescription>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {dictionary?.payoutAccount?.addAccount || "Add Account"}
          </Button>
        </Card>
      )}

      <PayoutAccountForm
        open={formOpen}
        onOpenChange={setFormOpen}
        account={null}
        onSuccess={handleSuccess}
        dictionary={dictionary}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary?.payoutAccount?.deleteConfirm || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary?.confirmationDialog?.deleteDescription || "This action cannot be undone. You will need to add a new account if you want to receive payouts."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dictionary?.rowControlLabels?.cancel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {dictionary?.rowControlLabels?.confirm || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
