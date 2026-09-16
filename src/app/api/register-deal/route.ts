import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Instantiate Resend lazily or with a dummy key to prevent Vercel build errors
// when RESEND_API_KEY is not defined in the environment.
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const supabaseUrl = process.env.SUPABASE_URL_CO || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY_CO || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json({ error: 'Missing form data' }, { status: 400 });
    }

    // 1. Log to Database
    const { error: dbError } = await supabase
      .from('deal_registrations')
      .insert([{ form_data: formData }]);
      
    if (dbError) {
      console.error('Database insertion error:', dbError);
      // We continue to try sending email even if DB log fails
    }

    // 2. Format Email Content
    let emailHtml = '<h2 style="color: #111827; font-family: sans-serif;">New Deal Registration</h2>';
    emailHtml += '<table border="1" cellpadding="12" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif; font-size: 14px; border-color: #E5E7EB;">';
    
    for (const [key, value] of Object.entries(formData)) {
      emailHtml += `<tr><td style="background-color: #F9FAFB; font-weight: 600; width: 40%; color: #374151;">${key}</td><td style="color: #111827;">${value}</td></tr>`;
    }
    emailHtml += '</table>';

    // 3. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'Flowtaris Deal Registry <onboarding@resend.dev>', // Using Resend's default sender for testing if domain isn't verified
        to: ['support@flowtaris.com'],
        subject: `New Deal Registration`,
        html: emailHtml,
      });

      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
      }
    } else {
      console.warn('RESEND_API_KEY is not set. Email was not sent.');
    }

    return NextResponse.json({ success: true, reference: `FL-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}` });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
