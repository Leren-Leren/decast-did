<template>
    <BaseModal :title="'E-Mail verification'" @close="closeModal">
        <template #modalContent>
            <div class="ie-modal-wrapper">
                <!-- Header -->
                <div class="modal-header">
                    <DecastLogo />
                    <h3 class="modal-title">DecastID</h3>
                </div>

                <div class="decast-box">
                    <p>
                        With DECAST.LIVE, you log in using your
                        Decentralized Identifier (DID), a secure, private, and user-controlled way
                        to access the platform.
                    </p>

                    <p>
                        <strong>Own your identity</strong><br />
                        You’re in control. Not big tech.
                    </p>

                    <p>
                        <strong>Secure by design</strong><br />
                        Built on cryptographic trust, not vulnerable credentials.
                    </p>

                    <p>
                        <strong>Portable and interoperable</strong><br />
                        Use your DID across different platforms and ecosystems.
                    </p>

                    <button class="install-btn" @click="redirectToExtension">Install DecastID Extension</button>
                </div>

            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '~/common/BaseModal.vue'
import DecastLogo from '~/icons/DecastLogo.vue'
const config = useRuntimeConfig()
const EXTENSION_ID = config.public.extensionId

// Props from parent (to close modal)
defineProps({
    closeModal: {
        type: Function,
        required: true
    }
})

const redirectToExtension = () => {
    if (process.client) {
        window.open(
            `https://chrome.google.com/webstore/detail/decast-did-manager/${EXTENSION_ID}`,
            "_blank"
        )
    }
}
</script>

<style scoped>
*:not(i) {
    font-family: 'Rethink Sans' !important;
}

.ie-modal-wrapper {
    padding: 0px 24px 24px 24px;
    border-radius: 12px;
    background: transparent;
    max-width: 400px;
}

/* header */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
}

.modal-logo {
    width: 28px;
    height: 28px;
}

.modal-title {
    font-size: 1.2rem;
    font-weight: bold;
}

/* body */
.modal-body {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 20px;
}

.ie-para {
    font-weight: 400;
    font-size: 16px;
    color: #B3B3B3;
}

/* footer */
.modal-footer {
    display: flex;
    justify-content: center;
}

.install-btn {
    background: #D3CA57;
    color: #111;
    font-weight: 600;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.install-btn:hover {
    background: #d4d43c;
}

.decast-box {
    color: #fff;
    max-width: 400px;
    line-height: 1.5;
}

.decast-box p {
    text-align: left;
    margin: 0 0 14px;
    font-size: 14px;
    color: #ccc;
    /* lighter gray for normal text */
}

.decast-box strong {
    color: #fff;
    /* keep headings white */
    font-weight: 600;
}
</style>