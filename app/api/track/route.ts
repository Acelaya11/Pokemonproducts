import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

const TRACKING_FILE = path.join(process.cwd(), 'data', 'tracking.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(TRACKING_FILE))) {
  fs.mkdirSync(path.dirname(TRACKING_FILE), { recursive: true });
}

// Initialize tracking file if it doesn't exist
if (!fs.existsSync(TRACKING_FILE)) {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify([]));
}

// Function to generate a short user ID
function generateShortUserId(): string {
  return `u${Math.random().toString(36).substring(2, 6)}`;
}

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const referer = headersList.get('referer');
    const userAgent = headersList.get('user-agent');
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Get all query parameters
    const url = new URL(request.url);
    const trackingData = Object.fromEntries(url.searchParams);

    // If no user ID is provided, generate a short one
    if (!trackingData.userId) {
      trackingData.userId = generateShortUserId();
    }

    // Prepare the complete tracking record
    const record = {
      ...trackingData,
      referer,
      userAgent,
      ip,
      timestamp: new Date().toISOString()
    };

    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    
    // Add new record
    existingData.push(record);
    
    // Write back to file
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(existingData, null, 2));

    // Return a 1x1 transparent GIF
    return new NextResponse(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error processing tracking pixel:', error);
    return new NextResponse(null, { status: 500 });
  }
} 