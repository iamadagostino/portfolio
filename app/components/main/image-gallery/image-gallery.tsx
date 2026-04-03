import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import styles from './image-gallery.module.css';

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUploading(false);
      onImageUpload?.(data.file);
    } else if (data.error) {
      setUploadError(data.error);

      setUploading(false);
    }

    // Note: uploadFetcher.data is read-only from the hook; we don't attempt to mutate it.
  }, [uploadFetcher.state, uploadFetcher.data, onImageUpload]);

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
    <div className={`${styles.imageGallery} ${className}`}>
      {/* Upload Section */}
      {allowUpload && (!maxImages || images.length < maxImages) && (
        <div className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className={styles.fileInput}
            id="image-upload-input"
          />

          <label htmlFor="image-upload-input" className={`${styles.uploadLabel} ${uploading ? styles.uploading : ''}`}>
            {uploading ? '📤 Uploading...' : '📁 Upload Image'}
          </label>

          {maxImages && (
            <span className={styles.imageCount}>
              {images.length} / {maxImages} images
            </span>
          )}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && <div className={styles.uploadError}>❌ {uploadError}</div>}

      {/* Gallery Grid */}
      <div className={styles.galleryGrid}>
        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🖼️</div>
            <p className={styles.emptyStateText}>
              {allowUpload ? 'No images yet. Upload your first image!' : 'No images available.'}
            </p>
          </div>
        ) : (
          images.map((image) => (
            <div
              key={image.filename}
              className={`${styles.galleryItem} ${selectedImage === image.url ? styles.selected : ''}`}
              onMouseEnter={() => setPreviewImage(image.url)}
              onMouseLeave={() => setPreviewImage(null)}
            >
              {/* Main clickable area */}
              <button
                type="button"
                className={styles.galleryItemButton}
                onClick={() => onImageSelect(image.url)}
                aria-label={`Select image: ${image.originalName}`}
              >
                {/* Image */}
                <div
                  className={styles.galleryItemImage}
                  style={{ '--bg': `url(${getImageSrc(image)})` } as React.CSSProperties}
                >
                  {/* Selected Indicator */}
                  {selectedImage === image.url && <div className={styles.selectedIndicator}>✓</div>}
                </div>

                {/* Image Info */}
                <div className={styles.galleryItemInfo}>
                  <div className={styles.galleryItemName} title={image.originalName}>
                    {image.originalName}
                  </div>

                  <div className={styles.galleryItemMeta}>
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
                  className={styles.deleteButton}
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
          className={styles.previewModal}
          onClick={() => setPreviewImage(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setPreviewImage(null);
            }
          }}
          aria-label="Close image preview"
        >
          <img src={previewImage} alt="Preview" className={styles.previewImage} />
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
    <div className={`${styles.imageSelector} ${className}`}>
      {/* Selector Button */}
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={styles.selectorButton}>
        {selectedImageData ? (
          <>
            <img
              src={selectedImageData.thumbnailUrl || selectedImageData.url}
              alt={selectedImageData.originalName}
              className={styles.selectorButtonImage}
            />
            <span>{selectedImageData.originalName}</span>
          </>
        ) : (
          <span className={styles.selectorPlaceholder}>{placeholder}</span>
        )}

        <span className={styles.selectorArrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.selectorDropdown}>
          {images.length === 0 ? (
            <div className={styles.selectorEmpty}>No images available</div>
          ) : (
            images.map((image) => (
              <button
                key={image.filename}
                type="button"
                onClick={() => {
                  onImageSelect(image.url);
                  setIsOpen(false);
                }}
                className={`${styles.selectorOption} ${selectedImage === image.url ? styles.selected : ''}`}
              >
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.originalName}
                  className={styles.selectorOptionImage}
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
