import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </div>
  )
}