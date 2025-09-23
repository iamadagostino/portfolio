import { writeFile, readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

/**
 * Configuration for image uploads
 */
export const UPLOAD_CONFIG = {
  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024,

  // Allowed image types
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],

  // Upload directory (relative to public)
  uploadDir: 'uploads/images',

  // Image processing options
  processing: {
    // Maximum dimensions
    maxWidth: 1920,
    maxHeight: 1080,

    // Thumbnail dimensions
    thumbnailWidth: 300,
    thumbnailHeight: 200,

    // Quality settings
    quality: {
      jpeg: 85,
      webp: 85,
      png: 9, // compression level 0-9
    },
  },
} as const;

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

/**
 * Upload result
 */
export interface UploadResult {
  success: boolean;
  error?: string;
  file?: {
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
  };
}

/**
 * Gallery image info
 */
export interface GalleryImage {
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
  createdAt: Date;
}

/**
 * Validate uploaded file
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${Math.round(
        UPLOAD_CONFIG.maxFileSize / 1024 / 1024
      )}MB`,
    };
  }

  // Check file type
  if (
    !UPLOAD_CONFIG.allowedTypes.includes(
      file.type as (typeof UPLOAD_CONFIG.allowedTypes)[number]
    )
  ) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${UPLOAD_CONFIG.allowedTypes.join(
        ', '
      )}`,
    };
  }

  // Check if file has content
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty',
    };
  }

  return {
    isValid: true,
    file,
  };
}

/**
 * Generate unique filename
 */
export function generateFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase();
  const uuid = uuidv4();
  const timestamp = Date.now();
  return `${timestamp}-${uuid}${ext}`;
}

/**
 * Get upload directory path
 */
export function getUploadPath(): string {
  return join(process.cwd(), 'public', UPLOAD_CONFIG.uploadDir);
}

/**
 * Get public URL for uploaded file
 */
export function getPublicUrl(filename: string): string {
  return `/${UPLOAD_CONFIG.uploadDir}/${filename}`;
}

/**
 * Process and save uploaded image
 */
export async function processAndSaveImage(file: File): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate filename
    const filename = generateFilename(file.name);
    const uploadPath = getUploadPath();
    const filePath = join(uploadPath, filename);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with Sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let processedBuffer = buffer;
    let shouldResize = false;

    // Check if image needs resizing
    if (metadata.width && metadata.height) {
      if (
        metadata.width > UPLOAD_CONFIG.processing.maxWidth ||
        metadata.height > UPLOAD_CONFIG.processing.maxHeight
      ) {
        shouldResize = true;
      }
    }

    // Process the image
    let processedImage = image;

    if (shouldResize) {
      processedImage = processedImage.resize(
        UPLOAD_CONFIG.processing.maxWidth,
        UPLOAD_CONFIG.processing.maxHeight,
        {
          fit: 'inside',
          withoutEnlargement: true,
        }
      );
    }

    // Apply format-specific optimizations
    switch (file.type) {
      case 'image/jpeg':
      case 'image/jpg':
        processedImage = processedImage.jpeg({
          quality: UPLOAD_CONFIG.processing.quality.jpeg,
          progressive: true,
        });
        break;
      case 'image/png':
        processedImage = processedImage.png({
          compressionLevel: UPLOAD_CONFIG.processing.quality.png,
          progressive: true,
        });
        break;
      case 'image/webp':
        processedImage = processedImage.webp({
          quality: UPLOAD_CONFIG.processing.quality.webp,
        });
        break;
    }

    processedBuffer = Buffer.from(await processedImage.toBuffer());

    // Get final metadata
    const finalMetadata = await sharp(processedBuffer).metadata();

    // Save processed image
    await writeFile(filePath, processedBuffer);

    // Generate thumbnail (optional)
    let thumbnailUrl: string | undefined;
    if (file.type !== 'image/gif') {
      // Skip thumbnails for GIFs
      const thumbnailFilename = `thumb_${filename}`;
      const thumbnailPath = join(uploadPath, thumbnailFilename);

      const thumbnailBuffer = await sharp(processedBuffer)
        .resize(
          UPLOAD_CONFIG.processing.thumbnailWidth,
          UPLOAD_CONFIG.processing.thumbnailHeight,
          {
            fit: 'cover',
            position: 'center',
          }
        )
        .jpeg({ quality: 80 })
        .toBuffer();

      await writeFile(thumbnailPath, thumbnailBuffer);
      thumbnailUrl = getPublicUrl(thumbnailFilename);
    }

    return {
      success: true,
      file: {
        filename,
        originalName: file.name,
        size: processedBuffer.length,
        mimeType: file.type,
        url: getPublicUrl(filename),
        thumbnailUrl,
        dimensions: {
          width: finalMetadata.width || 0,
          height: finalMetadata.height || 0,
        },
      },
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image',
    };
  }
}

/**
 * Get all images in gallery
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const uploadPath = getUploadPath();
    const files = await readdir(uploadPath);

    // Filter out thumbnails and get only main images
    const imageFiles = files.filter(
      file =>
        !file.startsWith('thumb_') &&
        UPLOAD_CONFIG.allowedTypes.some(type =>
          file.toLowerCase().endsWith(type.split('/')[1])
        )
    );

    const images: GalleryImage[] = [];

    for (const file of imageFiles) {
      try {
        const filePath = join(uploadPath, file);
        const stats = await stat(filePath);

        // Try to get image metadata
        let dimensions: { width: number; height: number } | undefined;
        let mimeType = 'image/jpeg'; // default

        try {
          const metadata = await sharp(filePath).metadata();
          dimensions = {
            width: metadata.width || 0,
            height: metadata.height || 0,
          };

          // Determine mime type from format
          switch (metadata.format) {
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
            case 'gif':
              mimeType = 'image/gif';
              break;
          }
        } catch (sharpError) {
          // If Sharp can't read it, skip metadata
          console.warn(`Could not read metadata for ${file}:`, sharpError);
        }

        const thumbnailFile = `thumb_${file}`;
        const thumbnailPath = join(uploadPath, thumbnailFile);
        let thumbnailUrl: string | undefined;

        try {
          await stat(thumbnailPath);
          thumbnailUrl = getPublicUrl(thumbnailFile);
        } catch {
          // No thumbnail exists
        }

        images.push({
          filename: file,
          originalName: file, // We don't store original names, use filename
          size: stats.size,
          mimeType,
          url: getPublicUrl(file),
          thumbnailUrl,
          dimensions,
          createdAt: stats.birthtime,
        });
      } catch (error) {
        console.warn(`Error processing file ${file}:`, error);
      }
    }

    // Sort by creation date (newest first)
    return images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting gallery images:', error);
    return [];
  }
}

/**
 * Delete image and its thumbnail
 */
export async function deleteImage(
  filename: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const uploadPath = getUploadPath();
    const filePath = join(uploadPath, filename);
    const thumbnailPath = join(uploadPath, `thumb_${filename}`);

    // Delete main image
    await unlink(filePath);

    // Delete thumbnail if it exists
    try {
      await unlink(thumbnailPath);
    } catch {
      // Thumbnail might not exist, that's okay
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
}

/**
 * Clean filename for safe usage
 */
export function cleanFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}
