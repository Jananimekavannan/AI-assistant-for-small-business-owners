import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Authenticated as AuthenticatedWrapper } from "convex/react";
import BusinessAssistant from "./BusinessAssistant";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <h2 className="text-xl font-bold text-emerald-700">BizAssist AI</h2>
        </div>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Unauthenticated>
        <div className="text-center mb-2">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-4xl font-bold text-emerald-700 mb-3">BizAssist AI</h1>
          <p className="text-gray-600 text-lg mb-1">AI-powered content for your small business</p>
          <p className="text-gray-500 text-sm">WhatsApp & Instagram ready in seconds</p>
        </div>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        <BusinessAssistant user={loggedInUser} />
      </Authenticated>
    </div>
  );
}
