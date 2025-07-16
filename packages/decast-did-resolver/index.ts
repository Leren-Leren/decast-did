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
      const res = await fetch(
        'http://localhost:3000/api/v1/dids/resolver/' + did,
      );
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }

      throw new Error(`DID document not found for ${did}`);
    },
  };
}
