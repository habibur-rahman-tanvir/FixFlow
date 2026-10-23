import { fileURLToPath } from "url";
import { dirname } from "path";

const createESMContext = (meta: ImportMeta) => {
  const filename = fileURLToPath(meta.url);
  const dirname_ = dirname(filename);
  return {
    __filename: filename,
    __dirname: dirname_,
  };
};

const getESMPaths = (metaUrl: ImportMeta["url"]) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };
};

const esmDirname = (metaUrl: ImportMeta["url"]) =>
  dirname(fileURLToPath(metaUrl));

export { createESMContext, getESMPaths, esmDirname };
