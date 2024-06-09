import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const emailState = atom({
  key: 'emailState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const jwtState = atom({
  key: 'jwtState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const modelState = atom({
  key: 'modelState',
  default: 'gpt-3.5-turbo',
  effects_UNSTABLE: [persistAtom],
});

export const modelOrg = selector({
  key: 'modelOrg',
  get: ({ get }) => {
    const model = get(modelState);
    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4o':
      case 'gpt-4':
      case 'gpt-4-turbo':
        return 'openai';
      default:
        return 'openai';
    }
  },
});

export const modelDisplayName = selector({
  key: 'modelDisplayName',
  get: ({ get }) => {
    const model = get(modelState);
    switch (model) {
      case 'gpt-3.5-turbo':
        return 'GPT-3.5 Turbo';
      case 'gpt-4o':
        return 'GPT-4o';
      case 'gpt-4':
        return 'GPT-4';
      case 'gpt-4-turbo':
        return 'GPT-4 Turbo';
      default:
        return 'GPT-3.5 Turbo';
    }
  },
});

export const tokenUsageState = atom({
  key: 'tokenUsageState',
  default: {
    pct: 0,
    limit: 0,
    actual: 0,
  },
  effects_UNSTABLE: [persistAtom],
});