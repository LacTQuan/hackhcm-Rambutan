import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Go back to{" "}
        <Link href="/">
          Home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
