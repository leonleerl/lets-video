import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Create a family space</CardTitle>
        <CardDescription>
          Sign up with email and password. You can invite family members later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
