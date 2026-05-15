"use client"

import { 
  CheckCircle2, 
  Clock, 
  Hash, 
  User, 
  Building2, 
  CreditCard, 
  History,
  AlertCircle,
  XCircle,
  Calendar,
  Phone,
  MapPin,
  Globe
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface WithdrawalDetailViewProps {
  onClose?: () => void
  data: any
  dictionary: any
}

export function WithdrawalDetailView({
  onClose,
  data,
  dictionary,
}: WithdrawalDetailViewProps) {
  if (!data) return null

  // Status mapping
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return { 
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", 
          icon: CheckCircle2, 
          label: dictionary.withdrawal?.details?.statusApproved || "Approved" 
        }
      case "COMPLETED":
        return { 
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", 
          icon: CheckCircle2, 
          label: dictionary.withdrawal?.details?.statusCompleted || "Completed" 
        }
      case "REJECTED":
        return { 
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", 
          icon: XCircle, 
          label: dictionary.withdrawal?.details?.statusRejected || "Rejected" 
        }
      case "CANCELLED":
        return { 
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", 
          icon: AlertCircle, 
          label: dictionary.withdrawal?.details?.statusCancelled || "Cancelled" 
        }
      default:
        return { 
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", 
          icon: Clock, 
          label: dictionary.withdrawal?.details?.statusPending || "Pending" 
        }
    }
  }

  const statusConfig = getStatusConfig(data.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-2 pb-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
              {data.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{data.user?.name}</h2>
            <p className="text-sm text-muted-foreground">{data.user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={`${statusConfig.color} px-3 py-1 text-xs font-semibold border-none`}>
            <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
            {statusConfig.label}
          </Badge>
          {data.userType && (
            <Badge variant="outline" className="text-xs">
              {data.userType}
            </Badge>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary">
              SAR {data.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Request Details */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                {dictionary.withdrawal?.details?.requestInfo || "Request Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {dictionary.withdrawal?.details?.requestId || "Request ID"}
                  </p>
                  <p className="text-sm font-mono truncate" title={data._id}>{data._id}</p>
                </div>
                <div className="space-y-1 text-right sm:text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {dictionary.withdrawal?.details?.purpose || "Purpose"}
                  </p>
                  <p className="text-sm font-medium capitalize">{data.purpose?.replace(/_/g, ' ') || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {dictionary.withdrawal?.details?.sequenceNumber || "Sequence Number"}
                  </p>
                  <p className="text-sm font-mono">{data.sequence_number || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {dictionary.withdrawal?.details?.requestedOn || "Requested On"}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{new Date(data.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                {dictionary.withdrawal?.details?.statusTimeline || "Status Timeline"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/10 before:to-transparent">
                <div className="relative flex items-center gap-4">
                  <div className="absolute left-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <div className="ml-8 space-y-0.5">
                    <p className="text-sm font-semibold">{dictionary.withdrawal?.details?.requestCreated || "Request Created"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(data.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {data.status !== 'PENDING' && (
                  <div className="relative flex items-center gap-4">
                    <div className={`absolute left-0 h-5 w-5 rounded-full ${statusConfig.color.split(' ')[0]} flex items-center justify-center shadow-sm`}>
                      <StatusIcon className="h-3 w-3" />
                    </div>
                    <div className="ml-8 space-y-0.5">
                      <p className="text-sm font-semibold">
                        {dictionary.withdrawal?.details?.requestStatus?.replace('{status}', statusConfig.label) || `Request ${statusConfig.label}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(data.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Beneficiary Details */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="bg-primary/5 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" />
                {dictionary.withdrawal?.details?.beneficiaryDetails || "Beneficiary Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {dictionary.withdrawal?.accountDetails?.name || "Beneficiary Name"}
                    </p>
                    <p className="text-sm font-semibold">{data.beneficiaryAccount?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {dictionary.withdrawal?.accountDetails?.iban || "IBAN Number"}
                    </p>
                    <p className="text-sm font-mono font-semibold tracking-wider">{data.beneficiaryAccount?.iban}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {dictionary.withdrawal?.accountDetails?.mobile || "Mobile"}
                    </p>
                    <p className="text-sm font-medium">{data.beneficiaryAccount?.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {dictionary.withdrawal?.accountDetails?.country || "Country"}
                      </p>
                      <p className="text-sm font-medium">{data.beneficiaryAccount?.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {dictionary.withdrawal?.accountDetails?.city || "City"}
                      </p>
                      <p className="text-sm font-medium">{data.beneficiaryAccount?.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-[11px] text-primary/80 leading-relaxed italic">
                  {dictionary.withdrawal?.details?.processNote || "Note: This request is being processed according to the beneficiary details provided at the time of withdrawal."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
