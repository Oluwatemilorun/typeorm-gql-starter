import { Constants } from '../constants';

export const generateFilePath = (idPath: string, folder = '') => {
  const paths = folder.split('/:id');
  const destFolder =
    paths.length === 0 && paths[0].length === 0
      ? `/${Constants.APP_NAME}`
      : paths.length === 0 && paths[0].length >= 1
      ? `/${Constants.APP_NAME}/${folder}`
      : paths.length >= 1 && paths[1].length === 0
      ? `/${Constants.APP_NAME}/${paths[0]}/${idPath}`
      : `/${Constants.APP_NAME}/${paths[0]}/${idPath}${paths[1]}`;

  return destFolder;
};
