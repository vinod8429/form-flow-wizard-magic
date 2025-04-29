
export interface FormResponse {
  message: string;
  form: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
}

export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

export type FieldType =
  | "text" | "tel" | "email" | "textarea"
  | "date" | "dropdown" | "radio" | "checkbox";

export interface FormField {
  fieldId: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: { message: string };
  options?: { value: string; label: string; dataTestId?: string }[];
  maxLength?: number;
  minLength?: number;
}

export interface FormValues {
  [key: string]: string | string[] | boolean;
}

export interface FormErrors {
  [key: string]: string;
}
