<template>
    <svg width="564" height="668" viewBox="0 0 564 668" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="73" y1="76" x2="73" y2="598" stroke="url(#paint0_linear_213_4345)" stroke-width="2" />
        <line x1="163" y1="24" x2="163" y2="645" stroke="url(#paint1_linear_213_4345)" stroke-width="2" />
        <line x1="253" y1="-4.37114e-08" x2="253" y2="668" stroke="url(#paint2_linear_213_4345)" stroke-width="2" />
        <line x1="72" y1="147" x2="522" y2="147" stroke="url(#paint3_linear_213_4345)" stroke-width="2" />
        <line x1="8.74228e-08" y1="237" x2="564" y2="237" stroke="url(#paint4_linear_213_4345)" stroke-width="2" />
        <line x1="8.74228e-08" y1="327" x2="564" y2="327" stroke="url(#paint5_linear_213_4345)" stroke-width="2" />
        <line x1="8.74228e-08" y1="417" x2="564" y2="417" stroke="url(#paint6_linear_213_4345)" stroke-width="2" />
        <line x1="72" y1="507" x2="521" y2="507" stroke="url(#paint7_linear_213_4345)" stroke-width="2" />
        <line x1="162" y1="597" x2="432" y2="597" stroke="url(#paint8_linear_213_4345)" stroke-width="2" />
        <line x1="162" y1="57" x2="432" y2="57" stroke="url(#paint9_linear_213_4345)" stroke-width="2" />
        <line x1="343" y1="3" x2="343" y2="665" stroke="url(#paint10_linear_213_4345)" stroke-width="2" />
        <line x1="433" y1="32" x2="433" y2="636" stroke="url(#paint11_linear_213_4345)" stroke-width="2" />
        <line x1="523" y1="101" x2="523" y2="571" stroke="url(#paint12_linear_213_4345)" stroke-width="2" />
        <g filter="url(#filter0_d_213_4345)">
            <rect x="72" y="280" width="186" height="186" rx="24" fill="#1B1D29" />
        </g>
        <g filter="url(#filter1_d_213_4345)">
            <path
                d="M335 304C335 290.745 345.745 280 359 280H497C510.255 280 521 290.745 521 304V442C521 455.255 510.255 466 497 466H359C345.745 466 335 455.255 335 442V304Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter2_d_213_4345)">
            <path
                d="M116 292C116 278.745 126.745 268 140 268H301C314.255 268 325 278.745 325 292V453C325 466.255 314.255 477 301 477H140C126.745 477 116 466.255 116 453V292Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter3_d_213_4345)">
            <path
                d="M268 292C268 278.745 278.745 268 292 268H453C466.255 268 477 278.745 477 292V453C477 466.255 466.255 477 453 477H292C278.745 477 268 466.255 268 453V292Z"
                fill="#1B1D29" />
        </g>
        <!-- <g filter="url(#filter4_d_213_4345)">
            <path
                d="M168 268C168 254.745 178.745 244 192 244H399C412.255 244 423 254.745 423 268V475C423 488.255 412.255 499 399 499H192C178.745 499 168 488.255 168 475V268Z"
                fill="url(#paint13_linear_213_4345)" />
            <path
                d="M192 245H399C411.703 245 422 255.297 422 268V475C422 487.703 411.703 498 399 498H192C179.297 498 169 487.703 169 475V268C169 255.297 179.297 245 192 245Z"
                stroke="url(#paint14_linear_213_4345)" stroke-opacity="0.5" stroke-width="2" />
        </g> -->


        <defs>
            <!-- Animate gradient by modifying its gradientTransform -->
            <linearGradient id="animatedGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0%" stop-color="#00f" />
                <stop offset="50%" stop-color="#0f0" />
                <stop offset="100%" stop-color="#f00" />
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="5s"
                    repeatCount="indefinite" />
            </linearGradient>

            <filter id="filter4_d_213_4345">
                <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="black" flood-opacity="0.4" />
            </filter>
        </defs>

        <!-- Apply the gradient and filter to the shape -->
        <g filter="url(#filter4_d_213_4345)">
            <path
                d="M168 268C168 254.745 178.745 244 192 244H399C412.255 244 423 254.745 423 268V475C423 488.255 412.255 499 399 499H192C178.745 499 168 488.255 168 475V268Z"
                fill="url(#animatedGradient)" fill-opacity="0.5" />

            <path
                d="M192 245H399C411.703 245 422 255.297 422 268V475C422 487.703 411.703 498 399 498H192C179.297 498 169 487.703 169 475V268C169 255.297 179.297 245 192 245Z"
                stroke="url(#animatedGradient)" stroke-opacity="0.5" stroke-width="2" />
        </g>


        <g filter="url(#filter5_di_213_4345)">
            <path
                d="M180 281C180 267.745 190.745 257 204 257H386C399.255 257 410 267.745 410 281V463C410 476.255 399.255 487 386 487H204C190.745 487 180 476.255 180 463V281Z"
                fill="#1B1D29" />
            <path
                d="M204 258H386C398.703 258 409 268.297 409 281V463C409 475.703 398.703 486 386 486H204C191.297 486 181 475.703 181 463V281C181 268.297 191.297 258 204 258Z"
                stroke="url(#paint15_linear_213_4345)" stroke-opacity="0.4" stroke-width="2" />
        </g>
        <rect x="229" y="306" width="132" height="132" rx="66" fill="url(#paint16_linear_213_4345)"
            fill-opacity="0.1" />
        <rect x="229.5" y="306.5" width="131" height="131" rx="65.5" stroke="url(#paint17_linear_213_4345)"
            stroke-opacity="0.05" />
        <rect x="237" y="314" width="116" height="116" rx="58" fill="url(#paint18_linear_213_4345)"
            fill-opacity="0.15" />
        <rect x="237.5" y="314.5" width="115" height="115" rx="57.5" stroke="url(#paint19_linear_213_4345)"
            stroke-opacity="0.15" />
        <rect x="245" y="322" width="100" height="100" rx="50" fill="url(#paint20_linear_213_4345)"
            fill-opacity="0.2" />
        <rect x="245.5" y="322.5" width="99" height="99" rx="49.5" stroke="url(#paint21_linear_213_4345)"
            stroke-opacity="0.2" />
        <g filter="url(#filter6_i_213_4345)">
            <rect x="255" y="332" width="80" height="80" rx="40" fill="url(#paint22_linear_213_4345)"
                fill-opacity="0.2" />
            <rect x="255.5" y="332.5" width="79" height="79" rx="39.5" stroke="url(#paint23_linear_213_4345)"
                stroke-opacity="0.2" />
            <path d="M308.929 391.252H297.788V385.68H308.929V391.252Z" fill="white" />
            <path d="M297.788 385.68H292.215V371.752H297.786L297.788 385.68Z" fill="white" />
            <path d="M308.929 366.181V371.752H297.786L297.788 366.181H308.929Z" fill="white" />
            <path d="M292.213 377.323H281.07V371.753H292.213V377.323Z" fill="#D7DF23" />
            <path d="M297.785 371.751L292.213 371.753V357.823H297.785V371.751Z" fill="#D7DF23" />
            <path d="M292.213 352.252V357.823H281.07V352.252H292.213Z" fill="#D7DF23" />
        </g>
        <g filter="url(#filter7_d_213_4345)">
            <path
                d="M257 172C257 162.059 265.059 154 275 154H317C326.941 154 335 162.059 335 172V214C335 223.941 326.941 232 317 232H275C265.059 232 257 223.941 257 214V172Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter8_d_213_4345)">
            <path
                d="M257 80C257 70.0589 265.059 62 275 62H317C326.941 62 335 70.0589 335 80V122C335 131.941 326.941 140 317 140H275C265.059 140 257 131.941 257 122V80Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter9_d_213_4345)">
            <path
                d="M349 80C349 70.0589 357.059 62 367 62H409C418.941 62 427 70.0589 427 80V122C427 131.941 418.941 140 409 140H367C357.059 140 349 131.941 349 122V80Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter10_d_213_4345)">
            <path
                d="M349 172C349 162.059 357.059 154 367 154H409C418.941 154 427 162.059 427 172V214C427 223.941 418.941 232 409 232H367C357.059 232 349 223.941 349 214V172Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter11_d_213_4345)">
            <path
                d="M165 80C165 70.0589 173.059 62 183 62H225C234.941 62 243 70.0589 243 80V122C243 131.941 234.941 140 225 140H183C173.059 140 165 131.941 165 122V80Z"
                fill="#1B1D29" />
        </g>
        <g filter="url(#filter12_di_213_4345)">
            <circle cx="252.5" cy="597.5" r="6.5" fill="#292B39" />
        </g>
        <g filter="url(#filter13_di_213_4345)">
            <circle cx="432.5" cy="506.5" r="6.5" fill="#292B39" />
        </g>
        <g filter="url(#filter14_di_213_4345)">
            <circle cx="162.5" cy="236.5" r="6.5" fill="#292B39" />
        </g>
        <defs>
            <filter id="filter0_d_213_4345" x="32" y="280" width="226" height="226" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="-20" dy="20" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter1_d_213_4345" x="335" y="280" width="226" height="226" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="20" dy="20" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter2_d_213_4345" x="76" y="268" width="249" height="249" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="-20" dy="20" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter3_d_213_4345" x="268" y="268" width="249" height="249" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="20" dy="20" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter4_d_213_4345" x="128" y="244" width="295" height="295" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="-20" dy="20" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter5_di_213_4345" x="170" y="247" width="270" height="270" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.4 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="20" dy="20" />
                <feGaussianBlur stdDeviation="20" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_213_4345" />
            </filter>
            <filter id="filter6_i_213_4345" x="235" y="312" width="120" height="120" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.862745 0 0 0 0 0.988235 0 0 0 0 0.211765 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_213_4345" />
            </filter>
            <filter id="filter7_d_213_4345" x="257" y="154" width="98" height="98" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter8_d_213_4345" x="257" y="62" width="98" height="98" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.3 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter9_d_213_4345" x="349" y="62" width="98" height="98" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.3 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter10_d_213_4345" x="349" y="154" width="98" height="98" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.3 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter11_d_213_4345" x="165" y="62" width="98" height="98" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix"
                    values="0 0 0 0 0.0546262 0 0 0 0 0.0643322 0 0 0 0 0.122568 0 0 0 0.3 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
            </filter>
            <filter id="filter12_di_213_4345" x="242" y="591" width="21" height="21" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.105882 0 0 0 0 0.113725 0 0 0 0 0.160784 0 0 0 1 0" />
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_213_4345" />
            </filter>
            <filter id="filter13_di_213_4345" x="422" y="500" width="21" height="21" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.105882 0 0 0 0 0.113725 0 0 0 0 0.160784 0 0 0 1 0" />
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_213_4345" />
            </filter>
            <filter id="filter14_di_213_4345" x="152" y="230" width="21" height="21" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4345" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4345" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.105882 0 0 0 0 0.113725 0 0 0 0 0.160784 0 0 0 1 0" />
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_213_4345" />
            </filter>
            <linearGradient id="paint0_linear_213_4345" x1="71.5" y1="76" x2="71.5" y2="598"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_213_4345" x1="161.5" y1="24" x2="161.5" y2="645"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint2_linear_213_4345" x1="251.5" y1="2.18557e-08" x2="251.5" y2="668"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint3_linear_213_4345" x1="72" y1="148.5" x2="522" y2="148.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear_213_4345" x1="-4.37114e-08" y1="238.5" x2="564" y2="238.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear_213_4345" x1="-4.37114e-08" y1="328.5" x2="564" y2="328.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.2" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear_213_4345" x1="-4.37114e-08" y1="418.5" x2="564" y2="418.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.2" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint7_linear_213_4345" x1="72" y1="508.5" x2="521" y2="508.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint8_linear_213_4345" x1="162" y1="598.5" x2="432" y2="598.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.04" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint9_linear_213_4345" x1="162" y1="58.5" x2="432" y2="58.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint10_linear_213_4345" x1="341.5" y1="3" x2="341.5" y2="665"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint11_linear_213_4345" x1="431.5" y1="32" x2="431.5" y2="636"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint12_linear_213_4345" x1="521.5" y1="101" x2="521.5" y2="571"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.557692" stop-color="white" stop-opacity="0.1" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint13_linear_213_4345" x1="403.5" y1="249" x2="324" y2="345.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#024B27" />
                <stop offset="0.537391" stop-color="#727701" />
                <stop offset="1" stop-color="#1B1D29" />
            </linearGradient>
            <linearGradient id="paint14_linear_213_4345" x1="414.5" y1="244" x2="168" y2="491.5"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0.3" />
                <stop offset="1" stop-color="white" stop-opacity="0.05" />
            </linearGradient>
            <linearGradient id="paint15_linear_213_4345" x1="313.5" y1="350" x2="186" y2="480"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#1B1D29" />
                <stop offset="1" stop-color="white" stop-opacity="0.05" />
            </linearGradient>
            <linearGradient id="paint16_linear_213_4345" x1="295" y1="270.6" x2="295" y2="472.2"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#DCFC36" />
                <stop offset="0.793314" stop-color="#DCFC36" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint17_linear_213_4345" x1="295" y1="306" x2="295" y2="438"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F6FECD" />
                <stop offset="1" stop-color="#F6FECD" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint18_linear_213_4345" x1="295" y1="282.891" x2="295" y2="460.055"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#DCFC36" />
                <stop offset="0.793314" stop-color="#DCFC36" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint19_linear_213_4345" x1="295" y1="314" x2="295" y2="430"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F6FECD" />
                <stop offset="1" stop-color="#F6FECD" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint20_linear_213_4345" x1="295" y1="295.182" x2="295" y2="447.909"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#DCFC36" />
                <stop offset="0.793314" stop-color="#DCFC36" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint21_linear_213_4345" x1="295" y1="322" x2="295" y2="422"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F6FECD" />
                <stop offset="1" stop-color="#F6FECD" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint22_linear_213_4345" x1="295" y1="288.25" x2="295" y2="432.727"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#DCFC36" />
                <stop offset="0.869661" stop-color="#DCFC36" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint23_linear_213_4345" x1="295" y1="332" x2="295" y2="412"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F6FECD" />
                <stop offset="1" stop-color="#F6FECD" stop-opacity="0" />
            </linearGradient>
        </defs>
    </svg>
</template>

<style>
.gradient-rotator {
    transform-origin: 295px 370px;
    /* Approx center of the rectangle */
    animation: rotateGradient 5s linear infinite;
}

@keyframes rotateGradient {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>