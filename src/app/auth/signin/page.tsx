import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignInForm />
        <div className="text-center">
          <Link 
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
