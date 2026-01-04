const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate the canvas context to the center of the image
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));

  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Draw the image
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Get the cropped image data
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  const oc = document.createElement("canvas");
  const octx = oc.getContext("2d");
  oc.width = 300;
  oc.height = 300;
  octx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 300, 300);
  return oc.toDataURL("image/jpeg");
}

export const generateCropFile = async (imageSrc, crop) => {
  if (!crop || !imageSrc) {
    return;
  }

  const canvas = await getCroppedImg(imageSrc, crop);
  return canvas;
};
