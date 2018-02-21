
export interface QueuedHttpRequest {
    id?: number;
    url: string;
    method: string;
    payload: object;
}