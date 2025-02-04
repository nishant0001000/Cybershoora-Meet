"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import MeetingAction from "./components/MeetingAction";
import MeetingFeature from "./components/MeetingFeature";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Show loader for 1 sec on page load
    const startupLoader = setTimeout(() => {
      setIsLoading(false);
      if (session?.user?.name) {
        showToasts(`✅ Welcome, ${session.user.name}! to the Meeting App!`);
      } else {
        showToasts("✅ Welcome to the Meeting App!");
      }
    }, 2000);

    return () => clearTimeout(startupLoader); // Cleanup
  }, [session]); // `session` ko dependency me rakho, taki update hone pe trigger ho

  useEffect(() => {
    console.log("Session status updated:", status); // Debugging log
    console.log("Session Data:", session); // Check if session is available

    if (status === "authenticated" && session?.user?.name) {
      setIsLoading(true); // Start loader again after login

      const loginLoader = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      // ✅ Ensure toast only shows once per session
      const hasShownWelcome = sessionStorage.getItem("hasShownWelcome");
      if (!hasShownWelcome) {
        console.log("Showing welcome toast for:", session.user.name); // Debugging log
        showToasts(`🎉 Welcome back, ${session.user.name}!`);
        sessionStorage.setItem("hasShownWelcome", "true");
      }

      return () => clearTimeout(loginLoader); // Cleanup
    }

    // ✅ Fix: Remove welcome message when user logs out
    if (status === "unauthenticated") {
      sessionStorage.removeItem("hasShownWelcome");
    }
  }, [status, session]); // Make sure `session` is in dependency array

  // ✅ Function for black-themed animated toasts with INLINE styles
  const showToasts = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      transition: Slide,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        backgroundColor: "#000", // Pure black background
        color: "#fff", // White text
        fontWeight: "bold",
        borderRadius: "10px",
        padding: "12px",
        textAlign: "center",
        fontSize: "16px",
      },
    });
  };

  // If loading, show the loader with a blurry background
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-gray-10 bg-opacity-10 z-50">
        <HashLoader color="indigo" size={80} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Header />
      <main className="flex-grow p-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Video calls and meetings for everyone
              </h1>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">
                Connect, collaborate, and celebrate from anywhere with Google Meet
              </p>
              <MeetingAction />
            </div>
            <div className="md:w-1/2">
              <MeetingFeature />
            </div>
          </div>
        </div>
      </main>

      {/* ✅ ToastContainer for black animated toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        theme="dark"
        limit={3}
      />
    </div>
  );
}
