import type { ActionFunctionArgs } from 'react-router';
import {
  processAndSaveImage,
  deleteImage,
  getGalleryImages,
  type UploadResult,
} from '~/services/upload.server';

/**
 * API Route for handling image uploads and management
 *
 * Supports:
 * - POST with intent=upload: Upload new image
 * - POST with intent=delete: Delete existing image
 * - GET: List all gallery images
 */

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const intent = formData.get('intent') as string;

    switch (intent) {
      case 'upload': {
        const imageFile = formData.get('image') as File;

        if (!imageFile || !(imageFile instanceof File)) {
          throw new Response(
            JSON.stringify({ success: false, error: 'No image file provided' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Process and save the image
        const result: UploadResult = await processAndSaveImage(imageFile);

        if (result.success) {
          return {
            success: true,
            file: result.file,
            message: 'Image uploaded successfully',
          };
        } else {
          throw new Response(
            JSON.stringify({ success: false, error: result.error || 'Upload failed' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      case 'delete': {
        const filename = formData.get('filename') as string;

        if (!filename) {
          throw new Response(
            JSON.stringify({ success: false, error: 'No filename provided' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const result = await deleteImage(filename);

        if (result.success) {
          return {
            success: true,
            message: 'Image deleted successfully',
          };
        } else {
          throw new Response(
            JSON.stringify({ success: false, error: result.error || 'Delete failed' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      default:
        throw new Response(JSON.stringify({ success: false, error: 'Invalid intent' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Upload API error:', error);

    // If it's already a Response, re-throw it
    if (error instanceof Response) {
      throw error;
    }

    throw new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET handler - return all gallery images
 */
export async function loader() {
  try {
    const images = await getGalleryImages();
    return {
      success: true,
      images,
    };
  } catch (error) {
    console.error('Gallery loader error:', error);
    throw new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load images',
        images: [],
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
