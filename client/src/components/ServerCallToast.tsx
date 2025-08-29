import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface ServerCallToastProps {
  show: boolean;
  onHide: () => void;
}

export default function ServerCallToast({ show, onHide }: ServerCallToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div 
      className={`fixed top-20 right-6 text-white px-6 py-4 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
        show ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ backgroundColor: 'hsl(var(--success))' }}
    >
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-5 w-5" />
        <div>
          <p className="font-medium">Server Called</p>
          <p className="text-sm opacity-90">Your server will be with you shortly</p>
        </div>
      </div>
    </div>
  );
}
