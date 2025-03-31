"use client";

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notify";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;


export default function Providers({children}:{children: React.ReactNode}) {
    const authenticator = async () => {
        try {
          const response = await fetch("/api/imagekit-auth");
      
          if (!response.ok) {
            throw new Error("Failed to Authenticate");
          }
          return response.json();
        } catch (error) {
          console.error("Imagekit Authentication error:", error);
          throw error;
        }
      };
  return (
    <SessionProvider refetchInterval={5*60}>
      <NotificationProvider>
      <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            {children}
      </ImageKitProvider>
      </NotificationProvider>
      </SessionProvider>
  );
}