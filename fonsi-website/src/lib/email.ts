import nodemailer from 'nodemailer'
import { BUSINESS } from '@/lib/constants'

interface ConfirmationEmailData {
  email: string
  name: string
  serviceName: string
  date: string
  time: string
  appointmentId: string
  notes?: string
}

// Escape HTML entities to prevent injection in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendConfirmationEmail(data: ConfirmationEmailData) {
  const safeName = escapeHtml(data.name)
  const safeService = escapeHtml(data.serviceName)
  const safeNotes = data.notes ? escapeHtml(data.notes) : ''

  const notesSection = safeNotes
    ? `<p style="color: #333; margin: 10px 0;"><strong>Notes:</strong> ${safeNotes}</p>`
    : ''

  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Fonsi</h1>
        <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">by Cristal</p>
      </div>

      <div style="background: #f5f5f5; padding: 40px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0a0a0a; margin-top: 0;">Appointment Confirmed!</h2>
        <p style="color: #333;">Dear ${safeName},</p>
        <p style="color: #333;">Thank you for booking with ${BUSINESS.name}. Your appointment has been confirmed.</p>

        <div style="background: white; padding: 20px; border-left: 4px solid #333333; margin: 20px 0;">
          <h3 style="color: #333333; margin-top: 0;">Appointment Details</h3>
          <p style="color: #333; margin: 10px 0;"><strong>Service:</strong> ${safeService}</p>
          <p style="color: #333; margin: 10px 0;"><strong>Date:</strong> ${escapeHtml(data.date)}</p>
          <p style="color: #333; margin: 10px 0;"><strong>Time:</strong> ${escapeHtml(data.time)}</p>
          <p style="color: #333; margin: 10px 0;"><strong>Confirmation #:</strong> ${escapeHtml(data.appointmentId)}</p>
          ${notesSection}
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Cancellation Policy:</strong> ${BUSINESS.cancellation}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            <strong>Location:</strong><br/>
            ${BUSINESS.address.full}
          </p>
          <p style="color: #666; font-size: 14px;">
            <strong>Phone:</strong> ${BUSINESS.phone}
          </p>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          If you need to reschedule or cancel, please call us as soon as possible.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} ${BUSINESS.name}. All rights reserved.</p>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@fonsi-by-cristal.com',
      to: data.email,
      subject: `Appointment Confirmed - ${safeService}`,
      html: htmlContent,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
