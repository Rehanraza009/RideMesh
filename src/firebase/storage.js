// ==============================================================================
// FIREBASE STORAGE UTILITIES (IMAGE COMPRESSION & UPLOADS)
// ==============================================================================
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './config';

/**
 * Compresses an image file on the client before uploading to Firebase Storage.
 * Restricts max dimensions to 1200px and quality to 0.85 JPEG.
 */
export const compressImage = async (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve) => {
    // If not an image, return raw file
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * @param {string} path - Storage path e.g. 'users/uid/profile.jpg'
 * @param {File|Blob} file - File to upload
 * @param {function} onProgress - (progress: number) => void
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (path, file, onProgress = null) => {
  if (isFirebaseConfigured && storage) {
    const compressed = await compressImage(file);
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, compressed);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('[RideMesh Storage Error]:', error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  }

  // Graceful offline mock: simulate progress and return data URL
  if (onProgress) {
    onProgress(30);
    await new Promise(r => setTimeout(r, 200));
    onProgress(80);
    await new Promise(r => setTimeout(r, 200));
    onProgress(100);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
    reader.readAsDataURL(file);
  });
};
