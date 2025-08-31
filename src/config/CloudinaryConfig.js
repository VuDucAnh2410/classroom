export const uploadFileToCloudinary = async (file, folderName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'classroom'); // Thay bằng upload preset của bạn
  formData.append('cloud_name', 'ddn6jgagt'); // Thay bằng cloud name của bạn

  if (folderName) {
    formData.append('folder', folderName);
  }

  // Xác định loại file: ảnh hay file khác
  const isImage = file.type.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/ddn6jgagt/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url; // Trả về URL của file
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};