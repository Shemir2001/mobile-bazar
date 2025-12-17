// 'use client';

// export default function OrderSlipPage({ params }) {
//   const { orderId } = params;

//   return (
//     <div className="w-full h-screen">
//       <iframe
//         src={`/api/orders/${orderId}/slip`}
//         className="w-full h-full border"
//       />
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function OrderSlipPage() {
  const params = useParams();
  const orderId = params?.orderId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (orderId) {
      const url = `/api/orders/${orderId}/slip`;
      setPdfUrl(url);
      
      // Test if the API endpoint is accessible
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('PDF Load Error:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order slip...</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: Order ID not found</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Failed to load PDF</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="mb-2">Error: {error}</p>
                  <p className="mb-2">Order ID: {orderId}</p>
                  <p className="mb-4">API URL: {pdfUrl}</p>
                  <div className="space-y-2">
                    <p className="font-semibold">Troubleshooting steps:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Check if the API route exists at: app/api/orders/[orderId]/slip/route.js</li>
                      <li>Check the browser console for detailed errors</li>
                      <li>Try accessing the API directly: <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{pdfUrl}</a></li>
                      <li>Verify the order exists in the database</li>
                    </ol>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Order Slip</h1>
            <div className="flex gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg 
                  className="mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                  />
                </svg>
                Download PDF
              </a>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg 
                  className="mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                  />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}
            title="Order Slip PDF"
          />
        </div>
        
        {/* Fallback message */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">
            If the PDF doesn't display above, you can{' '}
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline hover:text-blue-800"
            >
              open it in a new tab
            </a>
            {' '}or use the Download button.
          </p>
        </div>
      </div>
    </div>
  );
}