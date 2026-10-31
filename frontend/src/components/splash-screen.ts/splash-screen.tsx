export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-sm text-gray-500">Checking authentication...</p>
      </div>
    </div>
  );
}
