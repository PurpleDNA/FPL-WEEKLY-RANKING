// import React from "react";

const FPLSkeleton = ({ rows = 8 }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </th>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </th>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
              </th>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
              </th>
              <th className="px-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-4">
                  <div className="h-6 bg-gray-200 rounded w-8"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-8 mx-auto"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-16 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FPLSkeleton;
