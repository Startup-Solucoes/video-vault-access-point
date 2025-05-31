
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AuthForm } from "@/components/auth/AuthForm";

const AppContent = () => {
  const { user, profile, isLoading } = useAuth();

  console.log('App render state:', { user: !!user, profile, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return <Dashboard />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
