import Image from 'next/image';
import LoginForm from './LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/rcc-logo.webp"
            alt="RCC logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl font-semibold text-neutral-900">RCC Admin</h1>
          <p className="text-sm text-neutral-500">Sign in to manage upcoming events</p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
