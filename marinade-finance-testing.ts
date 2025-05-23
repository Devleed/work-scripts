import { Marinade } from '@marinade.finance/marinade-ts-sdk';

const marinade = new Marinade();

const state = await marinade.getMarinadeState();

const data = state.state;
