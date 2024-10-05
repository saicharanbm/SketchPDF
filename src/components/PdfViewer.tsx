import React, { useRef, useEffect, useState } from "react";
import { getDocument } from "pdfjs-dist";
import { PdfViewerProps } from "../../utils/typesAndInterfaces";

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile }) => {
  const [pdf, setPdf] = useState<any>(null); // Store the PDF document
  const [numPages, setNumPages] = useState<number>(0); // Track the total number of pages
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Store a ref for the canvas
  const [zoom, setZoom] = useState<number>(1); // Track the current zoom level
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page

  // Load PDF file and set the number of pages
  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfFile) return;

      try {
        const loadingTask = getDocument({ url: pdfFile as string });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [pdfFile]);

  // Render the current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      try {
        const page = await pdf.getPage(currentPage);
        const scale = 2 * zoom; // Use a consistent scale for sharp rendering with zoom
        const viewport = page.getViewport({ scale });

        // Set canvas width and height scaled by the device pixel ratio
        const canvasWidth = viewport.width;
        const canvasHeight = viewport.height;
        const devicePixelRatio = window.devicePixelRatio || 1;

        canvas.width = canvasWidth * devicePixelRatio;
        canvas.height = canvasHeight * devicePixelRatio;

        // Set the canvas style to display the correct size (not zoomed)
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        // Scale the context to match the canvas scaling
        context.scale(devicePixelRatio, devicePixelRatio);

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Render the page with the given scale
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error(`Error rendering page ${currentPage}:`, error);
      }
    };

    renderPage();
  }, [pdf, currentPage, zoom]);

  // Zoom in handler
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 4)); // Set max zoom level to 4
  };

  // Zoom out handler
  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5)); // Set min zoom level to 0.5
  };

  // Handle Next Page button click
  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle Previous Page button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ccc",
        paddingTop: "20px",
      }}
    >
      {/* Zoom and page Controls */}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          textAlign: "center",
          width: "100%",
        }}
      >
        <button onClick={handlePreviousPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage >= numPages}>
          Next
        </button>
        <button onClick={handleZoomOut} disabled={zoom <= 0.5}>
          Zoom Out
        </button>
        <button onClick={handleZoomIn} disabled={zoom >= 4}>
          Zoom In
        </button>
        <span style={{ marginLeft: "20px" }}>Zoom: {zoom.toFixed(2)}x</span>
      </div>

      {/* Render the current page */}
      <div style={{ marginBottom: "20px" }}>
        <canvas ref={canvasRef} />
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: `${14 * zoom}px`, // Adjust text size based on zoom level
          }}
        >
          Page {currentPage} of {numPages}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
