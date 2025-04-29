
import { useState } from "react";
import { FormField as FieldType, FormValues, FormErrors } from "../types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FormFieldProps {
  field: FieldType;
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsTouched(true);
    onChange(event.target.value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsTouched(true);
    onChange(checked);
  };

  const handleSelectChange = (value: string) => {
    setIsTouched(true);
    onChange(value);
  };

  const handleBlur = () => {
    setIsTouched(true);
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
            onBlur={handleBlur}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            className={error ? "border-destructive" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.fieldId}-error` : undefined}
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder}
            value={value as string}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            className={error ? "border-destructive" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.fieldId}-error` : undefined}
          />
        );
      case "date":
        return (
          <Input
            id={field.fieldId}
            type="date"
            value={value as string}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid={field.dataTestId}
            className={error ? "border-destructive" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.fieldId}-error` : undefined}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
            onOpenChange={() => setIsTouched(true)}
          >
            <SelectTrigger 
              data-testid={field.dataTestId} 
              className={error ? "border-destructive" : ""}
            >
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
                  onBlur={handleBlur}
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
              onBlur={handleBlur}
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
        <Label htmlFor={field.fieldId} className={error ? "text-destructive" : ""}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && isTouched && (
        <Alert variant="destructive" className="py-2 px-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription 
            className="text-sm ml-2 error-text" 
            id={`${field.fieldId}-error`}
            data-testid={`${field.dataTestId}-error`}
          >
            {error}
          </AlertDescription>
        </Alert>
      )}
      {field.maxLength && field.type !== "checkbox" && field.type !== "radio" && field.type !== "dropdown" && (
        <div className="text-xs text-muted-foreground text-right">
          {value ? (value as string).length : 0}/{field.maxLength}
        </div>
      )}
    </div>
  );
};

export default FormField;
