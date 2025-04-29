
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { getForm } from "../services/api";
import { validateSection, isSectionValid } from "../utils/validation";
import FormSection from "../components/FormSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const FormWizard = () => {
  const {
    formData,
    setFormData,
    formValues,
    formErrors,
    setFormErrors,
    currentSection,
    setCurrentSection,
    rollNumber,
    userName,
  } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateSection, setAnimateSection] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!rollNumber) {
      navigate("/");
      return;
    }

    const fetchFormData = async () => {
      try {
        const data = await getForm(rollNumber);
        setFormData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching form:", error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    fetchFormData();
  }, [rollNumber]);

  useEffect(() => {
    // Reset animation state when section changes
    setAnimateSection(false);
    const timer = setTimeout(() => {
      setAnimateSection(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentSection]);

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    if (!formData) return;

    const currentSectionData = formData.form.sections[currentSection];
    const errors = validateSection(currentSectionData.fields, formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (currentSection < formData.form.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    } else {
      // Shake effect through toast for validation errors
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!formData) return;

    const currentSectionData = formData.form.sections[currentSection];
    const errors = validateSection(currentSectionData.fields, formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Log the form values to the console
      console.log("Form submission payload:", formValues);
      
      toast({
        title: "Form submitted successfully!",
        description: "Check the console for the submission payload.",
      });
      
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="text-center">
          <p className="text-lg animate-pulse">Loading form data...</p>
          <div className="mt-4 flex space-x-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "200ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "400ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <p className="text-lg">No form data available. Please try again.</p>
      </div>
    );
  }

  const { form } = formData;
  const totalSections = form.sections.length;
  const isLastSection = currentSection === totalSections - 1;
  const isCurrentSectionValid = form.sections[currentSection]
    ? isSectionValid(form.sections[currentSection].fields, formValues)
    : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 py-8 px-4">
      <div className="form-wizard-container card-hover">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">{form.formTitle}</h1>
          <p className="text-muted-foreground">
            Welcome, {userName} (Roll Number: {rollNumber})
          </p>
          <p className="text-sm text-muted-foreground">
            Form Version: {form.version}
          </p>
        </div>

        <div className="wizard-indicator">
          {form.sections.map((_, index) => (
            <div
              key={index}
              className={`wizard-indicator-dot ${
                index === currentSection ? "active" : ""
              } ${index < currentSection ? "bg-green-500" : ""}`}
              aria-label={`Section ${index + 1}`}
            >
              {index < currentSection && (
                <Check className="w-3 h-3 text-white absolute" />
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          {form.sections.map((section, index) => (
            <div 
              key={section.sectionId}
              className={`${index === currentSection ? (animateSection ? "wizard-section" : "opacity-0") : "hidden"}`}
            >
              <FormSection section={section} />
            </div>
          ))}
        </div>

        <div className="wizard-nav">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="flex items-center gap-2 btn-animated"
            data-testid="prev-button"
          >
            <span>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </span>
          </Button>

          {isLastSection ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentSectionValid || isSubmitting}
              className="flex items-center gap-2 btn-animated bg-green-600 hover:bg-green-700"
              data-testid="submit-button"
            >
              <span>
                {isSubmitting ? "Submitting..." : "Submit"}
                <Check className="w-4 h-4 ml-1" />
              </span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentSectionValid}
              className="flex items-center gap-2 btn-animated"
              data-testid="next-button"
            >
              <span>
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Section {currentSection + 1} of {totalSections}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;
