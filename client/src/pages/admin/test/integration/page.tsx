import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

export default function IntegrationTest() {
  return (
    <div className="p-8">
      <h1>V4 Integration Test</h1>
      
      {/* Test new routes */}
      <div className="space-y-4">
        <Link href={ROUTES.PRODUCTS.STARTER_KIT}>
          <Button>Test Product Route</Button>
        </Link>
        
        <Link href={ROUTES.LEARN.STARTER_KIT}>
          <Button variant="secondary">Test Learn Route</Button>
        </Link>
        
        <Button variant="luxury" loading>
          Test Loading State
        </Button>
      </div>
    </div>
  );
}