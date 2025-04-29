
import { useState } from "react";
import { FormField as FieldType, FormValues, FormErrors } from "../types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  field: FieldType;
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
  };

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            id={field.fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder}
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
          />
        );
      case "date":
        return (
          <Input
            id={field.fieldId}
            type="date"
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger data-testid={field.dataTestId}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={handleSelectChange}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldId}
              checked={value as boolean}
              onCheckedChange={handleCheckboxChange}
              data-testid={field.dataTestId}
            />
            <Label htmlFor={field.fieldId}>{field.label}</Label>
          </div>
        );
      default:
        return <p>Unsupported field type</p>;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.fieldId}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="error-text" data-testid={`${field.dataTestId}-error`}>{error}</p>}
    </div>
  );
};

export default FormField;
