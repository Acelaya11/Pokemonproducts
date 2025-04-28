import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

const TRACKING_FILE = path.join(process.cwd(), 'data', 'tracking.json');

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

    try {
      // Try to read existing data
      const fileContent = await fs.readFile(TRACKING_FILE, 'utf-8');
      const existingData = JSON.parse(fileContent);
      existingData.push(record);
      await fs.writeFile(TRACKING_FILE, JSON.stringify(existingData, null, 2));
    } catch (error) {
      // If file doesn't exist or there's an error, create new file with single record
      try {
        await fs.mkdir(path.dirname(TRACKING_FILE), { recursive: true });
        await fs.writeFile(TRACKING_FILE, JSON.stringify([record], null, 2));
      } catch (writeError) {
        console.error('Error writing tracking data:', writeError);
        // Continue execution even if writing fails
      }
    }

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