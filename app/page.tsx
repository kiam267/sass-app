'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DomainSetup from '@/components/domain-setup';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [host, setHost] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen  from-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            SaaS Platform
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `https://kiam.${
                        process.env.NODE_ENV ===
                        'production'
                          ? process.env
                              .NEXT_PUBLIC_MAIN_DOMAIN
                          : 'localhost:3000'
                      }/dashboard`
                    )
                  }
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/');
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>
      <DomainSetup />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-balance">
            Multi-Tenant SaaS Made Simple
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Create multiple dashboards with automatic
            subdomains. Connect custom domains in minutes.
            Like Vercel, but for your own application.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            {isLoggedIn ? (
              <Button
                size="lg"
                onClick={() =>
                  router.push(
                    `https://kiam.${
                      process.env.NODE_ENV === 'production'
                        ? process.env
                            .NEXT_PUBLIC_MAIN_DOMAIN
                        : 'localhost:3000'
                    }/dashboard`
                  )
                }
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🌐</div>
              </div>
              <h3 className="text-lg font-semibold">
                Automatic Subdomains
              </h3>
              <p className="text-muted-foreground">
                Each dashboard gets its own subdomain
                instantly. No DNS configuration needed for
                subdomains.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">✨</div>
              </div>
              <h3 className="text-lg font-semibold">
                Custom Domains
              </h3>
              <p className="text-muted-foreground">
                Users can connect their own domains with
                simple CNAME setup. Guides for all
                registrars included.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🔒</div>
              </div>
              <h3 className="text-lg font-semibold">
                Fully Isolated
              </h3>
              <p className="text-muted-foreground">
                Complete data isolation per tenant. Secure
                authentication with JWT tokens.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">⚡</div>
              </div>
              <h3 className="text-lg font-semibold">
                Vercel Ready
              </h3>
              <p className="text-muted-foreground">
                Deploy on Vercel with automatic wildcard
                domain configuration and scaling.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">📊</div>
              </div>
              <h3 className="text-lg font-semibold">
                Dashboard Control
              </h3>
              <p className="text-muted-foreground">
                Manage all your projects from one central
                dashboard. Easy to switch between them.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🛠️</div>
              </div>
              <h3 className="text-lg font-semibold">
                Modern Stack
              </h3>
              <p className="text-muted-foreground">
                Built with Next.js, Drizzle ORM, and Neon.
                Production-ready code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="space-y-12">
          <div className="flex gap-8 items-center">
            <div className="text-5xl font-bold text-muted-foreground">
              1
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Create Account
              </h3>
              <p className="text-muted-foreground">
                Sign up with your email and password. Takes
                less than a minute.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <div className="text-5xl font-bold text-muted-foreground">
              2
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Create Dashboard
              </h3>
              <p className="text-muted-foreground">
                Create a new project with a custom slug.
                Your subdomain is ready immediately.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <div className="text-5xl font-bold text-muted-foreground">
              3
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Connect Custom Domain (Optional)
              </h3>
              <p className="text-muted-foreground">
                Add your own domain and configure DNS. We
                provide the CNAME and setup guides for all
                registrars.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <div className="text-5xl font-bold text-muted-foreground">
              4
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Done!
              </h3>
              <p className="text-muted-foreground">
                Access your dashboard from anywhere. Both
                your subdomain and custom domain work
                perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border border-primary/20 rounded-lg max-w-4xl mx-auto mb-24 p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Create your first dashboard today and experience
          multi-tenant SaaS the easy way.
        </p>
        {!isLoggedIn && (
          <Button size="lg" asChild>
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-muted-foreground">
        <p>Built with Next.js, Drizzle, and Neon</p>
      </footer>
    </div>
  );
}
