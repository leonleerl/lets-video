import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { safeNextPath } from "@/lib/auth/paths";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackError =
    params.error === "auth_callback_failed"
      ? "Email confirmation failed or the link expired. Request a new link or sign in again."
      : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          Use the email and password for your family space.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm nextPath={safeNextPath(params.next)} callbackError={callbackError} />
      </CardContent>
    </Card>
  );
}
