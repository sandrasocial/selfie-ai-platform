
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CourseAccessGuardProps {
  courseName: string;
  purchaseUrl: string;
  price: string;
}

export function CourseAccessGuard({ courseName, purchaseUrl, price, children }: CourseAccessGuardProps & { children?: React.ReactNode }) {
  // 🧪 DEV OVERRIDE — REMOVE BEFORE LAUNCH
  // Check if this is dev user in development mode
  if (import.meta.env.MODE === 'development') {
    // Allow dev access for testing
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-[#4C4B4B] mx-auto mb-8"></div>
        <h1 className="text-3xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
          Course Access Required
        </h1>
        <p className="text-[#4C4B4B] mb-8 font-light leading-relaxed">
          Purchase {courseName} to access this content.
        </p>
        <Link href={purchaseUrl}>
          <Button className="bg-[#171719] text-white hover:bg-[#4C4B4B] border-0 px-8 py-3 font-light">
            Purchase Course - {price}
          </Button>
        </Link>
      </div>
    </div>
  );
}
