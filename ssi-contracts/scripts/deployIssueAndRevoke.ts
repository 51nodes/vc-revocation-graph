import { ethers } from 'hardhat';
import * as didVC from 'did-jwt-vc';
import { EthrDID } from 'ethr-did';

async function main() {

  const [holder, issuerA, issuerB, issuerC] = await ethers.getSigners();
 
  // the DID Registry Contract
  const addressOfDidRegistryContract = '0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B';
  console.log('The used Ethereum DID Registry contract is at address: ', addressOfDidRegistryContract);

  // Deploy Revocation Contract
  const RevocationRegistry = await ethers.getContractFactory('RevocationRegistry');
  const revocationRegistry = await RevocationRegistry.deploy();
  await revocationRegistry.deployed();
  console.log('The Revocation Registry contract deployed to: %s . This address is required for the Subgraph', revocationRegistry.address);

  // Issue crednetials (offchain)
  const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const holderDid = new EthrDID({
    identifier: holder.address,
    registry: addressOfDidRegistryContract,
    provider: provider,
    chainNameOrId: process.env.CHAIN_ID,
    alg: 'ES256K',
    privateKey: process.env.PRIVATE_KEY,
    txSigner: holder,
  });

  const didIssuerA = new EthrDID({
    identifier: issuerA.address,
    registry: addressOfDidRegistryContract,
    provider: provider,
    chainNameOrId: process.env.CHAIN_ID,
    alg: 'ES256K',
    privateKey: process.env.PRIVATE_KEY_ISSUER_A,
    txSigner: issuerA,
  }) as didVC.Issuer;

  const didIssuerB = new EthrDID({
    identifier: await issuerB.getAddress(),
    registry: addressOfDidRegistryContract,
    provider: provider,
    chainNameOrId: process.env.CHAIN_ID,
    alg: 'ES256K',
    privateKey: process.env.PRIVATE_KEY_ISSUER_B,
    txSigner: issuerB,
  }) as didVC.Issuer;

  const didIssuerC = new EthrDID({
    identifier: await issuerC.getAddress(),
    registry: addressOfDidRegistryContract,
    provider: provider,
    chainNameOrId: process.env.CHAIN_ID,
    alg: 'ES256K',
    privateKey: process.env.PRIVATE_KEY_ISSUER_C,
    txSigner: issuerC,
  }) as didVC.Issuer;


  // Revoke Crednetials

  // Credential from Issuer A
  const issuerACredentialJWT = await issueExampleJwtCredential(holderDid.did, didIssuerA);
  const hashOfIssuerACredential = ethers.utils.id(issuerACredentialJWT);
  console.log('Hash of Credential:', hashOfIssuerACredential , 'Issued by issuer A with Address: ' + issuerA.address);
  const revokeTx = await revocationRegistry.connect(issuerA).revoke(hashOfIssuerACredential);
  await revokeTx.wait();

  // Credential from Issuer B
  const issuerBCredentialJWT = await issueExampleJwtCredential(holderDid.did, didIssuerB);
  const hashOfIssuerBCredential = ethers.utils.id(issuerBCredentialJWT);
  console.log('Hash of Credential:', hashOfIssuerBCredential , 'Issued by issuer B with Address: ' + issuerB.address);
  const revokeIssuerBCredential = await revocationRegistry.connect(issuerB).revoke(hashOfIssuerBCredential);
  await revokeIssuerBCredential.wait();

  // Credential from Issuer C
  const issuerCCredentialJWT =  await issueExampleJwtCredential(holderDid.did, didIssuerC);;
  const hashOfIssuerCCredential = ethers.utils.id(issuerCCredentialJWT);
  console.log('Hash of Credential:', hashOfIssuerCCredential , 'Issued by issuer C with Address: ' + issuerC.address);
  const revokeIssuerCCredential = await revocationRegistry.connect(issuerC).revoke(hashOfIssuerCCredential);
  await revokeIssuerCCredential.wait();

}

async function issueExampleJwtCredential(didOfHolder: string, issuer: didVC.Issuer) {
  const vcPayload: didVC.JwtCredentialPayload = {
      iss: issuer.did,
      sub: didOfHolder,
      vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
          type: ['VerifiableCredential', 'BachelorDegree'],
          credentialSubject: {
            degree: 'Bachelor Of Arts'
          }
      }
  }
  return await didVC.createVerifiableCredentialJwt(vcPayload, issuer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
