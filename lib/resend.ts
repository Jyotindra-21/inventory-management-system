import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendMail = async (name: string, stock: number) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'Hello world',
            text: "Stock running low",
            react: EmailTemplate({ stockName: name, stock: stock }),
        });

        if (error) {
            return { error: error.message }
        }

        return true;
    } catch (error: any) {
        return { error: error.message }
    }
}