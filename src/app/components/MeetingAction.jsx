"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Copy, Link2, LinkIcon, Plus, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";
import "react-toastify/dist/ReactToastify.css";

const MeetingAction = () => {
  const [isLoading, setIsLoading] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const router = useRouter();
  const [generatedMeetingUrl, setGeneratedMeetingUrl] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

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

  const handleCreateMeetingForLater = () => {
    const roomId = uuidv4();
    const url = `${baseUrl}/video-meeting/${roomId}`;
    setGeneratedMeetingUrl(url);
    setIsDialogOpen(true);
    showToasts("📌 Meeting link created successfully!");
  };

  const handleJoinMeeting = () => {
    if (meetingLink) {
      setIsLoading(true);
      const formattedLink = meetingLink.includes("http")
        ? meetingLink
        : `${baseUrl}/video-meeting/${meetingLink}`;
      router.push(formattedLink);
      showToasts("🔗 Joining meeting...");
    } else {
      showToasts("❌ Please enter a valid link or code!");
    }
  };

  const handleStartMeeting = () => {
    setIsLoading(true);
    const roomId = uuidv4();
    const meetingUrl = `${baseUrl}/video-meeting/${roomId}`;
    router.push(meetingUrl);
    showToasts("🎥 Starting meeting...");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMeetingUrl);
    showToasts("📋 Meeting link copied to clipboard!");
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto" size="lg">
              <Video className="w-5 h-5 mr-2" />
              New meeting
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleCreateMeetingForLater}>
              <Link2 className="w-4 h-4 mr-2" />
              Create a meeting for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting}>
              <Plus className="w-4 h-4 mr-2" />
              Start an instant meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex w-full sm:w-auto relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </span>
          <Input
            placeholder="Enter a code or link"
            className="pl-8 rounded-r-none pr-10"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
          <Button variant="secondary" className="rounded-l-none" onClick={handleJoinMeeting}>
            Join
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-normal">
              Here's your joining information
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 ">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Send this to people that you want to meet with. Make sure that you save it so that you can use it later, too.
            </p>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg ">
              <span className="text-gray-700 dark:text-gray-200 break-all">
                {generatedMeetingUrl.slice(0, 30)}...
              </span>
              <Button variant="ghost" className="hover:bg-gray-200" onClick={copyToClipboard}>
                <Copy className="w-5 h-5 text-orange-500" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default MeetingAction;
