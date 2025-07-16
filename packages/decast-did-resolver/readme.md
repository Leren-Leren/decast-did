# @decast/did-resolver

This is a DID Resolver implementation for the `did:decast` method. It allows you to resolve `did:decast:*` identifiers into W3C-compliant DID Documents.

## 📦 Installation

```bash
npm install @decast/decast-did-resolver
# or
pnpm add @decast/decast-did-resolver
```

## 🧩 Usage

### With `decast-did-resolver` from `decast-did-resolver` package

```ts
import { Resolver } from 'decast-did-resolver';
import { getResolver } from '@decast/decast-did-resolver';

const resolver = new Resolver({
  ...getResolver()
});

const didDocument = await resolver.resolve('did:decast:abc123');
console.log(didDocument);
```

### Directly

```ts
import { resolveDID } from '@decast/decast-did-resolver';

const doc = await resolveDID('did:decast:abc123');
console.log(doc);
```

## 🛠️ Development

```bash
pnpm install
pnpm build
```

## 📄 DID Document Example

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:decast:abc123",
  "verificationMethod": [
    {
      "id": "did:decast:abc123#key-1",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:decast:abc123",
      "publicKeyBase58": "..."
    }
  ],
  "authentication": [
    "did:decast:abc123#key-1"
  ],
  "service": [
    {
      "id": "did:decast:abc123#messaging",
      "type": "DIDCommMessaging",
      "serviceEndpoint": "https://example.com/messages/123"
    }
  ]
}
```

## 📝 License

MIT
