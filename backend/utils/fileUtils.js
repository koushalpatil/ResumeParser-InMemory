import fs from "fs/promises";

export const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} deleted successfully`);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};

export const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
