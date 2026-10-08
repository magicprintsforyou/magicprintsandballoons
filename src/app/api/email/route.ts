import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    // Diagnostic Check: Is the API Key missing or a dummy?
    if (!apiKey || apiKey === 're_dummy_key') {
      console.error('CRITICAL: RESEND_API_KEY is missing in environment variables.');
      return NextResponse.json({ 
        error: 'Servicio de email no configurado. Por favor añade RESEND_API_KEY en el panel de Vercel.',
        diagnostic: 'MISSING_API_KEY'
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await req.json();
    const { name, email, phone, company, eventDate, location, budget, promoCode, needs, notes, fileUrls, cart, cartTotal, deliveryMethod, shippingAddress, discountApplied, finalTotal } = body;

    let cartHtml = '';
    if (Array.isArray(cart) && cart.length > 0) {
      cartHtml = `
        <h3 style="color: #41137e; border-bottom: 2px solid #41137e; padding-bottom: 5px; margin-top: 25px;">Detalles de la Orden / Cart Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6; text-align: left; font-size: 12px; font-weight: bold;">
              <th style="padding: 10px; border: 1px solid #e5e7eb;">Producto</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb;">Configuración</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Cantidad</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map((item: any) => `
              <tr style="font-size: 13px;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">${item.product.name}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-size: 11px; color: #4b5563;">
                  Size: ${item.config?.variant?.size || 'Default'}<br>
                  Material: ${item.config?.material || 'N/A'}<br>
                  Rush: ${item.config?.isRushOrder ? 'Sí / Yes' : 'No'}${item.config?.artworkName ? `<br>Artwork: ${item.config.artworkName}` : ''}${item.config?.customText ? `<br>Custom text: "${item.config.customText}"` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: right; font-size: 14px; color: #374151; line-height: 1.6;">
          <p><strong>Subtotal:</strong> $${cartTotal?.toFixed(2)}</p>
          ${discountApplied > 0 ? `<p style="color: #10b981;"><strong>Descuento (5%):</strong> -$${discountApplied?.toFixed(2)}</p>` : ''}
          <p style="font-size: 18px; font-weight: bold; color: #cc004e; margin-top: 10px;">Total Estimado: $${(finalTotal || cartTotal)?.toFixed(2)}</p>
        </div>

        <div style="margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
          <p><strong>Método de Entrega / Fulfillment:</strong> ${deliveryMethod || 'Pickup / Custom'}</p>
          <p><strong>Dirección de Entrega / Address:</strong> ${shippingAddress || 'N/A'}</p>
        </div>
      `;
    }

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let adminEmailId = null;
    let clientEmailId = null;

    // 1. Send Email to Admin (Magic Prints Team) - MISSION CRITICAL
    try {
      const adminResponse = await resend.emails.send({
        from: 'Magic Prints <noreply@magicprintsforyou.com>',
        to: 'info@magicprintsforyou.com',
        subject: `✨ New Quote Request: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d90082;">New Magic Inquiry!</h2>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <hr />
            <p style="background: #fff4f9; padding: 10px; border-radius: 5px;"><strong>Event Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Presupuesto / Budget:</strong> ${budget || 'N/A'}</p>
            <p><strong>Código de Vendedor / Promo Code:</strong> ${promoCode || 'Ninguno / None'}</p>
            <p><strong>Needs:</strong> ${Array.isArray(needs) ? needs.join(', ') : needs}</p>
            <p><strong>Notes:</strong> ${notes || 'No extra notes'}</p>
            ${cartHtml}
            
            ${fileUrls && fileUrls.length > 0 ? `
              <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; border: 1px solid #ddd;">
                <p><strong>Attachments / Inspiration:</strong></p>
                <ul>
                  ${fileUrls.map((url: string, index: number) => `
                    <li><a href="${url}" target="_blank" style="color: #d90082; font-weight: bold;">View File ${index + 1}</a></li>
                  `).join('')}
                </ul>
              </div>
            ` : '<p><i>No files attached.</i></p>'}
          </div>
        `,
      });
      
      if (adminResponse.error) throw adminResponse.error;
      adminEmailId = adminResponse.data?.id;
    } catch (adminErr: any) {
      console.error('FAILED TO SEND ADMIN EMAIL:', adminErr);
      // We throw here because if the admin doesn't get the email, the lead is lost.
      return NextResponse.json({ 
        error: 'Error al notificar al equipo de Magic Prints.',
        details: adminErr.message 
      }, { status: 500 });
    }

    // 2. Send Confirmation Email to Client - BEST EFFORT
    // NOTE: This only works once domain is verified in Resend.
    // Until then it only sends if client email = account owner email.
    try {
      const clientResponse = await resend.emails.send({
        from: 'Magic Prints <noreply@magicprintsforyou.com>',
        to: email,
        subject: '\u2728 Magic Prints \u2014 Recibimos tu orden / We received your order',
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0212; color: white; border-radius: 20px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #cc004e, #41137e); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; color: white; text-transform: uppercase;">\u2728 MAGIC PRINTS</h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.7); font-size: 12px;">magicprintsforyou.net</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #ffcc00; font-size: 22px; margin-top: 0;">\u00a1Hola ${name}! / Hello ${name}!</h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7;">
                <strong style="color: white;">Recibimos tu orden exitosamente.</strong><br>
                We successfully received your order.
              </p>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.7;">
                Nuestro equipo verificar\u00e1 disponibilidad y te enviar\u00e1 un <strong style="color: #ffcc00;">link de pago seguro</strong> en menos de 24 horas por este correo o WhatsApp.<br><br>
                Our team will verify availability and send you a <strong style="color: #ffcc00;">secure payment link</strong> within 24 hours via email or WhatsApp.
              </p>
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #d90082; margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Resumen / Summary</h3>
                <p style="color: #94a3b8; margin: 4px 0; font-size: 13px;"><strong style="color: white;">Fecha del Evento / Event Date:</strong> ${eventDate || 'N/A'}</p>
                <p style="color: #94a3b8; margin: 4px 0; font-size: 13px;"><strong style="color: white;">Entrega / Fulfillment:</strong> ${deliveryMethod || 'Pickup'}</p>
                ${(finalTotal || cartTotal) ? '<p style="color: #ffcc00; margin: 10px 0 0; font-size: 15px; font-weight: bold;">Total Estimado: $' + ((finalTotal || cartTotal)).toFixed(2) + '</p>' : ''}
              </div>
              <div style="border-left: 4px solid #d90082; padding-left: 20px; margin: 20px 0;">
                <p style="color: white; font-weight: bold; margin: 0 0 8px; font-size: 14px;">\u00bfQu\u00e9 sigue? / What's next?</p>
                <ol style="color: #94a3b8; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 16px;">
                  <li>Verificamos disponibilidad / We verify availability</li>
                  <li>Te enviamos el link de pago / We send your payment link</li>
                  <li>Confirmamos producci\u00f3n y entrega / We confirm production & delivery</li>
                </ol>
              </div>
              <p style="color: #475569; font-size: 12px; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                Preguntas: sales@magicprintsforyou.com | WhatsApp disponible<br>
                1600 Industrial Ct, Arlington, TX 76011
              </p>
            </div>
          </div>
        `,
      });
      clientEmailId = clientResponse.data?.id;
      if (clientResponse.error) {
        console.warn('CLIENT EMAIL BLOCKED (Verify domain in Resend):', clientResponse.error);
      }
    } catch (clientErr) {
      console.error('Client confirmation failed but lead was saved:', clientErr);
    }

        // 3. Add to Audience (Marketing Automation)
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    return NextResponse.json({ success: true, adminEmailId, clientEmailId });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
