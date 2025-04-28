import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received contact request');

    const body = await request.json();
    const { message, email } = body;
    const timestamp = new Date().toISOString();

    // Log the received data
    console.log('Request data:', body);

    // Validate required fields
    if (!message || !email) {
      console.error('Missing required fields:', { message, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    let emailContent;
    let emailSubject;

    // Handle cart contact (multiple items)
    if (body.items && Array.isArray(body.items)) {
      const itemsList = body.items.map((item: { id: number; id_name: string; price: number }) => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          <p><strong>ID:</strong> ${item.id}</p>
          <p><strong>ID Name:</strong> ${item.id_name}</p>
          <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
        </div>
      `).join('');

      emailSubject = `New Cart Contact Request - ${body.items.length} Items`;
      emailContent = `
        <h2>New Cart Contact Request</h2>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <h3>Items (${body.items.length}):</h3>
        ${itemsList}
        <p><strong>Total Amount:</strong> $${body.totalAmount.toFixed(2)}</p>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      `;
    }
    // Handle single item contact
    else {
      emailSubject = `New Contact Request for Item #${body.id}`;
      emailContent = `
        <h2>New Contact Request</h2>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <div style="margin: 20px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          <p><strong>ID:</strong> ${body.id}</p>
          <p><strong>ID Name:</strong> ${body.id_name}</p>
          <p><strong>Price:</strong> $${body.price.toFixed(2)}</p>
        </div>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      `;
    }

    // Send email
    const mailOptions = {
      from: process.env.PONCHOS_EMAIL_USER,
      to: process.env.PONCHOS_SELLER_EMAIL,
      subject: emailSubject,
      html: emailContent,
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    return NextResponse.json(
      { message: 'Contact request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact request:', error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to send message',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 