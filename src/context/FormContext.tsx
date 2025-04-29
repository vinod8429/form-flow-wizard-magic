
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormResponse, FormValues, FormErrors } from "../types/form";

interface FormContextType {
  formData: FormResponse | null;
  setFormData: (data: FormResponse) => void;
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  formErrors: FormErrors;
  setFormErrors: (errors: FormErrors) => void;
  currentSection: number;
  setCurrentSection: (section: number) => void;
  rollNumber: string;
  setRollNumber: (rollNumber: string) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [rollNumber, setRollNumber] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        formValues,
        setFormValues,
        formErrors,
        setFormErrors,
        currentSection,
        setCurrentSection,
        rollNumber,
        setRollNumber,
        userName,
        setUserName,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
