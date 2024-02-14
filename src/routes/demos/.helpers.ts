import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import { browser } from '$app/env';
import type { Data } from '../../database/entities/data';

export const toFileList = async (file: Data | undefined) => {
  try {
    if (browser && file) {
      const response = await urlEncodedRequest(file.bits).get();
      const blob = await response.blob();
      const f = await new File([blob], file.name, { lastModified: file.lastModified, type: file.type });
      const container = new DataTransfer();
      container.items.add(f);
      return container.files;
    }
  } catch (e) {
    console.error(e);
  }
};
