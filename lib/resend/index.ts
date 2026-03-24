import { Resend } from "resend";

let resendInstance: Resend | null | undefined;

/**
 * Resend client. Requires RESEND_API_KEY.
 */
export function getResend(): Resend | null {
  if (resendInstance !== undefined) return resendInstance;
  if (!process.env.RESEND_API_KEY) {
    resendInstance = null;
    return null;
  }
  resendInstance = new Resend(process.env.RESEND_API_KEY);
  return resendInstance;
}
