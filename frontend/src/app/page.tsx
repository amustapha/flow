import { AppLayout, Sidebar } from '@/components';

export default function Home() {
  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome to Flow
          </h1>
          <p className="text-lg text-gray-600">
            Voice-powered reminders that never let you down
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
