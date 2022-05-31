# SSI Contracts

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

This Repository deploys a Ethereum DID Registry contract for ethr DID, and a Revocation Registry Contract. There is also a script to deploy and contract and execute example issuance and revocations.

## Revocation Process
To revoke a credential the issuer should calculate the keccak hash of the JWT (https://emn178.github.io/online-tools/keccak_256.html) and then send a transaction to the RevocationRegistry Contract. The Revocation contract emit the `Revoked` event which includes the address of the supposed issuer (msg.sender) and the hash of the revoked credential

### Requirements
* node version 16.14.2
* hardhat version 2.9.6
* solidity version 0.8.4
* 4 Accounts with test ether on `Goerli` testnet

### Run
* replace the place holders in `.env.example` and then copy the file and rename it to `.env`
* check if the requirement are verfilled
* check the configuration in `hardhat.config.js`
* install dependences `npm install`
* compile contracts with `npx hardhat compile`
* deploy the contracts, issue and revoke credentials with `npx hardhat run scripts/deploy.js`
    * Deploy the `EthereumDIDRegistry` for did management
    * Deploy the `RevocationRegistry` for revocation of verifiable credentials
    * Issuer 3 credentials from 3 different issuers
    * revoke 3 credentials by the issuers
