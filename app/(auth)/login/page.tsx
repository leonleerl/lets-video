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
  searchParams: Promise<{
    next?: string;
    error?: string;
    email?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  let callbackError: string | undefined;
  if (params.error === "auth_callback_failed") {
    callbackError =
      "Email confirmation failed or the link expired. Request a new link or sign in again.";
  } else if (params.error === "wrong_account") {
    callbackError = params.email
      ? `This invite is for ${params.email}. Sign in with that account (not another browser session).`
      : "This invite belongs to a different account. Sign in with the invited email.";
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          {params.email
            ? `Use ${params.email} to continue.`
            : "Use the email and password for your family space."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm
          nextPath={safeNextPath(params.next)}
          callbackError={callbackError}
          defaultEmail={params.email}
        />
      </CardContent>
    </Card>
  );
}
