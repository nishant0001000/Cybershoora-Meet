"use client";
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const VideoMeeting = () => {
  const params = useParams();
  const roomID = params.roomId;
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const zpRef = useRef(null); // UseRef for Zego instance
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); // Prevent duplicate joins

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name && !hasJoined) {
      setHasJoined(true); // Mark as joined to prevent duplicate calls
      setTimeout(() => {
        if (containerRef.current) {
          joinMeeting(containerRef.current);
        }
      }, 500);
    }
  }, [status, session, hasJoined]);

  useEffect(() => {
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
    };
  }, []);

  const joinMeeting = async (element) => {
    if (zpRef.current) return; // Prevent duplicate joins

    const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    
    if (!appID || !serverSecret) {
      console.error('Zego credentials are missing! Check .env file.');
      return;
    }
    
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      session?.user?.id || Date.now().toString(),
      session?.user?.name || 'Guest'
    );

    const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
    if (!zegoInstance) {
      console.error('Failed to create Zego instance!');
      return;
    }
    zpRef.current = zegoInstance;

    zegoInstance.joinRoom({
      container: element,
      sharedLinks: [{
        name: 'Join via this link',
        url: `${window.location.origin}/video-meeting/${roomID}`,
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTurnOffRemoteCameraButton: true,
      showTurnOffRemoteMicrophoneButton: true,
      showRemoveUserButton: true,
      onJoinRoom: () => {
        toast.success('Meeting joined successfully');
        setIsInMeeting(true);
      },
      onLeaveRoom: () => {
        endMeeting();
      },
    });
  };

  const endMeeting = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }
    toast.success('Meeting ended successfully');
    setIsInMeeting(false);
    setHasJoined(false); // Reset join state when meeting ends
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className={`flex-grow flex flex-col md:flex-row relative ${isInMeeting ? 'h-screen' : ''}`}>
        <div ref={containerRef} className="video-container flex-grow" style={{ height: isInMeeting ? '100%' : 'calc(100vh - 4rem)' }}></div>
      </div>
      {!isInMeeting && (
        <div className="flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Meeting Info</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Participant - {session?.user?.name || 'You'}</p>
            <Button onClick={endMeeting} className="w-full bg-red-500 hover:bg-red-200 text-white hover:text-black">End Meeting</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-700">
            {[{ src: '/images/videoQuality.jpg', title: 'HD Video Quality', desc: 'Experience crystal clear video calls' },
              { src: '/images/screenShare.jpg', title: 'Screen Sharing', desc: 'Easily share your screen with participants' },
              { src: '/images/videoSecure.jpg', title: 'Secure Meetings', desc: 'Your meetings are protected and private' }].map((item, index) => (
              <div key={index} className="text-center">
                <Image src={item.src} alt={item.title} width={150} height={150} className="mx-auto mb-2 rounded-full" />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">{item.title}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;
