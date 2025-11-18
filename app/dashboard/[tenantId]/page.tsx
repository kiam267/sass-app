'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Settings, Globe } from 'lucide-react';
import Link from 'next/link';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function TenantDashboardPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  useEffect(() => {
    async function fetchTenant() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // In a real app, you'd have a GET endpoint for a single tenant
        // For now, we'll fetch all and filter
        const res = await fetch('/api/tenants', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const tenants = await res.json();
          const found = tenants.find((t: Tenant) => t.id === tenantId);
          if (found) {
            setTenant(found);
          }
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTenant();
  }, [tenantId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">Tenant not found</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subdomainUrl = `https://${tenant.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{tenant.name}</h1>
            <p className="text-muted-foreground">{tenant.description}</p>
          </div>
          <Button 
            asChild 
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Subdomain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-lg bg-muted p-3 rounded mb-3">
                {subdomainUrl}
              </div>
              <p className="text-sm text-muted-foreground">
                This subdomain is always available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link href={`/dashboard/${tenantId}/settings/domains`}>
                    <Globe className="w-4 h-4 mr-2" />
                    Domain Settings
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link href={`/dashboard/${tenantId}/settings/general`}>
                    <Settings className="w-4 h-4 mr-2" />
                    General Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Content</CardTitle>
            <CardDescription>
              Add your custom content here. This is the main dashboard for {tenant.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
              Customize this dashboard with your own content
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
