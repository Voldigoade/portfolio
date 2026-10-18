"use server";

import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/contact-schema";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// A bounded process-local baseline, not distributed/durable rate limiting.
const attempts = new Map<string, number>();
const COOLDOWN_MS = 60_000;
const FAILURE = {
  success: false,
  message: "Could not send your message right now. Please try again later.",
};

export async function submitContactAction(
  input: unknown,
): Promise<{ success: boolean; message: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Please check the required fields and their lengths.",
    };
  const values = parsed.data;
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return {
      success: false,
      message:
        "The contact form is currently unavailable. Please reach out on GitHub: https://github.com/Voldigoade",
    };
  }

  const now = Date.now();
  for (const [key, expires] of attempts)
    if (expires <= now) attempts.delete(key);
  const emailKey = createHash("sha256").update(values.email).digest("hex");
  if (attempts.has(emailKey) || attempts.size >= 1000) {
    return {
      success: false,
      message: "Please wait a minute before trying again.",
    };
  }
  attempts.set(emailKey, now + COOLDOWN_MS);

  const payload = {
    access_key: accessKey,
    name: values.name,
    email: values.email,
    country: values.country,
    phone: values.phone || "",
    business_inquiry: values.businessInquiry,
    project_details: values.projectDetails,
    expected_start_date: values.expectedStartDate || "",
    expected_end_date: values.expectedEndDate || "",
    subject: `Technical Inquiry from ${values.name} via voldigoade.xyz`,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return FAILURE;
    const result: unknown = await response.json();
    if (
      typeof result !== "object" ||
      result === null ||
      !("success" in result) ||
      result.success !== true
    )
      return FAILURE;
    return { success: true, message: "Message sent." };
  } catch {
    return FAILURE;
  } finally {
    clearTimeout(timer);
  }
}
