"use server";

import type { Web3FormsSubmissionValues } from "@/lib/portfolio-types";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export async function submitContactAction(values: Web3FormsSubmissionValues) {
  const accessKey =
    process.env.WEB3FORMS_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "The contact form is currently in read-only mode (WEB3FORMS_ACCESS_KEY not configured). Please reach out directly on GitHub: https://github.com/Voldigoade",
    );
  }

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

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to submit contact form.");
  }

  return result;
}
