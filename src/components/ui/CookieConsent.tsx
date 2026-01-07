import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Shield } from 'lucide-react';
import { setCookieConsent, getCookieConsent } from '@/lib/cookies';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setIsVisible(false);
  };

  const handleClose = () => {
    // Close without setting consent - banner will show again on next visit
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] p-2 sm:p-4 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-lg border-t border-pink-200 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
      <Card className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto border-0 bg-gradient-to-br from-white via-pink-50/80 to-violet-50/80 shadow-xl backdrop-blur-xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">


            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text--600" />
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-600 bg-clip-text text-transparent">
                  Your Privacy Matters
                </h3>
              </div>
              <p className="text-black text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                We use cookies to make your experience amazing, understand how you use our site, and help us improve. Your data stays safe with us! 🍪
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <Button
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:from-purple-600 hover:via-violet-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  Accept All Cookies
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="border-2 border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Decline Non-Essential
                </Button>
                
              </div>


            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
