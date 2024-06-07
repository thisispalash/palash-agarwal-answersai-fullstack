import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const emailState = atom({
  key: 'emailState',
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