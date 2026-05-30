import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { logApiError } from '@/utils/errorLogger';

export async function POST(request: NextRequest) {
  try {
    const { selectedPageCodes, images, faceImages, itemName } =
      await request.json();

    if (
      !selectedPageCodes ||
      !Array.isArray(selectedPageCodes) ||
      selectedPageCodes.length === 0
    ) {
      return NextResponse.json(
        { error: "No images selected" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid images data" },
        { status: 400 }
      );
    }

    // Create a new zip file
    const zip = new JSZip();

    // Add face images to zip
    if (faceImages && Array.isArray(faceImages)) {
      console.log(`Found ${faceImages.length} face images to add`);
      for (let i = 0; i < faceImages.length; i++) {
        const faceImage = faceImages[i];
        // Skip webp images for now as they cause issues with JSZip
        const mimeType = faceImage.mime || "image/jpeg";

        let extension = "jpg";

        // Handle different MIME types
        if (mimeType.includes("png")) {
          extension = "png";
        } else if (mimeType.includes("gif")) {
          extension = "gif";
        } else if (mimeType.includes("jpeg")) {
          extension = "jpg";
        }

        const filename = `face_${i + 1}.${extension}`;

        try {
          const response = await fetch(faceImage.url);
          if (!response.ok) {
            console.warn(`Failed to fetch face image: ${faceImage.url}`);
            continue;
          }
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          console.log(`Adding face image to zip: ${filename}`);
          zip.file(filename, arrayBuffer);
        } catch (error) {
          logApiError({ error, context: `Error fetching face image ${faceImage.url}` });
          continue;
        }
      }
    } else {
      console.log("No face images provided or faceImages is not an array");
    }

    // Add selected base and final images to zip
    const selectedImages = images.filter((img) =>
      selectedPageCodes.includes(img.page_code)
    );

    for (const image of selectedImages) {
      // Add final image
      if (image.final_image_url) {
        try {
          const baseExtension =
            image.base_image_path.split(".").pop()?.toLowerCase() || "jpg";

          const baseFilename = `${image.page_code}_base.${baseExtension}`;
          const baseResponse = await fetch(image.base_image_path);
          if (baseResponse.ok) {
            const finalBlob = await baseResponse.blob();
            const finalArrayBuffer = await finalBlob.arrayBuffer();
            zip.file(baseFilename, finalArrayBuffer);
          }

          const finalExtension =
            image.final_image_url.split(".").pop()?.toLowerCase() || "jpg";

          const finalFilename = `${image.page_code}_final.${finalExtension}`;
          const finalResponse = await fetch(image.final_image_url);
          if (finalResponse.ok) {
            const finalBlob = await finalResponse.blob();
            const finalArrayBuffer = await finalBlob.arrayBuffer();
            zip.file(finalFilename, finalArrayBuffer);
          }
        } catch (error) {
          logApiError({ error, context: `Error fetching final image ${image.final_image_url}` });
        }
      }
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Convert blob to base64 for response
    const arrayBuffer = await zipBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Create filename
    const filename = `${
      itemName?.replace(/[^a-zA-Z0-9]/g, "_") || "images"
    }_images.zip`;

    return NextResponse.json({
      success: true,
      data: `data:application/zip;base64,${base64}`,
      filename,
    });
  } catch (error) {
    logApiError({ error, context: 'Failed to create zip file' });
    return NextResponse.json(
      { error: "Failed to create zip file" },
      { status: 500 }
    );
  }
}
