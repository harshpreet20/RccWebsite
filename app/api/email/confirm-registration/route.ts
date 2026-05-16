import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, verifyWebhookSecret } from '@/lib/email';

interface RegistrationPayload {
  member_name?: string;
  member_email?: string;
  ticket_id?: string;
  event_title?: string;
  event_date?: string;
  venue?: string;
  entry_fee?: number;
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = (await req.json()) as RegistrationPayload;
  const { member_name, member_email, ticket_id, event_title, event_date, venue } = data;

  if (!member_email || !event_title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const firstName = member_name?.split(' ')[0] || 'there';
  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBD';

  const subject = `🎫 Your RCC Ticket is Confirmed — ${event_title}`;
  const body = `Hi ${firstName}! 🏸

Your registration is confirmed. Here are your event details:

━━━━━━━━━━━━━━━━━━━━━━━━━━
🏸  ${event_title.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📅  Date:      ${formattedDate}
📍  Venue:     ${venue || 'Venue TBA — check racquetsclubcommunity.com'}
🎫  Ticket ID: ${ticket_id || 'N/A'}
👤  Name:      ${member_name || 'N/A'}

Please show this email (or your Ticket ID) at the registration desk on the day.

What to bring:
• Badminton racquet(s)
• Court shoes (non-marking soles required)
• Water bottle
• Positive energy 💪

For queries, reach us at admin@racquetsclubcommunity.com

See you on court!
— The RCC Team`;

  const result = await sendEmail(member_email, subject, body);
  return NextResponse.json(result);
}
