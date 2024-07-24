// app/api/send-sms/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = 'ACd30e3f889d4e27c588f5b26358e1a434';
const authToken = 'b72d88fbcdb4f273785527a155893df1';
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
