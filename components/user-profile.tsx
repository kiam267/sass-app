'use client';

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/db';
import { users, tenants, Tenant } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Mail, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type UserData = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date | null;
  tenants: {
    id: string;
    name: string;
    createdAt: Date | null;
    userId: string;
    slug: string;
    description: string | null;
  }[];
};

export default function UserProfile({
  domain,
}: {
  domain: string;
}) {
  // Mock user data - replace with actual data from your database
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    fatch();
  }, []);
  console.log(domain);
  const fatch = async () => {
    const user = await db.query.users.findFirst({
      with: {
        tenants: {
          where: eq(tenants.id, domain),
        },
      },
    });
    console.log(user, 'from fatch');

    setUser(user);
  };

  if (user === undefined) {
    return <div>No data founded</div>;
  }
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const joinDate = user?.createdAt?.toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
  return (
    <main className="min-h-screen  from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <Card className="backdrop-blur-sm border-border/50 shadow-2xl">
          <div className="p-8 md:p-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full border-4 border-background shadow-md" />
              </div>

              {/* Name */}
              <h1 className="text-4xl font-bold text-foreground text-center mb-2">
                {user.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                User Account
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 my-8" />

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-foreground break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    User ID
                  </p>
                  <p className="text-foreground font-mono text-sm truncate">
                    {user.id.charAt(5)}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-start gap-4 md:col-span-2">
                <div className="mt-1 p-2.5 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="text-foreground">
                    {joinDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Active</span>
        </div>
      </div>
    </main>
  );
}
