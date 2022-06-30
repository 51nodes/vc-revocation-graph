# SSI Contracts

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing permissions and limitations under the License.

This repository contains a Revocation Registry Contract. There is also a script to deploy the contract and execute example VC issuance and revocations.

## Revocation Process
To revoke a verifiable credential the issuer must calculate the keccak hash of the JWT-Credential e.g. using [this](https://emn178.github.io/online-tools/keccak_256.html) and then send a transaction to the RevocationRegistry Contract. The Revocation Contract will then emit the `Revoked` event that includes the address of the supposed issuer (msg.sender) and the hash of the revoked credential.

### Requirements
* node version 16.14.2
* hardhat version 2.9.6
* solidity version 0.8.4
* 4 Accounts with test ether on `Goerli` testnet
* Etherscan Account and API Key
* Alchemy/Infura (or similar) Account for Testnet Access

### Setup and Run
* Copy the file `.env.example` to `.env` and replace the placeholders
* Install dependencies with `npm install`
* Compile contracts with `npx hardhat compile`
* Deploy the contracts, issue and revoke 3 credentials with `npx hardhat run scripts/deployIssueAndRevoke.ts --network goerli`. The script will:
    * Deploy the `RevocationRegistry` for the revocation of verifiable credentials
    * Issue 3 credentials by 3 different issuers
    * Revoke the issued credentials by the issuers
    * In Background a `EthereumDidRegistry` contract is required for the DID resolver. We are using the already deployed contract `0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B` by the uport team on Goerli network. A list of deployed EthereumDidRegistry on other networks can be found [here](https://github.com/uport-project/ethr-did-registry#contract-deployments)
* In case that the contracts are not verified on `Goerli` Etherscan, verify them either manually or use [this plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)
