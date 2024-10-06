import React, { useRef, useEffect, useState, useCallback } from "react";
import { getDocument } from "pdfjs-dist";
import { PdfViewerProps } from "../../utils/typesAndInterfaces";
import Controls from "./Controls";
import NavBar from "./NavBar";
import "pdfjs-dist/web/pdf_viewer.css";

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile }) => {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const PdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const renderTaskRef = useRef<any>(null);

  // Load the PDF file
  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfFile) return;
      try {
        const loadingTask = getDocument({ url: pdfFile });
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
  const renderPage = useCallback(async () => {
    if (!pdf || !PdfCanvasRef.current) return;

    const context = PdfCanvasRef.current.getContext("2d");
    if (!context) return;

    try {
      const page = await pdf.getPage(currentPage);
      const scale = 1.5 * zoom;
      const viewport = page.getViewport({ scale });

      const devicePixelRatio = window.devicePixelRatio || 1;
      const canvasWidth = viewport.width;
      const canvasHeight = viewport.height;

      // Set canvas dimensions to account for device pixel ratio
      PdfCanvasRef.current.width = canvasWidth * devicePixelRatio;
      PdfCanvasRef.current.height = canvasHeight * devicePixelRatio;

      // Set CSS width and height for rendering
      PdfCanvasRef.current.style.width = `${canvasWidth}px`;
      PdfCanvasRef.current.style.height = `${canvasHeight}px`;

      // Increase the resolution of the image
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(
        0,
        0,
        PdfCanvasRef.current.width,
        PdfCanvasRef.current.height
      ); // Clear the canvas

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Cancel any previous render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      // Start the new render task
      renderTaskRef.current = page.render(renderContext);

      // Wait for the rendering to finish
      await renderTaskRef.current.promise;
    } catch (error: any) {
      if (error.name === "RenderingCancelledException") {
        console.log(`Rendering cancelled for page ${currentPage}`);
      } else {
        console.error(`Error rendering page ${currentPage}:`, error);
      }
    }
  }, [currentPage, pdf, zoom]);

  // Re-render on zoom/page changes
  useEffect(() => {
    renderPage();
  }, [pdf, currentPage, zoom, renderPage]);

  // Zoom controls
  const handleZoomIn = () =>
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 2));
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5));

  // Page controls
  const handleNextPage = () =>
    currentPage < numPages && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <>
      <NavBar />

      <div className="canvas-container">
        <div className="canvas-wrapper">
          <canvas className="canvas" ref={PdfCanvasRef} />

          <canvas className="canvas canvas-overlay"></canvas>
        </div>
      </div>

      <Controls
        zoom={zoom}
        numPages={numPages}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />
    </>
  );
};

export default PdfViewer;
