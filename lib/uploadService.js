// 'use server';

// import { writeFile } from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// export async function uploadFile(formData) {
//   try {
//     const file = formData.get('file');
    
//     if (!file) {
//       return { success: false, message: 'No file uploaded' };
//     }

//     // Get file extension
//     const originalName = file.name;
//     const fileExtension = path.extname(originalName);
    
//     // Generate unique filename
//     const uniqueFilename = `${uuidv4()}${fileExtension}`;
    
//     // Create buffer from file
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Define upload path - ensure this directory exists
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//     const filePath = path.join(uploadDir, uniqueFilename);
    
//     // Write file to disk
//     await writeFile(filePath, buffer);
    
//     // Return the relative path to be stored in the database
//     return { 
//       success: true, 
//       filePath: `/uploads/${uniqueFilename}`,
//       message: 'File uploaded successfully' 
//     };
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return { success: false, message: error.message };
//   }
// }
import cloudinary from './cloudinary';

export async function uploadFile(formData) {
  try {
    const file = formData.get('file'); // Expecting <input type="file" name="file">
    
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products', resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const uploadResult = await uploadPromise;

    return { success: true, url: uploadResult.secure_url };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return { success: false, message: 'Upload failed', error };
  }
}
