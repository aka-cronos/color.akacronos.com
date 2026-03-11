declare module "apca-w3" {
  export function calcAPCA(textColor: unknown, bgColor: unknown): number;
  export function APCAcontrast(txtY: number, bgY: number, places?: number): number;
}
