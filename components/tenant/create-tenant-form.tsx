'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export function CreateTenantForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState('');
  const router = useRouter();

  function validateSlug(slug: string) {
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError('Only lowercase letters, numbers, and hyphens');
      return false;
    }
    if (slug.length < 3) {
      setSlugError('Minimum 3 characters');
      return false;
    }
    setSlugError('');
    return true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    if (!validateSlug(slug)) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, slug, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push(`/dashboard/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Dashboard</CardTitle>
        <CardDescription>
          This creates a new workspace with its own subdomain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-100 text-red-800 rounded flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="My SaaS App"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input
                id="slug"
                name="slug"
                placeholder="myapp"
                onBlur={(e) => validateSlug(e.target.value)}
                onInput={(e) => validateSlug(e.currentTarget.value)}
              />
              <span className="text-sm text-muted-foreground flex-shrink-0">
                .shariarkobirkiam.xyz
              </span>
            </div>
            {slugError && (
              <p className="text-xs text-red-600">{slugError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="What is this for?"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Dashboard'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
