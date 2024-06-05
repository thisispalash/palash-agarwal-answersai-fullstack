import { atom } from 'recoil';

const emailState = atom({
  key: 'email',
  default: '',
});