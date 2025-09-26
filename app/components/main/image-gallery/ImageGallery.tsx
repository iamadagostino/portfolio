import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';

/**
 * Image data structure
 */
export interface ImageData {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: string;
}

/**
 * Props for ImageGallery component
 */
interface ImageGalleryProps {
  images: ImageData[];
  selectedImage?: string;
  onImageSelect: (imageUrl: string) => void;
  onImageUpload?: (imageData: ImageData) => void;
  onImageDelete?: (filename: string) => void;
  allowUpload?: boolean;
  allowDelete?: boolean;
  maxImages?: number;
  className?: string;
}

/**
 * Image Gallery Component
 *
 * Enterprise-grade image gallery with upload, selection, and management features
 */
export function ImageGallery({
  images,
  selectedImage,
  onImageSelect,
  onImageUpload,
  onImageDelete,
  allowUpload = true,
  allowDelete = true,
  maxImages,
  className = '',
}: ImageGalleryProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFetcher = useFetcher<{
    success: boolean;
    error?: string;
    file?: ImageData;
  }>();

  /**
   * Handle file selection
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if we've reached max images
    if (maxImages && images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Reset previous error
    setUploadError(null);
    setUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('intent', 'upload');

      // Submit using fetcher
      uploadFetcher.submit(formData, {
        method: 'POST',
        action: '/api/upload-image',
        encType: 'multipart/form-data',
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle upload response in an effect to avoid running side-effects during render
  useEffect(() => {
    if (uploadFetcher.state !== 'idle' || !uploadFetcher.data) return;

    const data = uploadFetcher.data;

    if (data.success && data.file) {
      if (uploading) {
        setUploading(false);
        onImageUpload?.(data.file);
      }
    } else if (data.error) {
      if (uploading) {
        setUploadError(data.error);
        setUploading(false);
      }
    }

    // Note: uploadFetcher.data is read-only from the hook; we don't attempt to mutate it.
  }, [uploadFetcher.state, uploadFetcher.data, uploading, onImageUpload]);

  /**
   * Handle image deletion
   */
  const handleDeleteImage = async (filename: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('filename', filename);
      formData.append('intent', 'delete');

      uploadFetcher.submit(formData, {
        method: 'POST',
        action: '/api/upload-image',
      });

      onImageDelete?.(filename);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Get image display source (thumbnail if available, otherwise full image)
   */
  const getImageSrc = (image: ImageData): string => {
    return image.thumbnailUrl || image.url;
  };

  /**
   * Format date consistently to avoid hydration mismatches
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className={`image-gallery ${className}`}>
      {/* Upload Section */}
      {allowUpload && (!maxImages || images.length < maxImages) && (
        <div className="upload-section" style={{ marginBottom: '1rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
            id="image-upload-input"
          />

          <label
            htmlFor="image-upload-input"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: uploading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s',
            }}
          >
            {uploading ? '📤 Uploading...' : '📁 Upload Image'}
          </label>

          {maxImages && (
            <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>
              {images.length} / {maxImages} images
            </span>
          )}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          ❌ {uploadError}
        </div>
      )}

      {/* Gallery Grid */}
      <div
        className="gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {images.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              color: '#6c757d',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {allowUpload ? 'No images yet. Upload your first image!' : 'No images available.'}
            </p>
          </div>
        ) : (
          images.map((image) => (
            <div
              key={image.filename}
              className="gallery-item"
              style={{
                border: selectedImage === image.url ? '3px solid #007bff' : '1px solid #dee2e6',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={() => setPreviewImage(image.url)}
              onMouseLeave={() => setPreviewImage(null)}
            >
              {/* Main clickable area */}
              <button
                type="button"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
                onClick={() => onImageSelect(image.url)}
                aria-label={`Select image: ${image.originalName}`}
              >
                {/* Image */}
                <div
                  style={{
                    width: '100%',
                    height: '150px',
                    backgroundImage: `url(${getImageSrc(image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Selected Indicator */}
                  {selectedImage === image.url && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div style={{ padding: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={image.originalName}
                  >
                    {image.originalName}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#666' }}>
                    <div>{formatFileSize(image.size)}</div>
                    {image.dimensions && (
                      <div>
                        {image.dimensions.width} × {image.dimensions.height}
                      </div>
                    )}
                    <div>{formatDate(image.createdAt)}</div>
                  </div>
                </div>
              </button>

              {/* Delete Button - positioned absolutely to avoid nesting */}
              {allowDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.filename);
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(220, 53, 69, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                  title="Delete image"
                  aria-label={`Delete image: ${image.originalName}`}
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <button
          type="button"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            border: 'none',
            padding: 0,
          }}
          onClick={() => setPreviewImage(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setPreviewImage(null);
            }
          }}
          aria-label="Close image preview"
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </button>
      )}
    </div>
  );
}

/**
 * Simple Image Selector Component
 *
 * Lightweight component for just selecting from existing images
 */
interface ImageSelectorProps {
  images: ImageData[];
  selectedImage?: string;
  onImageSelect: (imageUrl: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImageSelector({
  images,
  selectedImage,
  onImageSelect,
  placeholder = 'Select an image...',
  className = '',
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedImageData = images.find((img) => img.url === selectedImage);

  return (
    <div className={`image-selector ${className}`} style={{ position: 'relative' }}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {selectedImageData ? (
          <>
            <img
              src={selectedImageData.thumbnailUrl || selectedImageData.url}
              alt={selectedImageData.originalName}
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <span>{selectedImageData.originalName}</span>
          </>
        ) : (
          <span style={{ color: '#999' }}>{placeholder}</span>
        )}

        <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {images.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>No images available</div>
          ) : (
            images.map((image) => (
              <button
                key={image.filename}
                type="button"
                onClick={() => {
                  onImageSelect(image.url);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: 'none',
                  backgroundColor: selectedImage === image.url ? '#f0f8ff' : 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.originalName}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <span>{image.originalName}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
