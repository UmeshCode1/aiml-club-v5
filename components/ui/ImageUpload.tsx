'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number;
}

export function ImageUpload({ 
  onUpload, 
  multiple = false, 
  maxSize = 5 * 1024 * 1024 
}: ImageUploadProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxSize,
    multiple,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles);
      }
    }
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-dark-border hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400 font-semibold">
            Drop the images here...
          </p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop images here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, WEBP up to {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </>
        )}
      </div>
      
      {fileRejections.length > 0 && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {file.name}: {errors.map(e => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
