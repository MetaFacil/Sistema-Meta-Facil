'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image, Video, FileText, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  mimeType: string;
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  onFileRemoved: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  contentId?: string;
  maxFiles?: number;
}

export function FileUpload({ 
  onFileUploaded, 
  onFileRemoved, 
  uploadedFiles, 
  contentId,
  maxFiles = 5 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    for (const file of files) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Validações
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Máximo 50MB');
      return;
    }

    const tempId = Date.now().toString();
    setUploadingFiles(prev => [...prev, tempId]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (contentId) {
        formData.append('contentId', contentId);
      }

      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro no upload');
      }

      console.log('Arquivo carregado com sucesso:', result.file);
      onFileUploaded(result.file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploadingFiles(prev => prev.filter(id => id !== tempId));
    }
  };

  const removeFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/content/upload?id=${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao deletar arquivo');
      }

      onFileRemoved(fileId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erro ao deletar arquivo');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image size={16} />;
    if (mimeType.startsWith('video/')) return <Video size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Arraste arquivos aqui ou <span className="text-primary-600 hover:text-primary-700">clique para selecionar</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Suporta: JPG, PNG, GIF, WebP, MP4, MOV, AVI (máx. 50MB cada)
        </p>
        <p className="text-xs text-gray-500">
          Máximo {maxFiles} arquivos
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Loading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(tempId => (
            <div key={tempId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Loader2 size={16} className="animate-spin text-primary-500" />
              <span className="text-sm text-gray-600">Fazendo upload...</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Arquivos Anexados:</h4>
          {uploadedFiles.map(file => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.mimeType)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  <p className="text-xs text-gray-500">URL: {file.url}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.type === 'IMAGE' && (
                  <img
                    src={file.url.startsWith('http') ? file.url : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${file.url}`}
                    alt={file.filename}
                    className="w-10 h-10 object-cover rounded"
                    onError={(e) => {
                      console.error('Erro ao carregar miniatura:', file.url);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}