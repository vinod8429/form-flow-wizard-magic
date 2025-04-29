
import { useEffect, useState } from "react";
import { FormSection as SectionType, FormValues, FormErrors } from "../types/form";
import { useForm } from "../context/FormContext";
import { validateSection } from "../utils/validation";
import FormField from "./FormField";

interface FormSectionProps {
  section: SectionType;
}

const FormSection: React.FC<FormSectionProps> = ({ section }) => {
  const { formValues, setFormValues, formErrors, setFormErrors } = useForm();
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    // Mark field as touched when changed
    setTouchedFields(prev => new Set(prev).add(fieldId));
    
    // Update form values
    setFormValues({ ...formValues, [fieldId]: value });
    
    // Validate the single field that changed
    const field = section.fields.find(f => f.fieldId === fieldId);
    if (field) {
      const validationErrors = validateSection([field], { [fieldId]: value });
      
      // Update only this field's error in the global error state
      if (validationErrors[fieldId]) {
        setFormErrors({ ...formErrors, [fieldId]: validationErrors[fieldId] });
      } else if (formErrors[fieldId]) {
        // Clear the error if it's now valid
        const newErrors = { ...formErrors };
        delete newErrors[fieldId];
        setFormErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    // Initialize form values with empty strings if not already set
    const initialValues: FormValues = { ...formValues };
    section.fields.forEach((field) => {
      if (initialValues[field.fieldId] === undefined) {
        if (field.type === "checkbox") {
          initialValues[field.fieldId] = false;
        } else {
          initialValues[field.fieldId] = "";
        }
      }
    });
    setFormValues(initialValues);
  }, [section]);

  return (
    <div className="wizard-section" data-testid={`section-${section.sectionId}`}>
      <h3 className="wizard-section-title">{section.title}</h3>
      <p className="wizard-section-description">{section.description}</p>
      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={formValues[field.fieldId] || (field.type === "checkbox" ? false : "")}
            onChange={(value) => handleFieldChange(field.fieldId, value)}
            error={touchedFields.has(field.fieldId) ? formErrors[field.fieldId] : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default FormSection;
