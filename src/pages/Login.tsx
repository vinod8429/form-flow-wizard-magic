
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../context/FormContext";
import { createUser } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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

  const validate = () => {
    const newErrors = {
      rollNumber: !formState.rollNumber ? "Roll number is required" : "",
      name: !formState.name ? "Name is required" : "",
    };
    
    setErrors(newErrors);
    return !newErrors.rollNumber && !newErrors.name;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Student Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                placeholder="Enter your roll number"
                value={formState.rollNumber}
                onChange={handleChange}
                data-testid="roll-number-input"
                disabled={isLoading}
              />
              {errors.rollNumber && (
                <p className="error-text" data-testid="roll-number-error">
                  {errors.rollNumber}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formState.name}
                onChange={handleChange}
                data-testid="name-input"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="error-text" data-testid="name-error">
                  {errors.name}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="login-button"
            >
              {isLoading ? "Logging in..." : "Continue to Form"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
