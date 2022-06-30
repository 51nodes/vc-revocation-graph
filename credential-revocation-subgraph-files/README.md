# Crednetial Revocation Subgraph

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing permissions and limitations under the License.

A sample Subgraph to index events which are emitted when a credential is revoked by an issuer. This sample could be modified to implement complex entities and also index several events of related contracts like the EthereumDIDRegistry contract.

## Requirements

* graph cli version 0.30.1
* yarn version 1.22.17
* The deployment scripts from `./ssi-contracts` executed successfully and the address of the revocation registry contract and the issuers are available

## Setup and Deployment
 To keep it simple for the article we will deploy the subgraph on a hosted service. To deploy a subgraph on a hosted service you need first to sign in with github `https://thegraph.com/hosted-service/`. After that from the Dashboard a new Subgraph can be created with a click on `Add Subgraph` and adding a name e.g.`Credential Revocation Graph` and subtitle.

Now we are ready create our sample subgraph using the following steps:

* Create a new folder and open it with VSC.
* Open a new terminal and install the `graph cli` with `npm install -g @graphprotocol/graph-cli`
* Initialize a sample subgraph for the revocation smart contract `graph init --product hosted-service <Github-Name>/credential-revocation-graph` and give 
    * Protocol · ethereum
    * Subgraph name · <Github-Name>/credential-revocation-graph
    * Directory to create the subgraph in · credential-revocation-graph
    * Ethereum network · goerli
    * Contract address · <the-address-of-the-deplyoed-revocation-contract>
    * Fetching ABI from Etherscan (this works only if the contract is verified)
    * Contract Name · RevocationRegistry
* Navigate to the generated subgraph directory `cd credential-revocation-graph` and then run `yarn install`
* In the `subgraph.yaml` check the contract address and add the `startBlock` number at which the contract is deployed. this will make the synchronization much faster because the indexing will start from the given blocknumber and all other old blocks will be ignored.
  ```yaml
      source:
        address: "<the-address-of-revocation-contract>"
        abi: RevocationRegistry
        startBlock: <the-block-number>
  ```
* Replace the code in `schema.graphql`. For better readability we replaced `issuer` with `issuerAddress` and `digset` with `credentialHash`. We also added the blockNumber and timestamp as extra properties which could be useful for some verification DApps.

  ```graphql
  type RevokedCredential @entity {
    id: ID!
    issuerAddress: Bytes! # address
    credentialHash: Bytes! # bytes32
    blockNumber: BigInt!
    timestamp: BigInt!
  }
  ```
* Run `yarn codegen` to generate the related code for the new entity.
* Change the code under `src/revocation-registry.ts` replacing the import for `ExampleEntity` to `RevokedCredential` and the `handleRevoked` function with the below content to handle the emitted event and store it inside the entity. In this function we could also run a smart contract call request to get extra data from the contract if needed

  ```ts
  export function handleRevoked(event: Revoked): void {
    let entity = RevokedCredential.load(event.transaction.hash.toHex())
    if (!entity) {
      entity = new RevokedCredential(event.transaction.hash.toHex())
    }
    entity.issuerAddress = event.params.issuer
    entity.credentialHash = event.params.digest
    entity.blockNumber = event.block.number
    entity.timestamp = event.block.timestamp
    entity.save()
  }
  ```
* Run `yarn build` to compile and build the subgraph.
* The project struct should now look like this

  ![image](./img/project.png)

* Get the access token from the Dashboard and then run the auth command to be able to deploy the subgraph `graph auth --product hosted-service <access-token>`
* Deploy the subgraph `graph deploy --product hosted-service <Github-Name>/credential-revocation-graph`
* In the console you will get the following

  ![image](./img/deployed.png)
* Now we can query the index data open `https://api.thegraph.com/subgraphs/name/<github-name>/credential-revocation-graph` in the browser and run a query like the following to get the hashes of all credentials that are revoked by Issuer-A in `./ssi-contracts`

  ![image](./img/query.png)

  ```graphql
  query ExampleQuery {
    revokedCredentials(
      where: {issuerAddress: "0x8675c25a37349e74536659AC066A4F36CB5d1A75"}
    ) {
      id
      credentialHash
      timestamp
    }
  }
  ```
The result should contain one revoked credential, unless you modified the script in `./ssi-contract` or used an already existing contract for this query. You can also compare the results with the logged data of the executed script in `./ssi-contract`.