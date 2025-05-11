import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TooltipWrapper, TooltipWrapperProps } from '@/components/ui/TooltipWrapper'
import * as React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A helper function to wrap an element with a tooltip
 */
export function withTooltip(
  child: React.ReactElement,
  tooltipProps: Omit<TooltipWrapperProps, 'children'>
) {
  return (
    <TooltipWrapper {...tooltipProps}>
      {child}
    </TooltipWrapper>
  )
} 