"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { ResultImage } from "@/types/order";
import { useOrderDetail } from "../context/OrderDetailContext";
import { FaceImage } from "@/types/cart";
import api from "@/utils/api";
import {
  API_ADMIN_ORDER_DOWNLOAD_IMAGES,
  API_ADMIN_ORDER_ITEM_UPLOAD_FINAL_IMAGE,
  API_ADMIN_ORDER_RETRY_FACE_SWAP,
} from "@/constants/api";
import { ApiResponse } from "@/types/api";
import Button from "@/app/components/Button";

interface ResultImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

const ResultImagesModal: FC<ResultImagesModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "full">("grid");
  const [selectedPageCodes, setSelectedPageCodes] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadingPageCode, setUploadingPageCode] = useState<string | null>(
    null
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const { handleManualConfirm, fetchOrderDetail, selectedItem } = useOrderDetail();
  const itemName = selectedItem?.sku_code || '';

  if (!isOpen) return null;

  const images: ResultImage[] = selectedItem?.result_images || [];
  const faceImages: FaceImage[] =
    selectedItem?.customization_data?.face_images || [];

  const handleConfirm = async () => {
    setIsConfirming(true);
    setConfirmError(null);
    try {
      await handleManualConfirm(selectedItem.id.toString());
    } catch (err: any) {
      const msg = err?.message || "Failed to confirm item";
      console.error("Error confirming item:", err);
      setConfirmError(msg);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleImageSelect = (pageCode: string) => {
    setSelectedPageCodes((prev) =>
      prev.includes(pageCode)
        ? prev.filter((code) => code !== pageCode)
        : [...prev, pageCode]
    );
  };

  const handleSelectAll = () => {
    if (selectedPageCodes.length === images.length) {
      setSelectedPageCodes([]);
    } else {
      setSelectedPageCodes(images.map((img) => img.page_code));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedPageCodes.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      setDownloadProgress(20);

      const response = await fetch(API_ADMIN_ORDER_DOWNLOAD_IMAGES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPageCodes,
          images,
          faceImages,
          itemName,
        }),
      });

      setDownloadProgress(50);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create zip file");
      }

      setDownloadProgress(80);

      // Create download link from base64 data
      const link = document.createElement("a");
      link.href = result.data;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadProgress(100);

      // Reset after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Failed to download images:", error);
      setIsDownloading(false);
      setDownloadProgress(0);
      alert("Failed to download images. Please try again.");
    }
  };

  const handleUploadFinalImage = async (pageCode: string, file: File) => {
    setUploadingPageCode(pageCode);
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get only the base64 string
          const base64String = result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Prepare the request body as JSON
      const requestBody = {
        images: [
          {
            page_code: pageCode,
            base64: base64,
          },
        ],
      };

      const { success, message } = await api.post<ApiResponse>(
        API_ADMIN_ORDER_ITEM_UPLOAD_FINAL_IMAGE(orderId, selectedItem.id),
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (success) {
        fetchOrderDetail(orderId);
        setUploadSuccess(message || 'Upload Image Successfully');
        setTimeout(() => setUploadSuccess(null), 3000);
      } else {
        alert(message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploadingPageCode(null);
  };

  const handleImageUploadClick = (pageCode: string) => {
    // Create a file input and trigger click
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleUploadFinalImage(pageCode, file);
      }
    };
    input.click();
  };

  const retryFaceswap = async (itemId: number) => {
    try {
      await api.post(API_ADMIN_ORDER_RETRY_FACE_SWAP(orderId), {
        item_id: itemId,
      });
      alert("Faceswap retry triggered successfully");
      fetchOrderDetail(orderId);
    } catch (error) {
      console.error("Failed to retry faceswap:", error);
      alert("Failed to retry faceswap. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-full bg-white rounded-lg overflow-hidden">
        {/* Header */}
        {confirmError && (
          <p className="text-sm text-red-600 ml-3">{confirmError}</p>
        )}
        {uploadSuccess && (
          <p className="text-sm text-green-600 ml-3">{uploadSuccess}</p>
        )}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Result Images - {itemName}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {selectedPageCodes.length === images.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              {selectedPageCodes.length > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedPageCodes.length} selected
                  </span>
                  <button
                    onClick={handleDownloadSelected}
                    disabled={isDownloading}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center space-x-1 disabled:bg-green-400 disabled:cursor-not-allowed relative"
                  >
                    {isDownloading && (
                      <div
                        className="absolute inset-0 bg-green-700 rounded-md"
                        style={{
                          width: `${downloadProgress}%`,
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    )}
                    <svg
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="relative z-10">
                      {isDownloading
                        ? `Download ZIP (${downloadProgress}%)`
                        : "Download ZIP"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "full" : "grid")}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title={`Switch to ${viewMode === "grid" ? "full" : "grid"} view`}
            >
              {viewMode === "grid" ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              )}
            </button>
            {(
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isConfirming ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto">
          {/* Face Images Section */}
          {faceImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Face Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {faceImages.map((faceImage: FaceImage, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={faceImage.url || "/placeholder-image.png"}
                        alt={`Face Image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 truncate">
                        {faceImage.original_name || `Face ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {faceImage.mime} •{" "}
                        {(faceImage.path?.length || 0) > 0
                          ? "Uploaded"
                          : "No path"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No result images available</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "space-y-3" : "space-y-4"}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`
                    rounded-lg overflow-hidden relative
                    ${
                      viewMode === "grid"
                        ? "bg-white border border-gray-200 p-4"
                        : "bg-white border border-gray-200"
                    }
                    ${
                      selectedPageCodes.includes(image.page_code)
                        ? "ring-2 ring-blue-500"
                        : ""
                    }
                  `}
                >
                  {viewMode === "grid" ? (
                    /* Grid Mode: One line layout with all info */
                    <div className="flex items-center space-x-4">
                      {/* Selection Checkbox */}
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedPageCodes.includes(image.page_code)}
                          onChange={() => handleImageSelect(image.page_code)}
                          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                      </div>

                      {/* Page Code */}
                      <div className="flex-shrink-0 w-30">
                        <span className="text-sm font-medium text-gray-900">
                          Page: {image.page_code}
                        </span>
                      </div>

                      {/* Base Image */}
                      <div className="flex-shrink-0 w-100">
                        <div className="relative aspect-[2/1]">
                          <Image
                            src={
                              image.base_image_path || "/placeholder-image.png"
                            }
                            alt={`Base Page ${image.page_code}`}
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Final Image */}
                      <div className="flex-shrink-0 w-100 relative group">
                        <div className="relative aspect-[2/1]">
                          <Image
                            src={
                              image.final_image_url || "/placeholder-image.png"
                            }
                            alt={`Final Page ${image.page_code}`}
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                          {/* Upload Button Overlay */}
                          <button
                            onClick={() =>
                              handleImageUploadClick(image.page_code)
                            }
                            disabled={uploadingPageCode === image.page_code}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            {uploadingPageCode === image.page_code ? (
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Index */}
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        #{index + 1}
                        <Button disabled={!image.can_refresh || image.is_refreshing} tl="Refresh" onClick={() => retryFaceswap(image.item_id)} />
                      </div>
                    </div>
                  ) : (
                    /* Full Mode: Original layout */
                    <>
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedPageCodes.includes(image.page_code)}
                          onChange={() => handleImageSelect(image.page_code)}
                          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                      </div>
                      <div
                        className="relative w-full group"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src={
                            image.final_image_url || "/placeholder-image.png"
                          }
                          alt={`Page ${image.page_code}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                        {/* Upload Button Overlay */}
                        <button
                          onClick={() =>
                            handleImageUploadClick(image.page_code)
                          }
                          disabled={uploadingPageCode === image.page_code}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {uploadingPageCode === image.page_code ? (
                            <svg
                              className="animate-spin h-8 w-8 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            Page: {image.page_code}
                          </span>
                          {viewMode === "full" && (
                            <span className="text-xs text-gray-500">
                              Image {index + 1} of {images.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultImagesModal;
