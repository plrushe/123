import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function AdminPage() {
  return (
    <main>
      <PageContainer>
        <PageHeader title="Admin Console" description="This page will provide platform-level controls for users, jobs, and moderation." />
      </PageContainer>
    </main>
  );
}
