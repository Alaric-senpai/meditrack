import { Resend } from 'resend';
import { appConfig } from '@/config/app.config';

export const resend = new Resend(appConfig.resendKey);
