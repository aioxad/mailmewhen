import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Connect to databases and email provider
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    // 1. Get all active (unfulfilled) alerts from your database
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('is_fulfilled', false);

    if (error) throw error;
    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ status: 'No active alerts to check' });
    }

    // 2. Loop through each alert and check the live price on DexScreener
    for (const alert of alerts) {
      const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${alert.contract_address}`);
      const tokenData = await dexRes.json();
      
      // Grab the primary liquidity pool pair
      const pair = tokenData.pairs?.[0]; 

      // 3. Compare live Market Cap (FDV) against the user's target
      if (pair && pair.fdv >= alert.target_market_cap) {
        
        // 4. Target Hit! Send the email
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Default testing address for free Resend accounts
          to: alert.email,
          subject: `🚨 Target Hit: ${pair.baseToken.symbol}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background: #09090b; color: white; border-radius: 12px;">
              <h2 style="color: #a3a3a3;">Your Memecoin Alert Triggered! 🎯</h2>
              <p>Your tracked token <strong>${pair.baseToken.symbol}</strong> just crossed your target market cap.</p>
              <ul>
                <li><strong>Target Cap:</strong> $${alert.target_market_cap.toLocaleString()}</li>
                <li><strong>Current Cap:</strong> $${pair.fdv.toLocaleString()}</li>
                <li><strong>Contract:</strong> ${alert.contract_address}</li>
              </ul>
              <a href="${pair.url}" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                View Chart on DexScreener
              </a>
            </div>
          `
        });

        // 5. Update database so we don't spam the user again
        await supabase
          .from('alerts')
          .update({ is_fulfilled: true })
          .eq('id', alert.id);
      }
    }

    return NextResponse.json({ success: true, checked: alerts.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Script failed to run' }, { status: 500 });
  }
}