import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ONE, Ruling, STATUS_ERROR, TWO, ZERO } from "./constants";
import { Round } from "../generated/schema";
import * as ADDRESSES from "../config/addresses";

export function getLangFromAddress(address: Address): string {
  if (address.equals(Address.fromHexString(ADDRESSES.Linguo_de_en))) return "de|en";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_es))) return "en|es";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_fr))) return "en|fr";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_ja))) return "en|ja";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_ko))) return "en|ko";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_pt))) return "en|pt";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_ru))) return "en|ru";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_tr))) return "en|tr";
  else if (address.equals(Address.fromHexString(ADDRESSES.Linguo_en_zh))) return "en|zh";
  // Assemblyscript compiler yells if lang is null, so I set it to a special string instead
  else return "null";
}

export function createNewRound(roundId: string, taskId: string, timestamp: BigInt): Round {
  const newRound = new Round(roundId);

  newRound.task = taskId;
  newRound.hasPaidTranslator = false;
  newRound.hasPaidChallenger = false;
  newRound.amountPaidTranslator = ZERO;
  newRound.amountPaidChallenger = ZERO;
  newRound.feeRewards = ZERO;
  newRound.rulingTime = ZERO;
  newRound.ruling = getRuling(BigInt.fromI32(Ruling.None));
  newRound.creationTime = timestamp;
  newRound.numberOfContributions = ZERO;
  newRound.appealed = false;
  newRound.appealedAt = ZERO;
  newRound.appealPeriodStart = ZERO;
  newRound.appealPeriodEnd = ZERO;

  return newRound;
}

export function getRuling(ruling: BigInt): string {
  if (ruling.equals(ZERO)) return "None";
  if (ruling.equals(ONE)) return "Accept";
  if (ruling.equals(TWO)) return "Reject";
  return STATUS_ERROR;
}
