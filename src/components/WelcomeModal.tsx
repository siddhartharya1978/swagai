'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface WelcomeModalProps {
  show: boolean
  onClose: () => void
}

export function WelcomeModal({ show, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Swag AI! 👋</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Let&apos;s get started by creating your style profile.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Quick Start Guide:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Upload your clothes to build your digital wardrobe</li>
              <li>Get AI-powered outfit suggestions for any occasion</li>
              <li>Save your favorite looks in your lookbook</li>
              <li>Get personalized style recommendations</li>
            </ol>
          </div>
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 