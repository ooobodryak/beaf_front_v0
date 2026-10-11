import type { UploadedFile } from '../types/upload';

/**
 * Возвращает стабильный идентификатор файла
 * на основе имени, размера и даты изменения.
 */
export const fileId = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

/**
 * Создаёт запись UploadedFile из нативного File.
 * Для изображений генерирует object URL для превью.
 */
export const toUploadedFile = (file: File): UploadedFile => ({
  id: fileId(file),
  file,
  previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
});

/**
 * Отзывает object URL у каждого файла в списке,
 * чтобы освободить память.
 */
export const revokeUrls = (files: UploadedFile[]): void => {
  files.forEach(({ previewUrl }) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
};
