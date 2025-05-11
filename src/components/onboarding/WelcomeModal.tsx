import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, BookOpen, Share2 } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete === 'true') {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  const handleGetStarted = () => {
    if (dontShowAgain) {
      localStorage.setItem('onboardingComplete', 'true');
    }
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.target === checkboxRef.current) {
      e.preventDefault();
      buttonRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" onPointerDownOutside={() => onOpenChange(false)}>
        <div className="bg-purple-gradient p-6 text-white">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2 className="tracking-tight text-2xl font-bold mb-2">Welcome to Swag AI!</h2>
            <p className="text-sm text-white/90 mb-4">
              Digitize your wardrobe, get AI-powered outfit suggestions, and save your favorite looks.
            </p>
          </div>
          <ol className="space-y-4 mb-6">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-7 w-7 text-green-200 bg-white/10 rounded-full p-1" />
              <span className="text-base">Upload your clothing photos</span>
            </li>
            <li className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-yellow-200 bg-white/10 rounded-full p-1" />
              <span className="text-base">Get AI-powered outfit suggestions</span>
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-blue-200 bg-white/10 rounded-full p-1" />
              <span className="text-base">Save outfits to your lookbook</span>
            </li>
            <li className="flex items-center gap-3 opacity-70">
              <Share2 className="h-7 w-7 text-pink-200 bg-white/10 rounded-full p-1" />
              <span className="text-base">
                Share your style
                <span className="text-xs">(coming soon)</span>
              </span>
            </li>
          </ol>
          <p className="text-gray-600 mb-6">Let's get started by creating your style profile.</p>
          <div className="sm:flex-row sm:justify-end sm:space-x-2 flex flex-col items-start gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                onKeyDown={handleKeyDown}
                className="accent-purple-500 rounded"
              />
              Don't show this again
            </label>
            <Button
              ref={buttonRef}
              onClick={handleGetStarted}
              className="w-full bg-white text-purple-700 font-semibold hover:bg-purple-100 transition"
            >
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 