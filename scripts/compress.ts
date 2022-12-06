import { createWriteStream } from 'fs';
import { zip } from 'compressing';

/**
 * 压缩目录或者文件
 * @param paths 目录或者文件的路径
 * @param destinationName 压缩产物的名称
 */
function zipDirsOrFile(paths: string[], destinationName = 'dist.zip') {
  const stream = new zip.Stream();

  paths.forEach(path => {
    stream.addEntry(path);
  });

  const destination = createWriteStream(destinationName);

  stream.pipe(destination);
}

zipDirsOrFile(['dist']);
