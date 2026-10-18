import { z } from "zod";

const shortText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max)
    .refine(
      (value) =>
        !Array.from(value).some(
          (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
        ),
      `${label} contains invalid characters.`,
    );

const optionalDate = z
  .string()
  .trim()
  .max(10)
  .optional()
  .refine((value) => {
    if (!value) return true;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid date.");

export const contactSchema = z
  .object({
    name: shortText("Name", 2, 100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .pipe(z.email("Enter a valid email.")),
    country: shortText("Country", 2, 100),
    phone: z
      .string()
      .trim()
      .max(20)
      .optional()
      .refine(
        (value) => !value || /^\+?[0-9()\-\s]{7,20}$/.test(value),
        "Phone number format looks invalid.",
      ),
    businessInquiry: shortText("Topic", 4, 200),
    projectDetails: z
      .string()
      .trim()
      .min(20, "Message must be at least 20 characters.")
      .max(5000)
      .refine(
        (value) =>
          !Array.from(value).some((char) =>
            [0, 11, 12, 127].includes(char.charCodeAt(0)),
          ),
        "Message contains invalid characters.",
      ),
    expectedStartDate: optionalDate,
    expectedEndDate: optionalDate,
    website: z.string().max(0).optional(),
  })
  .superRefine((values, ctx) => {
    if (
      values.expectedStartDate &&
      values.expectedEndDate &&
      values.expectedEndDate < values.expectedStartDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["expectedEndDate"],
        message: "Expected end date must be after start date.",
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
