# Image Upload System

This project now includes an enterprise-grade image upload and gallery system for managing banner images in blog posts.

## Features

### 🖼️ Image Gallery Component

- **Upload**: Drag & drop or click to upload images
- **Preview**: Click images for full-size preview
- **Selection**: Easy selection of banner images
- **Management**: Delete unwanted images
- **Responsive**: Works on all screen sizes

### 📁 File Processing

- **Automatic Resizing**: Images are resized to max 1920×1080
- **Format Optimization**: JPEG, PNG, WebP support with quality optimization
- **Thumbnail Generation**: Automatic 300×200 thumbnails for fast loading
- **File Validation**: Size limits (5MB max) and type checking
- **Unique Naming**: UUID-based filenames prevent conflicts

### 🚀 Performance Features

- **Sharp Processing**: Fast, memory-efficient image processing
- **CDN Ready**: File structure prepared for CDN integration
- **Caching**: Optimized for fast loading and performance
- **Progressive**: Progressive JPEG encoding for better perceived performance

## Usage

### Admin Dashboard

1. Navigate to `/admin/dashboard`
2. In the blog post form, find the "Banner Image" section
3. Click "🖼️ Select from Gallery" to open the gallery
4. Upload new images or select existing ones
5. Selected image will appear as banner in the form

### API Endpoints

- `POST /api/upload-image` - Upload or delete images
- `GET /api/upload-image` - List all gallery images

### File Structure

```
public/
  uploads/
    images/
      [timestamp]-[uuid].[ext]     # Original images
      thumb_[timestamp]-[uuid].jpg # Thumbnails
```

## Configuration

Edit `app/utils/upload.server.ts` to modify:

- Maximum file size (default: 5MB)
- Allowed file types
- Image dimensions
- Quality settings
- Upload directory

## Security

- File type validation
- Size limits
- Safe filename generation
- Server-side processing
- No direct file system access from client

## Future Enhancements

The system is designed to easily integrate with:

- **CDN Services** (Cloudinary, AWS S3, etc.)
- **Image Optimization Services**
- **Multiple Upload Directories**
- **User-specific Galleries**
- **Image Metadata Storage**

## Technical Stack

- **Sharp** - Image processing
- **UUID** - Unique filename generation
- **React** - Gallery UI components
- **Remix** - API routes and form handling
- **TypeScript** - Type safety throughout

This system follows enterprise standards for file handling, security, and performance.
