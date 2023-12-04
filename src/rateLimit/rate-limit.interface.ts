export interface IUpdateRateLimit {
  windowsMs: number;
  max: number;
  message: string;
}

export interface IRateLimit extends IUpdateRateLimit {
  id: number;
}
