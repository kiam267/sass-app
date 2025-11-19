import UserProfile from '@/components/user-profile';
import React from 'react';

async function page({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = await params;
  return <UserProfile domain={domain} />;
}

export default page;
