import {Request} from "express";
import {extname} from "path";

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  const isMimeTypeAllowed = ['image/jpeg', 'image/png'].includes(file.mimetype);

  callback(null, isMimeTypeAllowed);
}

export const filenameGenerator = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const extension = extname(file.originalname);

  callback(null, `${uniqueSuffix}${extension}`);
}
