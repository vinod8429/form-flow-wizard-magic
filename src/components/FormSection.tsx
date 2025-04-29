
import { useEffect } from "react";
import { FormSection as SectionType, FormValues, FormErrors } from "../types/form";
import { useForm } from "../context/FormContext";
import { validateSection } from "../utils/validation";
import FormField from "./FormField";

interface FormSectionProps {
  section: SectionType;
}

const FormSection: React.FC<FormSectionProps> = ({ section }) => {
  const { formValues, setFormValues, formErrors, setFormErrors } = useForm();

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues({ ...formValues, [fieldId]: value });
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
            error={formErrors[field.fieldId]}
          />
        ))}
      </div>
    </div>
  );
};

export default FormSection;
