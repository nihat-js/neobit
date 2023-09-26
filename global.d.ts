//  interface
declare interface IRes {
  send: (data: string) => void
  sendFile: (filePath: string) => void,
  setStatusCode : (code : number) => any
  setHeader : (a : string , b:string) => void
}


declare interface IReq {
  method: string,
  queries : {
    [key : string ]: string
  },
  params : {
    [key : string] : string
  }
}


declare interface IApiBuilderFromArray {
  arr : [],
  prefix : string,
  name : string,
}

type  MiddlewareFunction = (request? : IReq , response? : IRes , next? : (i:number ,lastI : number) => {}  )  => any

declare interface  IEndPoints {
  method: "GET" | "POST" | "UPDATE" | 'PATCH' | 'DELETE' | "PUT",
  url: string,
  cb: ReqResFunction,
  middlewares :  MiddlewareFunction[]
}
type ReqResFunction = (request?: IReq, response?: IRes) => void


declare module "neobit" {
  class INeobit {
    constructor(isDebugging?: boolean);
    private port;
    private isDebugging;
    private urlPrefix;
    private endPoints;
    buildApiFromObject({ data }: {
        data: any;
    }): void;
    buildApiFromJson({ data }: {
        data: any;
    }): void;
    createTemplateData({ templateName, override, destination }: {
        templateName?: string;
        override?: boolean;
        destination: any;
    }): Promise<void>;
    get(url: string, cb: ReqResFunction): void;
    post(url: string, cb: ReqResFunction): void;
    delete(url: any, cb: ReqResFunction): void;
    put(url: string, cb: ReqResFunction): void;
    patch(url: string, cb: ReqResFunction): void;
    getFinalUrl(url: any): string;
    group(url: any, cb: any): void;
    listen(port: any): void;
    getSampleObject(name?: string): Promise<any>;
  }
}
