'use client';
import { useEffect } from 'react';

interface TrackingPixelProps {
  eventName: string;
  userId?: string;
  additionalData?: Record<string, string>;
}

function getSourceDetails() {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  // Determine the source
  let source = 'direct';
  let sourceDetails = '';

  if (utmSource) {
    source = utmSource;
    sourceDetails = `Campaign: ${utmCampaign || 'N/A'}, Medium: ${utmMedium || 'N/A'}`;
  } else if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname;
      
      if (hostname.includes('facebook.com')) {
        source = 'facebook';
      } else if (hostname.includes('instagram.com')) {
        source = 'instagram';
      } else if (hostname.includes('twitter.com')) {
        source = 'twitter';
      } else if (hostname.includes('google.com')) {
        source = 'google';
      } else if (hostname.includes('youtube.com')) {
        source = 'youtube';
      } else if (hostname.includes('reddit.com')) {
        source = 'reddit';
      } else {
        source = 'other';
        sourceDetails = hostname;
      }
    } catch {
      source = 'unknown';
    }
  }

  return {
    source,
    sourceDetails,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign
  };
}

function getOrCreateUserId(): string {
  // Clear any old user ID format
  const oldUserId = localStorage.getItem('tracking_user_id');
  if (oldUserId && oldUserId.includes('user_')) {
    localStorage.removeItem('tracking_user_id');
  }
  
  // Check if we already have a user ID in localStorage
  const storedUserId = localStorage.getItem('tracking_user_id');
  
  if (storedUserId) {
    return storedUserId;
  }
  
  // Generate a new short user ID
  const newUserId = `u${Math.random().toString(36).substring(2, 6)}`;
  
  // Store the new user ID
  localStorage.setItem('tracking_user_id', newUserId);
  
  return newUserId;
}

export function TrackingPixel({ eventName, userId, additionalData }: TrackingPixelProps) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        // Get or create a persistent user ID
        const persistentUserId = getOrCreateUserId();
        
        // Get source details
        const sourceInfo = getSourceDetails();
        
        // Prepare the tracking data
        const trackingData = {
          event: eventName,
          userId: persistentUserId,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          ...sourceInfo,
          ...additionalData
        };

        // Create the pixel URL with the tracking data
        const pixelUrl = new URL('/api/track', window.location.origin);
        Object.entries(trackingData).forEach(([key, value]) => {
          if (value) {
            pixelUrl.searchParams.append(key, value.toString());
          }
        });

        // Create and load the tracking pixel
        const img = new Image();
        img.src = pixelUrl.toString();
        img.style.display = 'none';
        document.body.appendChild(img);
        
        // Clean up after the image loads
        img.onload = () => {
          document.body.removeChild(img);
        };
      } catch (error) {
        console.error('Error tracking event:', error);
      }
    };

    trackEvent();
  }, [eventName, userId, additionalData]);

  return null; // This component doesn't render anything visible
} 