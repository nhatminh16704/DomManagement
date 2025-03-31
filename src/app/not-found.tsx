'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [prevPath, setPrevPath] = useState<boolean | null>(null);

  useEffect(() => {
    // Get the previous path if available from history
    if (typeof window !== 'undefined') {
      setPrevPath(window.history.length > 1);
    }
  }, []);

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <Image 
          src="/404.png" 
          alt="404 Not Found" 
          width={400} 
          height={300}
          className="mx-auto mb-8"
          priority
        />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page youre looking for doesnt exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          {prevPath && (
            <button 
              onClick={goBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Go Back
            </button>
          )}
          
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}