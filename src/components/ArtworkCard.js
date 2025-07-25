"use client";

import React, { useState } from "react";
import Image from "next/image";
import ArtworkModal from "./common/ArtworkModal";

const ArtworkCard = ({ artwork, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const extractYear = (title) => {
    const yearMatch = title.match(/(\d{4})/);
    return yearMatch ? yearMatch[1] : null;
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${artwork.title}`);
    setImageLoaded(true);
  };

  const handleImageError = (error) => {
    console.error(`Image failed to load: ${artwork.title}`, error);
    console.error(`Original URL: ${artwork.url}`);
    console.error(`Converted URL: ${imageUrl}`);
    setImageError(true);
    setImageLoaded(true);
  };

  const getPlaceholderImage = (title) => {
    const colors = ["f0f9ff", "fef3c7", "fce7f3", "dcfce7", "fef2f2", "f3e8ff"];
    const color = colors[Math.abs(title.length) % colors.length];
    const size = "400x300";
    return `https://via.placeholder.com/${size}/${color}/666666?text=${encodeURIComponent(
      title
    )}`;
  };

  const getImageUrl = (url, title) => {
    if (url.includes("console.aws.amazon.com")) {
      return getPlaceholderImage(title);
    }
    return url;
  };

  const imageUrl = getImageUrl(artwork.url, artwork.title);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={(e) => {
          if (window.innerWidth < 768) {
            handleViewDetails(e);
          } else {
            onClick && onClick(e);
          }
        }}
      >
        {/* 이미지 컨테이너 */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Image not available</p>
                <p className="text-xs mt-1 text-gray-400">
                  Click to view details
                </p>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={artwork.title}
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          
          {/* 호버 오버레이 */}
          <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
            <button
              className="hidden md:block bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium focus:outline-none focus:ring-2"
              onClick={handleViewDetails}
              tabIndex={0}
            >
              View Details
            </button>
          </div>

          {/* 판매 상태 배지 */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                artwork.sold
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {artwork.sold ? "Sold" : "Available"}
            </span>
          </div>
        </div>

        {/* 작품 정보 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {artwork.title}
          </h3>

          {/* 연도 및 사이즈 표시 */}
          {(extractYear(artwork.title) || artwork.size) && (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {extractYear(artwork.title)}
              {artwork.size && (
                <>
                  <span className="mx-1">·</span>
                  <span>{artwork.size}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 전체 이미지 모달 */}
      <ArtworkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={artwork.url}
        title={artwork.title}
      />
    </>
  );
};

export default ArtworkCard;
