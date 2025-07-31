export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted-foreground border-opacity-25"></div>
        <div className="h-16 w-16 rounded-full border-4 border-t-primary animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}