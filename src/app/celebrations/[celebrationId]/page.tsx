import { CelebrationView } from '@/components/CelebrationView';

interface CelebrationPageProps {
  params: Promise<{
    celebrationId: string;
  }>;
}

export default async function CelebrationPage({ params }: CelebrationPageProps) {
  const { celebrationId } = await params;
  return <CelebrationView celebrationId={celebrationId} />;
}
