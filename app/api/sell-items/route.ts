import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

// Create transporter with more robust configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.PONCHOS_EMAIL_USER,
    pass: process.env.PONCHOS_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error) {
  if (error) {
    console.error('SMTP Configuration Error:', error);
  } else {
    console.log('SMTP Server is ready to send messages');
  }
});

interface SellRequest {
  email: string;
  items: string;
  status: 'pending' | 'reviewed' | 'completed';
  id: string;
}

export async function POST(request: Request) {
  try {
    const { email, items } = await request.json();

    if (!email || !items) {
      return NextResponse.json(
        { error: 'Email and items are required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.PONCHOS_EMAIL_USER || !process.env.PONCHOS_EMAIL_PASSWORD || !process.env.PONCHOS_SELLER_EMAIL) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'sell-requests.json');

    // Create data directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing data or initialize empty array
    let requests: SellRequest[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      requests = JSON.parse(fileContent);
    } catch {
      // File doesn't exist or is empty, start with empty array
    }

    // Create new sell request
    const newRequest: SellRequest = {
      email,
      items,
      status: 'pending',
      id: `S-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Add new request to array
    requests.push(newRequest);

    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2));

    // Send email notification
    const mailOptions = {
      from: process.env.PONCHOS_EMAIL_USER,
      to: process.env.PONCHOS_SELLER_EMAIL,
      subject: `New Sell Request - ${newRequest.id}`,
      html: `
        <h2>New Sell Request Received</h2>
        <p><strong>Request ID:</strong> ${newRequest.id}</p>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Items:</strong></p>
        <p>${items}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      requestId: newRequest.id
    });

  } catch (error) {
    console.error('Error processing sell request:', error);
    return NextResponse.json(
      { error: 'Failed to process sell request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'sell-requests.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const sellRequests: SellRequest[] = JSON.parse(fileContent);

    return NextResponse.json(sellRequests);
  } catch (error) {
    console.error('Error reading sell requests:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sell requests' },
      { status: 500 }
    );
  }
} 