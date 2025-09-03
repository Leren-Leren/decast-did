<template>
    <div class="m-divider">
        <div class="m-divider-line"></div>
        <div class="m-divider-label">OR</div>
        <div class="m-divider-line"></div>
    </div>
</template>

<style>
.m-divider {
    display: flex;
    align-items: center;
    gap: .5rem !important;
    font-size: .8rem !important;
}

.m-divider-line {
    background-color: #444551;
    opacity: 0.5;
    height: 1px !important;
    flex-grow: 1 !important;
}

.m-divider-label {
    color: #FFFFFF50;
    background-color: #1B1D29;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
}
</style>
