
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

    // Email validation - more comprehensive regex
    if (field.type === "email" && value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return "Please enter a valid email address";
    }

    // Phone number validation - must be 10-15 digits
    if (field.type === "tel" && value && !/^\d{10,15}$/.test(value)) {
      return "Please enter a valid phone number (10-15 digits)";
    }

    // Date validation - ensure it's a valid date and not in the future for birth dates
    if (field.type === "date" && value) {
      const inputDate = new Date(value);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(inputDate.getTime())) {
        return "Please enter a valid date";
      }
      
      // If it's likely a birth date field
      if (field.label.toLowerCase().includes("birth") || field.fieldId.toLowerCase().includes("birth") || 
          field.label.toLowerCase().includes("dob")) {
        if (inputDate > today) {
          return "Birth date cannot be in the future";
        }
        
        // Check if age is reasonable (e.g., at least 5 years old)
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        if (inputDate > fiveYearsAgo) {
          return "Please enter a valid birth date";
        }
      }
    }
    
    // Text content validation - prevent potential XSS or SQL injection patterns
    if ((field.type === "text" || field.type === "textarea") && value) {
      // Check for script tags or suspicious patterns
      if (/<script|javascript:|alert\(|SELECT\s+.*\s+FROM|DROP\s+TABLE/i.test(value)) {
        return "Invalid input detected";
      }
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
