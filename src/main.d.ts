declare global {
    var Package: any;
}
interface MeteorConnectUserContextParams {
    authorizationHeaderName: string;
    user: boolean;
    fields: object | null;
}
declare const meteorConnectUserContext: (params: MeteorConnectUserContextParams) => (req: any, res: any, next: any) => Promise<void>;
export declare const meteorFetch: (url: string, options: any) => Promise<Response>;
export default meteorConnectUserContext;
