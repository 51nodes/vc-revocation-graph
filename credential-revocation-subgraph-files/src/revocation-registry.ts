import { BigInt } from "@graphprotocol/graph-ts"
import {
  Revoked
} from "../generated/RevocationRegistry/RevocationRegistry"
import { RevokedCredential } from "../generated/schema"

export function handleRevoked(event: Revoked): void {
  let entity = RevokedCredential.load(event.transaction.hash.toHex())
  if (!entity) {
    entity = new RevokedCredential(event.transaction.hash.toHex())
    entity.count = BigInt.fromI32(0)
  }
  entity.count = BigInt.fromI32(1).plus(entity.count)
  entity.issuerAddress = event.params.issuer
  entity.credentialHash = event.params.digest
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.save()
}
