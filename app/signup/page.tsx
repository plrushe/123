import { AuthForm } from "@/components/auth/AuthForm";
import { PageContainer } from "@/components/PageContainer";
import { signUpAction } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <main>
      <PageContainer>
        <AuthForm
          title="Create your account"
          description="Join TeachBoard as a candidate or recruiter."
          buttonLabel="Create account"
          action={signUpAction}
          includeRole
        />
      </PageContainer>
    </main>
  );
}
