# @decast/did-resolver

This is a DID Resolver implementation for the `did:decast` method. It allows you to resolve `did:decast:*` identifiers into W3C-compliant DID Documents.

## 🆔 What is `did:decast`?

`did:decast` is a custom DID method that uniquely represents a user within the Decast ecosystem. It complies with the [W3C DID specification](https://www.w3.org/TR/did-core/) and provides:

- Cryptographic key association (Ed25519 by default)
- Public verification methods
- Authentication support (JWT, DIDComm, etc.)
- Optional service endpoints (profile, storages, etc.)


## 📦 Installation

```bash
npm install @decast/decast-did-resolver
# or
pnpm add @decast/decast-did-resolver
```

## 🧩 Usage

### With `did-resolver` from `decast-did-resolver` package

```ts
import { Resolver } from 'did-resolver';
import { getDecastResolver } from '@decast/decast-did-resolver';

const resolver = new Resolver({
  ...getDecastResolver()
});

const didDocument = await resolver.resolve('did:decast:abc123');
console.log(didDocument);
```

### Directly

```ts
import { getDecastResolver } from '@decast/decast-did-resolver';

const doc = await resolveDID('did:decast:abc123');
console.log(doc);
```

## 🛠️ Development

```bash
pnpm install
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
