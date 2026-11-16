/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />

declare module "*.png?*" {
  const src: string;
  export default src;
}
