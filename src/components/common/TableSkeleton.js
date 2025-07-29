"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// rowCount = কয়টি সারি দেখাতে চাও, colCount = কয়টি কলাম দেখাতে চাও
export default function TableSkeleton({ rowCount = 5, colCount = 5 }) {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {Array(colCount).fill(0).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <Skeleton height={20} width={`80%`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(rowCount).fill(0).map((_, index) => (
              <tr key={index}>
                {Array(colCount).fill(0).map((_, i) => (
                   <td key={i} className="px-6 py-4">
                     <Skeleton height={20} />
                   </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonTheme>
  );
}