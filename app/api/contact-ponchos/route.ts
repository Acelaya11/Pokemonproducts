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
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
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

    // Send email notification
    const mailOptions = {
      from: process.env.PONCHOS_EMAIL_USER,
      to: process.env.PONCHOS_SELLER_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 