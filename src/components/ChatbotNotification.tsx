import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ChatbotNotification = () => {
  const [showNotification, setShowNotification] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowNotification(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-md animate-slide-up">
      <Alert className="bg-transparent border border-purple-500/50 backdrop-blur-sm text-white shadow-lg">
        <AlertCircle className="h-4 w-4 text-purple-400" />
        <AlertTitle className="text-purple-400">ChatBot Available!!!</AlertTitle>
        <AlertDescription className="text-zinc-300">
          Need help? Our AI assistant is here to answer your questions about GitViz.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ChatbotNotification;