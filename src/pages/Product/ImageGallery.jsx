import React, { useState } from "react";

const ImageGallery = ({ images = [], alt = "" }) => {
  const [active, setActive] = useState(0);
  const hasImages = images && images.length > 0;

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full h-[420px] bg-gray-50 border rounded-lg flex items-center justify-center overflow-hidden shadow-md">
        {hasImages ? (
          <img
            src={images[active]}
            alt={alt}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-gray-400 text-lg font-medium">No Image Available</div>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`relative min-w-[72px] h-[72px] border rounded-lg overflow-hidden transition-all duration-200 
              ${idx === active ? "ring-2 ring-blue-600 shadow-lg" : "hover:ring-2 hover:ring-blue-400"}`}
            >
              <img
                src={img}
                alt={`${alt}-${idx}`}
                className="w-full h-full object-cover"
              />
              {idx === active && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">Active</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
