const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

export const validateImageFile = (file: File | null) => {
  if (!file) return null;
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Image must be a JPEG, PNG, or WEBP file";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 5 MB or smaller";
  return null;
};

export const appendFileIfSelected = (formData: FormData, file: File | null) => {
  if (file) {
    formData.append("image", file);
  }
};
