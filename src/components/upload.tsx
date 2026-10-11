import { useCallback, useRef, useState, type DragEvent, type FC } from 'react';
import { fileId, revokeUrls, toUploadedFile } from '@/helpers/upload';

export interface UploadedFile {
  /** Стабильный идентификатор: имя + размер + дата изменения. */
  id: string;
  file: File;
  /** Object URL для превью; null для не-изображений. */
  previewUrl: string | null;
}

interface UploadProps {
  className?: string;
  /** Допустимые MIME-типы, например `"image/*"`. По умолчанию `"image/*"`. */
  accept?: string;
  /** Максимальное количество файлов. По умолчанию `1`. */
  maxFiles?: number;
}

export const Upload: FC<UploadProps> = ({
  className,
  accept = 'image/*',
  maxFiles = 1
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const incomingArray = Array.from(incoming);

      setFiles((prev) => {
        const existingIds = new Set(prev.map((f) => f.id));
        const newEntries = incomingArray
          .filter((f) => !existingIds.has(fileId(f)))
          .map(toUploadedFile);

        const merged = [...prev, ...newEntries];

        if (merged.length > maxFiles) {
          revokeUrls(merged.slice(maxFiles));
          return merged.slice(0, maxFiles);
        }

        return merged;
      });
    },
    [maxFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        addFiles(e.target.files);
        e.target.value = '';
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const isAtLimit = files.length >= maxFiles;
  const isMultiple = maxFiles > 1;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={isMultiple}
        aria-hidden='true'
        tabIndex={-1}
        onChange={handleInputChange}
      />

      <div
        role='button'
        tabIndex={0}
        aria-label={`Загрузить файлы. Выбрано ${files.length} из ${maxFiles}`}
        aria-disabled={isAtLimit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={isAtLimit ? undefined : openFilePicker}
        onKeyDown={(e) => {
          if (!isAtLimit && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openFilePicker();
          }
        }}
      >
        {isAtLimit
          ? `Достигнут лимит (${maxFiles} файлов)`
          : isDragging
            ? 'Отпустите файлы здесь'
            : 'Перетащите файлы или нажмите для выбора'}
      </div>

      {files.length > 0 && (
        <ul
          role='list'
          aria-label='Загруженные файлы'
        >
          {files.map(({ id, file, previewUrl }) => (
            <li key={id}>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={file.name}
                  loading='lazy'
                />
              )}
              <span title={file.name}>{file.name}</span>
              <button
                type='button'
                aria-label={`Удалить ${file.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
