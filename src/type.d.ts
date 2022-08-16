import { NIM } from '@/3rd/NIM_Web_SDK_v8.9.100'

declare global {
  interface Window {
    NIM: typeof NIM
    nim: InstanceType<typeof NIM> | null
  }
}

declare module '*.css'
declare module '*.less'
declare module '*.png'
