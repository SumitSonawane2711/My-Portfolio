import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoginButton } from "./LoginButton";

type LoginCardProps = {
  error?: string;
  next?: string;
};

export const LoginCard = ({ error, next }: LoginCardProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Sign in to manage your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              Access denied. This dashboard is private.
            </p>
          )}
          <LoginButton next={next} />
        </CardContent>
      </Card>
    </main>
  );
};
