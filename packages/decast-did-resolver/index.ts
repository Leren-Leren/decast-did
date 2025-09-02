// decastDidResolver.ts
import { DIDResolutionResult, Resolvable } from 'did-resolver';

export function getDecastResolver(): {
  [method: string]: (
    did: string,
    parsed: any,
    resolver: Resolvable,
  ) => Promise<DIDResolutionResult>;
} {
  return {
    decast: async (did: string) => {
      const baseUrl = process.env.DID_RESOLVER_BASE_URL;
      if (!baseUrl) {
        throw new Error('DID_RESOLVER_BASE_URL environment variable is not set');
      }
      
      const res = await fetch(
        `${baseUrl}/${did}`,
      );
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }

      throw new Error(`DID document not found for ${did}`);
    },
  };
}
