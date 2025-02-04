"use client"
import { SessionProvider } from "next-auth/react"; 
import { ThemeProvider } from "next-themes";
import { ToastContainer } from 'react-toastify';

export function Providers({ children, session }) { // ✅ Fixed Typo
    return (
        <SessionProvider session={session}>
            <ToastContainer position="top-right" autoClose={3000} />
            <ThemeProvider attribute="class">
                {children} 
            </ThemeProvider>
        </SessionProvider>
    );
}