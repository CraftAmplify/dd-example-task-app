import { useRef, useCallback, useEffect, useState } from 'react'
import { SWIPE } from '@/constants'

interface UseSwipeToDeleteProps {
  taskId: string
  isSwipeOpen: boolean
  onSwipeOpen: (taskId: string) => void
  onSwipeClose: () => void
  onDelete: () => void
}

export function useSwipeToDelete({
  taskId,
  isSwipeOpen,
  onSwipeOpen,
  onSwipeClose,
  onDelete
}: UseSwipeToDeleteProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const currentXRef = useRef<number>(0)
  const isSwipingRef = useRef<boolean>(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  // Close the revealed action when the user clicks elsewhere.
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        if (isSwipeOpen) {
          onSwipeClose()
        }
        setSwipeOffset(0)
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [isSwipeOpen, onSwipeClose])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    startXRef.current = startX
    currentXRef.current = startX
    isSwipingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentXRef.current = e.touches[0].clientX
    const diffX = startXRef.current - currentXRef.current

    if (diffX > 0) {
      isSwipingRef.current = true
      setSwipeOffset(Math.min(diffX, SWIPE.MAX_DISTANCE))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diffX = startXRef.current - currentXRef.current

    if (diffX > SWIPE.THRESHOLD) {
      setSwipeOffset(0)
      onSwipeOpen(taskId)
    } else {
      setSwipeOffset(0)
      if (isSwipeOpen) {
        onSwipeClose()
      }
    }

    isSwipingRef.current = false
  }, [taskId, isSwipeOpen, onSwipeOpen, onSwipeClose])

  const handleTaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isSwipeOpen) {
        onSwipeClose()
      }
      setSwipeOffset(0)
    },
    [isSwipeOpen, onSwipeClose]
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete()
    },
    [onDelete]
  )

  return {
    elementRef,
    swipeOffset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTaskClick,
    handleDeleteClick
  }
}
