import { useState } from 'react'

import progress from 'nprogress'

export default function useProgressBar() {
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    progress.start()
  }

  const handleDone = () => {
    setIsLoading(false)
    progress.done()
  }

  return {
    start: handleStart,
    done: handleDone,
    isLoading,
  }
}
