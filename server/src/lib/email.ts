// server/src/lib/email.ts
// ─────────────────────────────────────────────────────────────────────────────
// Transactional email dispatch service.
// Uses native fetch to interact with the Resend API (no external NPM deps needed).
// Falls back to logging if no API key is set.
// ─────────────────────────────────────────────────────────────────────────────
import { config } from '../config.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const BRAND_EMAIL    = process.env.BRAND_EMAIL || 'orders@gtm-textile.com'; // Change to your verified Hostinger email later

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

// Low-level sender function
async function sendEmail({ to, subject, html }: EmailPayload) {
  const toStr = Array.isArray(to) ? to.join(', ') : to;

  if (!RESEND_API_KEY) {
    const link = html.match(/href="([^"]+)"/)?.[1] || 'None';
    console.log(`[EMAIL SIMULATOR] To: ${toStr} | Subject: ${subject} | Link: ${link}`);
    return;
  }

  const toList = Array.isArray(to) ? to : [to];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout protect

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      signal:  controller.signal,
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from: `GTM Operations <${BRAND_EMAIL}>`,
        to:   toList,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend API error:', err);
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Transactional email dispatch timed out after 5000ms');
    } else {
      console.error('Failed to dispatch transactional email:', error);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Send receipt when a user requests a quote ────────────────────────────────
export async function sendOrderReceiptEmail(order: any) {
  const itemsList = order.items
    .map((it: any) => `<li><strong>${it.name || 'Product'}</strong> (${it.colorName || 'Default'}) — Qty: ${it.qty}</li>`)
    .join('');

  const html = `
    <div style="font-family: 'Poppins', sans-serif; background-color: #100D0B; color: #EDE0D4; padding: 40px; max-width: 600px; margin: auto; border: 1px solid #C8783A;">
      <h2 style="color: #C8783A; border-bottom: 1px solid #2C2218; padding-bottom: 10px; font-weight: 300; letter-spacing: 2px;">
        GTM // QUOTATION INITIATED
      </h2>
      <p>Hello <strong>${order.client.name}</strong>,</p>
      <p>We have successfully registered your corporate production quotation request. Our production line managers are auditing your specifications.</p>
      
      <div style="background-color: #181310; padding: 20px; border: 1px solid #2C2218; margin: 20px 0;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Tracking Reference</p>
        <h3 style="margin: 5px 0; color: #C8783A; font-family: monospace;">${order.displayId}</h3>
        
        <p style="margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Company Account</p>
        <p style="margin: 0; font-size: 14px;">${order.client.companyName || '—'}</p>

        <p style="margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Timeline Spec</p>
        <p style="margin: 0; font-size: 14px;">${order.deliveryWindow || 'Flexible Delivery'}</p>
      </div>

      <h4 style="color: #C8783A; font-weight: 300;">Requested Manifest Items:</h4>
      <ul style="padding-left: 20px; line-height: 1.6;">
        ${itemsList}
      </ul>

      <p style="font-size: 12px; color: #5A4A40; margin-top: 30px; border-top: 1px solid #2C2218; padding-top: 20px;">
        This is an automated operational notification. Our team will contact you directly within 24 hours with custom pricing.
      </p>
    </div>
  `;

  await sendEmail({
    to:      order.client.email,
    subject: `GTM Quote Request Logged [${order.displayId}]`,
    html,
  });
}

// ── Send status update email (triggered from Admin dropdown change) ──────────
export async function sendOrderStatusUpdateEmail(order: any, newStatus: string) {
  const STATUS_DETAILS: Record<string, string> = {
    PENDING:    'Your quotation request is currently awaiting technical specification audit by our line managers.',
    PROCESSING: 'Your quote has been approved. Fabric procurement and raw material staging is now ACTIVE.',
    DISPATCHED: 'Your corporate manufacturing contract has been completed and items have been dispatched to shipping logs.',
    CANCELLED:  'Your quotation request has been cancelled by operations management. Please reach out if you believe this is an error.',
  };

  const statusColor = newStatus === 'DISPATCHED' ? '#C8783A' : newStatus === 'PROCESSING' ? '#D4924A' : newStatus === 'CANCELLED' ? '#C4503A' : '#7FA8C4';

  const html = `
    <div style="font-family: 'Poppins', sans-serif; background-color: #100D0B; color: #EDE0D4; padding: 40px; max-width: 600px; margin: auto; border: 1px solid ${statusColor};">
      <h2 style="color: ${statusColor}; border-bottom: 1px solid #2C2218; padding-bottom: 10px; font-weight: 300; letter-spacing: 2px;">
        GTM // ORDER STATUS ALERT
      </h2>
      <p>Hello <strong>${order.client.name}</strong>,</p>
      <p>The manufacturing status of order <strong>${order.displayId}</strong> has been updated by operations management.</p>
      
      <div style="background-color: #181310; padding: 25px; border: 1px solid #2C2218; margin: 20px 0; text-align: center;">
        <span style="font-size: 9px; text-transform: uppercase; color: #5A4A40; letter-spacing: 2px; display: block; margin-bottom: 5px;">Current Stage</span>
        <span style="font-size: 16px; font-weight: bold; color: ${statusColor}; border: 1px solid ${statusColor}40; padding: 4px 16px; display: inline-block; letter-spacing: 1px;">
          ${newStatus}
        </span>
        <p style="margin-top: 15px; font-size: 13px; line-height: 1.6; color: #EDE0D4; text-align: left;">
          ${STATUS_DETAILS[newStatus] || ''}
        </p>
      </div>

      <p style="font-size: 12px; color: #5A4A40; margin-top: 30px; border-top: 1px solid #2C2218; padding-top: 20px;">
        If you have any questions about this change, please contact your account representative directly.
      </p>
    </div>
  `;

  await sendEmail({
    to:      order.client.email,
    subject: `GTM Order Status Update — ${newStatus} [${order.displayId}]`,
    html,
  });
}

// ── Send alert to admins when a new quote request is submitted ─────────────
export async function sendAdminNotificationEmail(order: any) {
  const adminEmailVar = process.env.ADMIN_NOTIFICATION_EMAIL || '';
  if (!adminEmailVar.trim()) {
    console.warn('[ADMIN NOTIF SKIPPED] No ADMIN_NOTIFICATION_EMAIL configured.');
    return;
  }

  const adminEmails = adminEmailVar
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    console.warn('[ADMIN NOTIF SKIPPED] No valid admin emails resolved from variable.');
    return;
  }

  const itemsList = order.items
    .map((it: any) => `<li><strong>${it.name || 'Product'}</strong> (${it.colorName || 'Default'}) — Qty: ${it.qty}</li>`)
    .join('');

  const adminPanelUrl = `${config.FRONTEND_ORIGIN}/admin`;

  const html = `
    <div style="font-family: 'Poppins', sans-serif; background-color: #100D0B; color: #EDE0D4; padding: 40px; max-width: 600px; margin: auto; border: 1px solid #C8783A;">
      <h2 style="color: #C8783A; border-bottom: 1px solid #2C2218; padding-bottom: 10px; font-weight: 300; letter-spacing: 2px;">
        GTM // ADMIN ALERT
      </h2>
      <p>A new quotation request has been registered on the storefront.</p>
      
      <div style="background-color: #181310; padding: 20px; border: 1px solid #2C2218; margin: 20px 0;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Tracking Reference</p>
        <h3 style="margin: 5px 0; color: #C8783A; font-family: monospace;">${order.displayId}</h3>
        
        <p style="margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Buyer Dossier</p>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${order.client.name}</p>
        <p style="margin: 5px 0;"><strong>Company:</strong> ${order.client.companyName || '—'}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${order.client.email}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.client.phone || '—'}</p>

        <p style="margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; color: #5A4A40; letter-spacing: 1px;">Timeline Spec</p>
        <p style="margin: 0;">${order.deliveryWindow || 'Flexible Delivery'}</p>
      </div>

      <h4 style="color: #C8783A; font-weight: 300;">Requested Manifest Items:</h4>
      <ul style="padding-left: 20px; line-height: 1.6;">
        ${itemsList}
      </ul>

      <div style="margin-top: 30px; text-align: center;">
        <a href="${adminPanelUrl}" style="background-color: #C8783A; color: #100D0B; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; display: inline-block; border-radius: 2px;">
          [ OPEN ADMIN SHELL ]
        </a>
      </div>

      <p style="font-size: 12px; color: #5A4A40; margin-top: 30px; border-top: 1px solid #2C2218; padding-top: 20px; text-align: center;">
        GTM Command Dashboard Notification Hub
      </p>
    </div>
  `;

  await sendEmail({
    to:      adminEmails,
    subject: `[NEW RFQ INQUIRY] Action Required — ${order.displayId}`,
    html,
  });
}
