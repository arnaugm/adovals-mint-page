# Development setup

* From `adovals-smart-contract` project:
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

* Add three test wallets to MetaMask by importing the accounts, use the private key provided in the `npx hardhat node` command:
  * The contract owner address, account #0 in the list
  * One present in the allowlist in `src/allowlist.js` (addresses there are previously hashed with `keccak256`)
  * One not present in the allowlist


* Change MetaMask network to `Localhost 8545`


* Copy `artifacts` folder from `adovals-smart-contract` project after compilation into `src` folder of this project.


* Add the recently deployed contract address to `contractAddress` variable in `src/config.js` file.


* From this project root:
```bash
npm install
npm start
```

Alternatively use this command to avoid eslint blocking render:
```bash
DISABLE_ESLINT_PLUGIN=true npm start
```

* Open `http://localhost:3000`
