# Decast DID System

This repository provides the core infrastructure for handling Decentralized Identifiers (DIDs) in the [Decast](https://decast.live) platform.

Decast utilizes `did:decast` identifiers to enable secure, verifiable, and user-controlled digital identity in live communications, virtual events, and more.

---

## 🆔 What is `did:decast`?

`did:decast` is a custom DID method that uniquely represents a user within the Decast ecosystem. It complies with the [W3C DID specification](https://www.w3.org/TR/did-core/) and provides:

- Cryptographic key association (Ed25519 by default)
- Public verification methods
- Authentication support (JWT, DIDComm, etc.)
- Optional service endpoints (profile, storages, etc.)

---

## 🔐 Authentication via DID

Users on Decast can authenticate using a variety of DID-backed methods:

| Method        | Description |
|---------------|-------------|
| **Email**     | Email login backed by a DID document and JWT |
| **Google**    | Google login mapped to a DID identity |
| **Facebook**    | Facebook login mapped to a DID identity |
| **Apple**    | Apple login mapped to a DID identity |
| **Wallet**    | Sign-in using Ethereum or EVM-compatible wallets (via nonce & signature) |
| **ZKP**       | Future support for Zero-Knowledge Proof-based login (e.g. Sismo, Zupass) |

All sessions issue a signed DID-JWT that contains the user’s `did:decast` identifier.

---

## 🎥 In-Call Verifications

During a live Decast session (e.g., a stream, meeting, or broadcast), the following verification mechanisms can be applied:

| Verification      | Description |
|-------------------|-------------|
| **Liveness Check**| Face movement + image capture to ensure the user is present and human |
| **DID Assertion** | Prove identity ownership with DID and/or wallet signing |
| *(More coming)*   | Age-gating, reputation-based access, NFT-based roles |

---

## 🧩 Services Enabled via DID

| Service                        | How it uses DID |
|-------------------------------|------------------|
| **Identity Management**       | Self-custodied DID with recovery & linking options |
| **Cross-Platform Login**      | DID-based session token across Web, Mobile, and Extension |
| **Verifiable Credentials**    | Issue VCs tied to your `did:decast` (planned) |
| **Liveness-based Access**     | Join gated calls/events with verified presence |
| **Wallet + Role Integration** | NFT-based DID roles and permissions |
| **File & Stream Storage**     | Associate encrypted media & documents to a user's DID |

---

## 📦 Storage Services

Decast uses DID-linked storage to manage secure file and stream storage, allowing each user's content to be cryptographically tied to their identity.

Soon

---

## 📁 Repo Structure

```
decast-did/
├── packages/
│   ├── did-resolver/       # NPM module to resolve `did:decast:*`
│   └── did-manager/        # Browser extension for managing DIDs
├── README.md               # This file
└── ...
```

---

## 📚 Related Docs

- [Decast Auth API](https://did.decast.live)
- [DID Manager Extension](./packages/did-manager/readme.md)
- [DID Resolver Module](./packages/decast-did-resolver//readme.md)

---

## 📄 License

MIT
