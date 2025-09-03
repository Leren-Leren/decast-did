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

## ⚙️ Configuration

The resolver requires the `DID_RESOLVER_BASE_URL` environment variable to be set. This should point to the base URL of your DID resolver service.

### Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `DID_RESOLVER_BASE_URL` | Base URL for the DID resolver service | `https://did.decast.live/api/v1/dids/resolver` | Yes |

### Example Configuration

```bash
# Set the environment variable
export DID_RESOLVER_BASE_URL="https://did.decast.live/api/v1/dids/resolver"

# Or create a .env file
echo "DID_RESOLVER_BASE_URL=https://did.decast.live/api/v1/dids/resolver" > .env
```

**Note**: The resolver will append the DID identifier to this base URL. For example, if `DID_RESOLVER_BASE_URL` is set to `https://did.decast.live/api/v1/dids/resolver`, a request for `did:decast:abc123` will be resolved by calling `https://did.decast.live/api/v1/dids/resolver/abc123`.

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
