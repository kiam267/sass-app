'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function GeneralSettingsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">General Settings</h1>
          <p className="text-muted-foreground">
            Manage your dashboard settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex gap-2">
            <Button 
              asChild 
              variant="outline"
            >
              <Link href={`/dashboard/${tenantId}`}>Back</Link>
            </Button>
            <Button 
              asChild 
              variant={undefined}
            >
              <Link href={`/dashboard/${tenantId}/settings/domains`}>
                Domain Settings
              </Link>
            </Button>
          </div>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how your dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primary-color" 
                    type="color" 
                    defaultValue="#3b82f6"
                    className="w-16"
                  />
                  <Input 
                    type="text" 
                    defaultValue="#3b82f6"
                    placeholder="#3b82f6"
                    readOnly
                  />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
