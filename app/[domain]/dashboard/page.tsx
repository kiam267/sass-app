'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateTenantForm } from '@/components/tenant/create-tenant-form';
import { Loader2 } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function DashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchTenants() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch user's tenants
        const res = await fetch(
          'http://localhost:3000/api/tenants',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/auth/login');
          }
          return;
        }

        const data = await res.json();
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            My Dashboards
          </h1>
          <Button
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? 'Cancel' : 'Create Dashboard'}
          </Button>
        </div>

        {showCreate && (
          <div className="mb-8">
            <CreateTenantForm />
          </div>
        )}

        {tenants.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">
                No dashboards yet
              </p>
              <Button onClick={() => setShowCreate(true)}>
                Create Your First Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map(tenant => (
              <Card
                key={tenant.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  router.push(`/dashboard/${tenant.id}`)
                }
              >
                <CardHeader>
                  <CardTitle>{tenant.name}</CardTitle>
                  <CardDescription>
                    https://{tenant.slug}
                    .shariarkobirkiam.xyz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tenant.description && (
                    <p className="text-sm text-muted-foreground">
                      {tenant.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
