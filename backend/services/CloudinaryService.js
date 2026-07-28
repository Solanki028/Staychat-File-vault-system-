import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

class CloudinaryService {
  async uploadFile(filePath, folder = 'staychat_vault_documents') {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true
      });

      // Remove local disk temp file after upload to Cloudinary
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      };
    } catch (error) {
      // Fallback cleanup if error occurs
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (_) {}
      }
      throw error;
    }
  }

  async deleteFile(publicId) {
    try {
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    } catch (error) {
      console.error('Cloudinary deletion failed:', error.message);
    }
  }
}

export default new CloudinaryService();
