export interface UploadedFile {
  /** Стабильный идентификатор: имя + размер + дата изменения. */
  id: string;
  file: File;
  /** Object URL для превью; null для не-изображений. */
  previewUrl: string | null;
}
