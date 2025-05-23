
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { createUser } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRollNumber, setUserName } = useForm();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    rollNumber: "",
    name: "",
  });
  const [errors, setErrors] = useState({
    rollNumber: "",
    name: "",
  });
  const [touched, setTouched] = useState({
    rollNumber: false,
    name: false,
  });

  const validate = () => {
    const newErrors = {
      rollNumber: !formState.rollNumber.trim() 
        ? "Roll number is required" 
        : !/^[a-zA-Z0-9-]+$/.test(formState.rollNumber)
          ? "Roll number should only contain letters, numbers, and hyphens"
          : "",
      name: !formState.name.trim() 
        ? "Name is required" 
        : /\d/.test(formState.name)
          ? "Name should not contain numbers"
          : formState.name.length < 3
            ? "Name must be at least 3 characters"
            : "",
    };
    
    setErrors(newErrors);
    return !newErrors.rollNumber && !newErrors.name;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ rollNumber: true, name: true });
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await createUser(formState.rollNumber, formState.name);
      
      setRollNumber(formState.rollNumber);
      setUserName(formState.name);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${formState.name}!`,
      });
      
      navigate("/form");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg card-hover animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center wizard-section-title">Student Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className={errors.rollNumber && touched.rollNumber ? "text-destructive" : ""}>
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                placeholder="Enter your roll number"
                value={formState.rollNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                data-testid="roll-number-input"
                disabled={isLoading}
                className={`transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.rollNumber && touched.rollNumber ? "border-destructive" : ""
                }`}
                aria-invalid={!!(errors.rollNumber && touched.rollNumber)}
                aria-describedby={errors.rollNumber && touched.rollNumber ? "roll-number-error" : undefined}
              />
              {errors.rollNumber && touched.rollNumber && (
                <Alert variant="destructive" className="py-2 px-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription 
                    className="text-sm ml-2 error-text" 
                    id="roll-number-error"
                    data-testid="roll-number-error"
                  >
                    {errors.rollNumber}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className={errors.name && touched.name ? "text-destructive" : ""}>
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formState.name}
                onChange={handleChange}
                onBlur={handleBlur}
                data-testid="name-input"
                disabled={isLoading}
                className={`transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name && touched.name ? "border-destructive" : ""
                }`}
                aria-invalid={!!(errors.name && touched.name)}
                aria-describedby={errors.name && touched.name ? "name-error" : undefined}
              />
              {errors.name && touched.name && (
                <Alert variant="destructive" className="py-2 px-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription 
                    className="text-sm ml-2 error-text" 
                    id="name-error"
                    data-testid="name-error"
                  >
                    {errors.name}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              type="submit"
              className="w-full btn-animated"
              disabled={isLoading}
              data-testid="login-button"
            >
              <span>
                {isLoading ? "Logging in..." : "Continue to Form"}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
