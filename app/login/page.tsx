import { AuthForm } from "@/components/auth/AuthForm";
import { PageContainer } from "@/components/PageContainer";
import { signInAction } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <main>
      <PageContainer>
        <AuthForm
          title="Welcome back"
          description="Sign in to continue to your TeachBoard dashboard."
          buttonLabel="Sign in"
          action={signInAction}
        />
      </PageContainer>
    </main>
  );
}
