import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading tracking data:', error);
    return NextResponse.json({ error: 'Failed to read tracking data' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Clear the tracking file
    fs.writeFileSync(TRACKING_FILE, JSON.stringify([]));
    return NextResponse.json({ message: 'Tracking data cleared successfully' });
  } catch (error) {
    console.error('Error clearing tracking data:', error);
    return NextResponse.json({ error: 'Failed to clear tracking data' }, { status: 500 });
  }
} 