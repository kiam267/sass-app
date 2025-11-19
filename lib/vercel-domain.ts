//

const VERCEL_API_TOKEN =
  process.env.NEXT_PUBLIC_VERCEL_API_TOKEN!;
const VERCEL_PROJECT_ID =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || null; // optional

interface VercelDomainResponse {
  name: string;
  apexName: string;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
}

const getVercelHeaders = () => ({
  Authorization: `Bearer ${VERCEL_API_TOKEN}`,
  'Content-Type': 'application/json',
});

const getApiUrl = (endpoint: string) => {
  const base = 'https://api.vercel.com';

  if (VERCEL_TEAM_ID) {
    return `${base}${endpoint}${
      endpoint.includes('?') ? '&' : '?'
    }teamId=${VERCEL_TEAM_ID}`;
  }

  return `${base}${endpoint}`;
};

console.log(VERCEL_PROJECT_ID, 'env');

/**
 * Add a custom domain to the Vercel project
 */
export async function addDomainToVercel(domain: string) {
  try {
    const res = await fetch(
      getApiUrl(
        `/v10/projects/${VERCEL_PROJECT_ID}/domains`
      ),
      {
        method: 'POST',
        headers: getVercelHeaders(),
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await res.json();
    console.log(data, "vercel error ");

    if (!res.ok) {
      return {
        success: false,
        error: res
      };
    }

    return {
      success: true,
      data: data as VercelDomainResponse,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    };
  }
}

/**
 * Remove a custom domain from your Vercel project
 */
export async function removeDomainFromVercel(
  domain: string
) {
  try {
    const res = await fetch(
      getApiUrl(
        `/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}`
      ),
      {
        method: 'DELETE',
        headers: getVercelHeaders(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          data.error?.message || 'Failed to remove domain',
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    };
  }
}

/**
 * Get domain config (DNS instructions)
 */
export async function getDomainConfig(domain: string) {
  try {
    const res = await fetch(
      getApiUrl(
        `/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}/config`
      ),
      {
        method: 'GET',
        headers: getVercelHeaders(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          data.error?.message ||
          'Failed to load domain config',
      };
    }

    return {
      success: true,
      data: data as VercelDomainResponse,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    };
  }
}

/**
 * Verify domain ownership
 */
export async function verifyDomain(domain: string) {
  try {
    const res = await fetch(
      getApiUrl(
        `/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify`
      ),
      {
        method: 'POST',
        headers: getVercelHeaders(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        verified: false,
        error:
          data.error?.message || 'Failed to verify domain',
      };
    }

    return {
      success: true,
      verified: data.verified ?? false,
    };
  } catch (err) {
    return {
      success: false,
      verified: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    };
  }
}
