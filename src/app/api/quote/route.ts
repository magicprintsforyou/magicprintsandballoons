import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const EVENT_LABELS: Record<string, string> = {
  birthday: 'Birthday / Cumpleaños',
  wedding: 'Wedding / Boda',
  quinceanera: 'Quinceañera',
  'baby-shower': 'Baby Shower',
  graduation: 'Graduation / Graduación',
  corporate: 'Corporate / Corporativo',
  other: 'Other / Otro',
};

const BUDGET_LABELS: Record<string, string> = {
  'under-500': 'Under $500',
  '500-1000': '$500 – $1,000',
  '1000-2500': '$1,000 – $2,500',
  '2500-plus': 'Over $2,500',
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_dummy_key') {
      console.error('QUOTE API: RESEND_API_KEY missing');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { id, name, email, phone, eventDate, eventType, budget, description, photoCount, photoNames } = body;

    if (!name || !email || !phone || !eventDate || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const eventLabel = EVENT_LABELS[eventType] ?? eventType;
    const budgetLabel = budget ? (BUDGET_LABELS[budget] ?? budget) : 'Not specified';

    const result = await resend.emails.send({
      from: 'Magic Prints <noreply@magicprintsforyou.com>',
      to: 'info@magicprintsforyou.com',
      subject: `New Decoration Quote Request ${id || ''} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #d90082;">New Decoration Quote Request ${id || ''}</h2>
          <p style="color: #666;">From magicprintsandballoons.vercel.app/quote</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
          <p><strong>Event:</strong> ${eventLabel} on ${eventDate}</p>
          <p><strong>Budget:</strong> ${budgetLabel}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Details:</strong></p>
          <p style="background: #fdf2f8; padding: 15px; border-radius: 10px; white-space: pre-wrap;">${description}</p>
          <p><strong>Inspiration photos:</strong> ${photoCount || 0}${photoNames && photoNames.length ? ` (${photoNames.join(', ')})` : ''}</p>
          <p style="color: #888; font-size: 13px;">Note: the customer sends inspiration photos via WhatsApp after submitting.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('QUOTE API: Resend error', result.error);
      return NextResponse.json({ error: 'Failed to send quote email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: result.data?.id });
  } catch (error: any) {
    console.error('QUOTE API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
