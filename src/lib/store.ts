import { sessionStorage, storage } from './shared/storage';
import { StateKey } from './enums';

export const previewedDemoStore = sessionStorage<unknown>(StateKey.PREVIEWED_DEMO);
export const formIsChangedStore = sessionStorage<unknown>(StateKey.FORM_IS_UNSAVED);
export const showDraftModal = storage<boolean>(StateKey.SHOW_UNSAVED_MODAL);
export const selectedDemoCardStore = storage<any>(StateKey.SELECTED_DEMO_CARD);
export const userIdStore = storage<string>(StateKey.USER_ID);
export const showErrorModalStore = storage<boolean>(StateKey.SHOW_ERROR_MODAL);
export const formStore = storage<any>(StateKey.FORM);
export const targetDemoId = storage<string>(StateKey.TARGET_DEMO_ID);
export const demoIsLoading = storage<boolean>(StateKey.DEMO_IS_LOADING);
