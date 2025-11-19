'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DomainSetupGuide } from '@/components/domains/domain-setup-guide';
import { AlertCircle, Loader2 } from 'lucide-react';

interface CustomDomain {
  id: string;
  domain: string;
  cname: string;
  isVerified: boolean;
}

interface DomainsData {
  subdomainUrl: string;
  customDomains: CustomDomain[];
}

export default function DomainsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DomainsData | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);
  const [error, setError] = useState('');
  const params = useParams();
  const tenantId = params.tenantId as string;

  useEffect(() => {
    async function fetchDomains() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/tenants/${tenantId}/domains`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setData(data);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDomains();
  }, [tenantId]);

  async function handleAddDomain() {
    if (!newDomain) return;
    
    setAddingDomain(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${tenantId}/domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ domain: newDomain }),
      });

      const result = await res.json();

      if (res.ok) {
        setData(prev => prev ? {
          ...prev,
          customDomains: [...prev.customDomains, result],
        } : null);
        setNewDomain('');
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingDomain(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Domain Settings</h1>
        <p className="text-muted-foreground">
          Manage your subdomain and connect custom domains
        </p>
      </div>

      {/* Subdomain Info */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Your Subdomain</CardTitle>
            <CardDescription>
              Your default subdomain (always available)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg bg-muted p-3 rounded">
              {data.subdomainUrl}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Custom Domain */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Domain</CardTitle>
          <CardDescription>
            Connect your own domain (e.g., alif.com)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-100 text-red-800 rounded flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <div className="flex gap-2">
              <Input
                id="domain"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <Button
                onClick={handleAddDomain}
                disabled={!newDomain || addingDomain}
              >
                {addingDomain ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Domain'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domains List */}
      {data && data.customDomains.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Domains</h2>
          {data.customDomains.map((domain) => (
            <DomainSetupGuide
              key={domain.id}
              domain={domain.domain}
              cname={domain.cname}
              isVerified={domain.isVerified}
            />
          ))}
        </div>
      )}
    </div>
  );
}
