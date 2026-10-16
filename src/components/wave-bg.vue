<template>
  <div class="absolute inset-0 z-1 overflow-hidden">
    <div class="absolute -right-75 -top-225 lt-sm:(-right-25 -top-293)">
      <svg height="1337" width="1337">
        <defs>
          <path
            id="path-1"
            opacity="1"
            fill-rule="evenodd"
            d="M1337,668 C1337,1037 1037,1337 668,1337 C524,1337 337,1236 370,1094 C434,825 0,893 0,668 C0,300 300,0 668,0 C1037,0 1337,300 1337,668Z"
          />
          <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
            <stop offset="0" stop-opacity="1" class="top-start-color" />
            <stop offset="1" stop-opacity="1" class="top-end-color" />
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1" />
        </g>
      </svg>
    </div>
    <div class="absolute -bottom-100 -left-50 lt-sm:(-bottom-190 -left-25)">
      <svg height="896" width="968">
        <defs>
          <path
            id="path-2"
            opacity="1"
            fill-rule="evenodd"
            d="M896,448 C1143,466 695,896 448,896 C201,896 0,695 0,448 C0,201 201,0 448,0 C695,0 475,418 896,448Z"
          />
          <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stop-opacity="1" class="bottom-start-color" />
            <stop offset="1" stop-opacity="1" class="bottom-end-color" />
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.top-start-color {
  stop-color: hsl(var(--primary-200));
}
.dark .top-start-color {
  stop-color: hsl(var(--primary-300));
}
.top-end-color {
  stop-color: hsl(var(--primary-500));
}
.bottom-start-color {
  stop-color: hsl(var(--primary-500));
}
.bottom-end-color {
  stop-color: hsl(var(--primary-200));
}
.dark .bottom-end-color {
  stop-color: hsl(var(--primary-300));
}
</style>
