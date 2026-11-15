const MAX_SIDE = 1280;
const MAX_CHARACTERS = Math.ceil((2 * 1024 * 1024 * 4) / 3);
const QUALITY = 0.85;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    image.src = url;
  });
}

export async function readImageFile(file) {
  if (!file?.type?.startsWith('image/')) throw new Error('image');
  const { image, url } = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
  if (dataUrl.length > MAX_CHARACTERS) throw new Error('size');
  return dataUrl;
}