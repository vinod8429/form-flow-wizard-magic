
import { FormField, FormValues, FormErrors } from "../types/form";

export function validateField(field: FormField, value: string | string[] | boolean): string {
  // Required field validation
  if (field.required && (!value || (Array.isArray(value) && value.length === 0) || value === "")) {
    return field.validation?.message || "This field is required";
  }

  if (typeof value === "string") {
    // Name field validation - no numbers allowed
    if ((field.label.toLowerCase().includes("name") || field.fieldId.toLowerCase().includes("name")) && 
        value && /\d/.test(value)) {
      return "Name should not contain numbers";
    }

    // Min and max length validations
    if (field.minLength && value.length < field.minLength) {
      return `Minimum ${field.minLength} characters required`;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return `Maximum ${field.maxLength} characters allowed`;
    }

    // Email validation
    if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Please enter a valid email address";
    }

    // Phone number validation - must be 10-15 digits
    if (field.type === "tel" && value && !/^\d{10,15}$/.test(value)) {
      return "Please enter a valid phone number (10-15 digits)";
    }
  }

  return "";
}

export function validateSection(fields: FormField[], values: FormValues): FormErrors {
  const errors: FormErrors = {};

  fields.forEach((field) => {
    const value = values[field.fieldId] || "";
    const error = validateField(field, value);
    if (error) {
      errors[field.fieldId] = error;
    }
  });

  return errors;
}

export function isSectionValid(fields: FormField[], values: FormValues): boolean {
  const errors = validateSection(fields, values);
  return Object.keys(errors).length === 0;
}
