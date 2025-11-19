// 'use client';
// import {
//   addDomainToVercel,
//   getDomainConfig,
//   removeDomainFromVercel,
// } from '@/lib/c';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

function DomainSetup() {
  // // Now get the config AFTER the domain is added
  // const res2 = await getDomainConfig('reviewaide.com');
  // console.log(res2);

  return (
    <div>
      <Button
        onClick={async function () {
          const res = await fetch(
            'http://localhost:3000/api/auth/domain',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                domain: 'reviewaide.com',
              }),
            }
          );

          const data = await res.json();
          console.log(data);

          if (!res.ok) {
            console.log(res);

            return;
          }
        }}
      >
        add button
      </Button>
    </div>
  );
}

export default DomainSetup;
