'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DomainSetupGuideProps {
  domain: string;
  cname: string;
  isVerified: boolean;
}

export function DomainSetupGuide({ domain, cname, isVerified }: DomainSetupGuideProps) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(cname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isVerified && <CheckCircle className="w-5 h-5 text-green-600" />}
          {domain}
        </CardTitle>
        <CardDescription>
          {isVerified ? 'Domain verified' : 'Awaiting DNS configuration'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="namecom" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="namecom">Name.com</TabsTrigger>
            <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
            <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
          </TabsList>

          <TabsContent value="namecom" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Go to DNS Settings</h4>
              <p className="text-sm text-muted-foreground">
                Login to your Name.com account and go to the DNS settings for {domain}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Add CNAME Record</h4>
              <div className="bg-muted p-3 rounded space-y-2">
                <div className="text-sm">
                  <span className="font-mono">Type:</span> CNAME
                </div>
                <div className="text-sm">
                  <span className="font-mono">Name:</span> @ or leave blank
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm flex-1">
                    <span className="font-mono">Value:</span>
                    <div className="font-mono text-xs mt-1 break-all">{cname}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              DNS changes can take 24-48 hours to propagate
            </p>
          </TabsContent>

          <TabsContent value="godaddy" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Go to DNS Management</h4>
              <p className="text-sm text-muted-foreground">
                Login to GoDaddy and open DNS management for {domain}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Add CNAME Record</h4>
              <div className="bg-muted p-3 rounded space-y-2">
                <div className="text-sm">
                  <span className="font-mono">Type:</span> CNAME
                </div>
                <div className="text-sm">
                  <span className="font-mono">Host:</span> @ or leave blank
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm flex-1">
                    <span className="font-mono">Points to:</span>
                    <div className="font-mono text-xs mt-1 break-all">{cname}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cloudflare" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Open DNS Records</h4>
              <p className="text-sm text-muted-foreground">
                In Cloudflare, go to DNS → Records for {domain}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Create CNAME Record</h4>
              <div className="bg-muted p-3 rounded space-y-2">
                <div className="text-sm">
                  <span className="font-mono">Type:</span> CNAME
                </div>
                <div className="text-sm">
                  <span className="font-mono">Name:</span> @ or leave blank
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm flex-1">
                    <span className="font-mono">Target:</span>
                    <div className="font-mono text-xs mt-1 break-all">{cname}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
