// app/api/send-sms/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request) {
  const { to, body } = await request.json();

  try {
    const message = await client.messages.create({
      body,
      from: '+18559272961',
      to,
    });
    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
