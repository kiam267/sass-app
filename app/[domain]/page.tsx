import React from 'react';

async function page({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = await params;
  return <div>page - {domain}</div>;
}

export default page;
