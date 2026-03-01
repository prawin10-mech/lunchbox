"use client";

import Splash from "@/components/Splash";
import HubSelector from "@/components/HubSelector";
import HomeMenu from "@/components/HomeMenu";
import Checkout from "@/components/Checkout";
import Success from "@/components/Success";
import MissedCutoff from "@/components/MissedCutoff";
import { useState, useEffect } from "react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [selectedHub, setSelectedHub] = useState("");
  const [cartCount, setCartCount] = useState(1);
  const [upsells, setUpsells] = useState<string[]>([]);
  const [isPastCutoff, setIsPastCutoff] = useState(false);
  const [hubsData, setHubsData] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    // Determine if we are past 10:00 AM (local time simulate)
    const hour = new Date().getHours();
    if (hour >= 10 && hour < 14) { // Only enforce cutoff between 10 AM and 2 PM
      // setIsPastCutoff(true); // Uncomment to test missed cutoff locally
    }

    // Fetch Tanuku Hubs
    fetch('/api/hubs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHubsData(data.data);
        }
      })
      .catch(console.error);

    // Splash screen timer
    const timer = setTimeout(() => {
      setCurrentScreen("hub");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectHub = (hub: string) => {
    setSelectedHub(hub);
    setCurrentScreen(isPastCutoff ? "missed" : "home");
  };

  const handleProceedToCheckout = (quantity: number) => {
    setCartCount(quantity);
    setCurrentScreen("checkout");
  };

  const [createdOrderId, setCreatedOrderId] = useState("");

  const handleCompleteOrder = async (userDetails: { userPhone: string, userAddress: string }) => {
    setIsOrdering(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhone: userDetails.userPhone,
          userAddress: userDetails.userAddress,
          hubName: selectedHub,
          quantity: cartCount,
          upsells: upsells
        })
      });

      const data = await response.json();
      if (data.success) {
        setCreatedOrderId(data.data._id);
        setCurrentScreen("success");
      } else {
        alert("Failed to create order: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex justify-center w-full">
      <div className="w-full max-w-md bg-neutral-900 min-h-screen relative overflow-hidden shadow-2xl">
        {currentScreen === "splash" && <Splash />}
        {currentScreen === "hub" && <HubSelector onSelect={handleSelectHub} hubs={hubsData} />}
        {currentScreen === "home" && <HomeMenu onCheckout={handleProceedToCheckout} hubName={selectedHub} />}
        {currentScreen === "checkout" && (
          <div className="relative h-full">
            {isOrdering && (
              <div className="absolute inset-0 bg-neutral-950/80 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            )}
            <Checkout
              quantity={cartCount}
              upsells={upsells}
              setUpsells={setUpsells}
              onBack={() => setCurrentScreen("home")}
              onPay={handleCompleteOrder}
            />
          </div>
        )}
        {currentScreen === "success" && <Success onReset={() => setCurrentScreen("home")} orderDetails={{ _id: createdOrderId, quantity: cartCount, hub: selectedHub }} />}
        {currentScreen === "missed" && <MissedCutoff onPreOrder={() => setCurrentScreen("home")} />}
      </div>
    </main>
  );
}
