import * as React from 'react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip'
import { ReactNode } from 'react'

interface TooltipWrapperProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  delayDuration?: number
}

export function TooltipWrapper({
  children,
  content,
  side = 'top',
  sideOffset = 8,
  delayDuration = 0,
}: TooltipWrapperProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        side={side} 
        sideOffset={sideOffset}
        className="z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md animate-fade-in"
        data-side={side}
        data-side-offset={sideOffset}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
} 