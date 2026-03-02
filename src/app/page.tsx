"use client";

import Splash from "@/components/Splash";
import HubSelector from "@/components/HubSelector";
import HomeMenu from "@/components/HomeMenu";
import Checkout from "@/components/Checkout";
import Success from "@/components/Success";
import { useState, useEffect } from "react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [selectedHub, setSelectedHub] = useState("");
  const [cartCount, setCartCount] = useState(1);
  const [forTomorrow, setForTomorrow] = useState(false);
  const [hubsData, setHubsData] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {

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
    setCurrentScreen("home");
  };

  const handleProceedToCheckout = (quantity: number, isTomorrow: boolean = false) => {
    setCartCount(quantity);
    setForTomorrow(isTomorrow);
    setCurrentScreen("checkout");
  };

  const [createdOrderId, setCreatedOrderId] = useState("");

  const handleCompleteOrder = async (userDetails: { userPhone: string, userAddress: string, deliveryArea?: string, upsells?: string[], forTomorrow?: boolean }) => {
    setIsOrdering(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhone: userDetails.userPhone,
          userAddress: userDetails.userAddress,
          deliveryArea: userDetails.deliveryArea || selectedHub,
          hubName: selectedHub,
          quantity: cartCount,
          upsells: userDetails.upsells || [],
          forTomorrow: userDetails.forTomorrow ?? forTomorrow
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
              forTomorrow={forTomorrow}
              hubName={selectedHub}
              onBack={() => setCurrentScreen("home")}
              onPay={handleCompleteOrder}
            />
          </div>
        )}
        {currentScreen === "success" && <Success onReset={() => setCurrentScreen("home")} orderDetails={{ _id: createdOrderId, quantity: cartCount, hub: selectedHub }} />}
      </div>
    </main>
  );
}
