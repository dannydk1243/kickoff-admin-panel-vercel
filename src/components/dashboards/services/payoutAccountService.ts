import { API } from "@/helpers"
import { toast } from "@/hooks/use-toast"

export async function getMyPayoutAccount() {
  try {
    const res = await API.post(
      `/payouts/my`,
      {}
    )

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to load payout accounts",
        description: "Unable to fetch payout accounts list",
      })
      return null
    }

    return res.data
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return null
  }
}

export async function createPayoutAccount(data: any) {
  try {
    const res = await API.post(`/payouts/create`, data)

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Failed to create account",
        description: "Unable to process payout account creation",
      })
      return false
    }

    toast({
      title: "Account created",
      description: "Payout account has been created successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function updatePayoutAccount(id: string, data: any) {
  try {
    const res = await API.post(`/payout-accounts/update`, { ...data, accountId: id })

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to update payout account",
      })
      return false
    }

    toast({
      title: "Account updated",
      description: "Payout account has been updated successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function deletePayoutAccount() {
  try {
    const res = await API.post(`/payouts/delete`, {})

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Unable to delete payout account",
      })
      return false
    }

    toast({
      title: "Account deleted",
      description: "Payout account has been deleted successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}

export async function updatePayoutAccountStatus(id: string, isActive: boolean) {
  try {
    const res = await API.post(`/payout-accounts/update-status`, { accountId: id, isActive })

    if (res?.status !== 200 && res?.status !== 201) {
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "Unable to update payout account status",
      })
      return false
    }

    toast({
      title: "Status updated",
      description: "Payout account status has been updated successfully",
    })

    return true
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        error?.response?.data?.details?.message ||
        error?.message ||
        "Something went wrong. Please try again.",
    })
    return false
  }
}
