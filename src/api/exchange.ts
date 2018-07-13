const crypto = require("crypto");
import * as _ from "lodash";
import * as request from "request-promise-native";
const qs = require("qs");

const dsxUrl = "https://dsx.uk";

const urls = {
  mapi: dsxUrl + "/mapi",
  tapi: dsxUrl + "/tapi/v2",
  dwapi: dsxUrl + "/dwapi/v2"
};

export type InitCfg = {
  apiKey?: string;
  secretKey?: string;
  verbose?: boolean;
  demo?: boolean;
};

export abstract class Exchange {
  protected apiKey: string;
  protected secret: string;
  protected verbose: boolean = false;

  constructor(cfg?: InitCfg) {
    if (cfg) {
      if (!cfg.secretKey) {
        throw "Not set secretKey";
      }
      this.apiKey = cfg.apiKey;
      this.secret = cfg.secretKey;
    }
  }

  hmac(data) {
    return crypto
      .createHmac("sha512", this.secret)
      .update(data)
      .digest("base64");
  }

  extractParams(string) {
    let re = /{([\w-]+)}/g;
    let matches = [];
    let match = re.exec(string);
    while (match) {
      matches.push(match[1]);
      match = re.exec(string);
    }
    return matches;
  }

  implodeParams(string, params) {
    for (let property in params)
      string = string.replace("{" + property + "}", params[property]);
    return string;
  }

  nonce() {
    return Date.now() + parseInt(String(Math.random() * 100000));
  }

  request(cfg: {
    url: string;
    method: string;
    body: any;
    headers?: Object;
  }): Promise<any> {
    const options = {
      method: cfg.method,
      uri: cfg.url,
      headers: cfg.headers,
      json: true,
      form: cfg.body
    };

    if (this.verbose) {
      console.log("dsx api request", options);
    }

    return request(options);
    // return rp(options);
  }

  urlencode(data) {
    return qs.stringify(data);
  }

  sign(
    path,
    api = "mapi",
    method = "GET",
    params = {},
    headers = undefined,
    body = undefined
  ) {
    let url = urls[api];
    let query = _.omit(params, this.extractParams(path));
    if (api == "tapi" || api === "dwapi") {
      url += "/" + this.implodeParams(path, params);
      let nonce = this.nonce();
      body = this.urlencode(
        _.extend(
          {
            nonce: nonce
          },
          query
        )
      );
      let signature = this.signBodyWithSecret(body);
      headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Key: this.apiKey,
        Sign: signature
      };
    } else {
      url += "/" + this.implodeParams(path, params);
      if (method === "GET") {
        if (Object.keys(query).length) {
          url += "?" + this.urlencode(query);
        }
      } else {
        if (Object.keys(query).length) {
          body = JSON.stringify(query);
          headers = {
            "Content-Type": "application/json"
          };
        }
      }
    }
    return { url: url, method: method, body: body, headers: headers };
  }

  protected signBodyWithSecret(body) {
    return this.hmac(body);
  }
}

export interface ErrorExchange extends Error {
  success: number;
  error: string;
}
