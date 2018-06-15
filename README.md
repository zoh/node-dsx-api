## Trade API for DSX.uk Exchange

### Install
`npm install dsx-api`
 
 
### Example use
``` 
import { DsxExchange } from "../api/index";

const dsx = new DsxExchange({
    verbose: true,
    secretKey: "...",
    apiKey: "..."
  });
(async () => {
    const res = await dsx.orderBook("BTCUSD");
    //...
})();
```

### Tech Detail
* Promises native support
* Public market data
* Reports and History
* Orders, place and cancel
* Client information
* Deposits, only transfer status


### License

MIT license 