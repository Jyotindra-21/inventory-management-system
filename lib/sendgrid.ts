import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, text: string) {
    const msg = {
        to: 'ayushtops37@gmail.com', // Change to your recipient
        from: 'ayushtops37@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    try {
        await sgMail.send(msg);
        console.log('Email sent');
        return { success: 'Email sent' };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to send email' };
    }
}