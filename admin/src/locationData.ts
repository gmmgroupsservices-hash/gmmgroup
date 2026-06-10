import { getAllStates, getDistricts } from "india-state-district";

const STATES = getAllStates();
const STATE_BY_CODE = new Map(STATES.map((state) => [state.code.toLowerCase(), state]));
const STATE_BY_NAME = new Map(STATES.map((state) => [state.name.toLowerCase(), state]));

export const INDIA_STATE_OPTIONS = STATES;

export const getStateCode = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return STATE_BY_CODE.get(normalized)?.code || STATE_BY_NAME.get(normalized)?.code || value.trim().toUpperCase();
};

export const getStateName = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return STATE_BY_CODE.get(normalized)?.name || STATE_BY_NAME.get(normalized)?.name || value;
};

export const getDistrictOptionsForState = (stateValue: string) => {
  const stateCode = getStateCode(stateValue);
  if (!stateCode) return [];
  return getDistricts(stateCode);
};
