import nodemailer from 'nodemailer'


export const sendMail = async (req, res) => {
  const { firstname, lastname, email, phone, query, purpose } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"${firstname} ${lastname}" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      replyTo: email,
      subject: `${purpose}`,
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px;">📬 New Contact Form Submission</h2>
    
    <table style="width: 100%; font-size: 16px; color: #374151;">
      <tr>
        <td style="padding: 8px 0;"><strong style="display: inline-block; width: 100px; text-transform: capitalize;">Purpose:</strong></td>
        <td style="text-transform: capitalize;">${purpose}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong style="display: inline-block; width: 100px; text-transform: capitalize;">Name:</strong></td>
        <td style="text-transform: capitalize;>${firstname} ${lastname}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong style="display: inline-block; width: 100px;">Email:</strong></td>
        <td>${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong style="display: inline-block; width: 100px;">Phone:</strong></td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; vertical-align: top;"><strong style="display: inline-block; width: 100px;">Query:</strong></td>
        <td style="white-space: pre-line;">${query}</td>
      </tr>
    </table>
    
    <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">This message was sent from your contact form.</p>
  </div>
  `,
    };

    await transporter.sendMail(mailOptions)
      .then(info => {
        res.status(200).json({ message: 'Query sent successfully!' });
      })
      .catch(error => {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send query.' });
      });

  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send query.' });
  }
}