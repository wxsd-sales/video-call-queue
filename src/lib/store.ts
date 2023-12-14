import { sessionStorage, storage } from './shared/storage';
import { StateKey } from './enums';

export const hideSIPWarningStore = sessionStorage<boolean>(StateKey.HIDE_SIP_WARNING);
export const previewedDemoStore = sessionStorage<unknown>(StateKey.PREVIEWED_DEMO);
export const formIsUnsavedStore = sessionStorage<unknown>(StateKey.FORM_IS_UNSAVED);
export const showUnsavedModal = storage<boolean>(StateKey.SHOW_UNSAVED_MODAL);
export const selectedDemoCardStore = storage<any>(StateKey.SELECTED_DEMO_CARD);
export const userIdStore = storage<string>(StateKey.USER_ID);
export const showErrorModalStore = storage<boolean>(StateKey.SHOW_ERROR_MODAL);
