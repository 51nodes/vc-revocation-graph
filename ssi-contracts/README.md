# SSI Contracts

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

This Repository deploys an Ethereum DID Registry contract for [ethr DID](https://github.com/uport-project/ethr-did), and a Revocation Registry Contract. There is also a script to deploy the contracts and execute example VC issuance and revocations.

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
* Copy the file `.env.example` and rename it to `.env` and then replace the placeholders
* Check if the requirement are fulfilled
* Check the configuration in `hardhat.config.js`
* Install dependences with `npm install`
* Compile contracts with `npx hardhat compile`
* Deploy the contracts, issue and revoke 3 credentials with `npx hardhat run scripts/deployIssueAndRevoke.ts --network goerli` the script will:
    * Deploy the `RevocationRegistry` for the revocation of verifiable credentials
    * Issuer 3 credentials by 3 different issuers
    * revoke the issued credentials by the issuers
    * In Background a `EthereumDidRegistry` contract is required for the DID resolver. We are using the already deployed contract `0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B` by the uport team to the Goerli network. A list of deployed EthereumDidRegistry on other networks can be found [here](https://github.com/uport-project/ethr-did-registry#contract-deployments)
* In case that the contracts are not verified on `Goerli` etherscan then you musst verify them either manually or using this [plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)
