"use client"

import type { Aim } from "@/lib/types/database"
import { AimsList } from "@/components/aims/aims-list"
import { AddAimDialog } from "@/components/aims/add-aim-dialog"
import { useLanguage } from "@/lib/contexts/language-context"

interface AimsClientProps {
  aims: Aim[]
}

export function AimsClient({ aims }: AimsClientProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("aims.title")}</h2>
          <p className="text-muted-foreground">{t("aims.description")}</p>
        </div>
        <AddAimDialog />
      </div>

      <AimsList aims={aims} />
    </div>
  )
}