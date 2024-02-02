export const Loading = () => {
  return (
    <div
      className="animate-spin inline-block w-xxlarge h-xxlarge border-[3px] border-current border-t-transparent text-blue-600 rounded-[99999px] dark:text-blue-500"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
