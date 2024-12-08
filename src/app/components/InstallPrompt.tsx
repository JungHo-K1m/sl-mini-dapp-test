// src/app/components/InstallPrompt.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui";
import "tailwindcss/tailwind.css";

const isIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIOSUser, setIsIOSUser] = useState<boolean>(isIOS());
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Development mode: simulate the beforeinstallprompt event
    if (import.meta.env.MODE === "development") {
      setTimeout(() => {
        const fakeEvent = new Event("beforeinstallprompt");
        window.dispatchEvent(fakeEvent);
      }, 2000); // Simulate after 2 seconds
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  const handleCloseClick = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && !isInstalled && !isIOSUser && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center z-50"
        >
          <p className="text-black">Install our app for a better experience!</p>
          <Button onClick={handleInstallClick} className="px-4 py-2 rounded">
            Install
          </Button>
        </motion.div>
      )}
      {isVisible && isIOSUser && !isInstalled && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center z-50"
        >
          <p className="text-black">
            To install this app, tap <strong>Share</strong> and then{" "}
            <strong>Add to Home Screen</strong>.
          </p>
          <Button onClick={handleCloseClick} className="px-4 py-2 rounded">
            Close
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
