import React, { useRef, useEffect, useState, useCallback } from "react";
import { getDocument } from "pdfjs-dist";
import jsPDF from "jspdf";
import {
  CanvasDimension,
  PdfViewerProps,
  Tool,
  Element,
} from "../../utils/typesAndInterfaces";
import Controls from "./Controls";
import NavBar from "./NavBar";
import {
  drawRectangle,
  drawFreeStyle,
  drawLine,
  drawRhombus,
  drawCircle,
} from "../../utils/draw";
import { set } from "lodash";

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile, setPdfFile }) => {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const PdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [tool, setTool] = useState<Tool>("rectangle");
  const [zoom, setZoom] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const renderTaskRef = useRef<any>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimension>({
    width: 0,
    height: 0,
  });
  const [elements, setElements] = useState<{ [pageNumber: number]: Element[] }>(
    {}
  );
  const [tempElement, setTempElement] = useState<Partial<Element>>({});
  const [staticContext, setStaticContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [dynamicContext, setDynamicContext] =
    useState<CanvasRenderingContext2D | null>(null);
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
  const closeDocument = () => {
    setPdf(null);
    setNumPages(0);
    setElements({});
    setTempElement({});
    setPdfFile(null);
  };
  //set the dimentions of drawing canvas
  useEffect(() => {
    const staticContext = staticCanvasRef.current?.getContext("2d");
    const dynamicContext = dynamicCanvasRef.current?.getContext("2d");

    if (!(staticContext && dynamicContext)) return;
    setStaticContext(staticContext);
    setDynamicContext(dynamicContext);
    staticContext.canvas.width = canvasDimensions.width;
    staticContext.canvas.height = canvasDimensions.height;
    dynamicContext.canvas.width = canvasDimensions.width;
    dynamicContext.canvas.height = canvasDimensions.height;
  }, [canvasDimensions]);

  // Render the current page
  const renderPage = useCallback(
    async (pageNumber = currentPage) => {
      if (!pdf || !PdfCanvasRef.current) return;

      const context = PdfCanvasRef.current.getContext("2d");
      if (!context) return;

      try {
        const page = await pdf.getPage(pageNumber);
        const scale = 1.5 * zoom;
        const viewport = page.getViewport({ scale });

        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasWidth = viewport.width;
        const canvasHeight = viewport.height;
        setCanvasDimensions({ width: canvasWidth, height: canvasHeight });

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
    },
    [currentPage, pdf, zoom]
  );

  // Re-render on zoom/page changes
  useEffect(() => {
    renderPage();
  }, [pdf, currentPage, zoom, renderPage]);

  // Zoom controls
  const handleZoomIn = () =>
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 2));
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5));

  // draw elements on canvas
  const drawElement = useCallback(
    function (
      element: Element,
      context: CanvasRenderingContext2D,
      temp: boolean = false
    ) {
      if (!element.points || element.points.length === 0) return;
      context.save();
      context.beginPath();
      context.lineWidth = 2 * zoom;
      context.strokeStyle = "#000";

      const adjustedPoints = element.points.map((point) => ({
        x: point.x * zoom,
        y: point.y * zoom,
      }));

      switch (element.type) {
        case "pencil":
          drawFreeStyle({ ...element, points: adjustedPoints }, context, temp);
          break;
        case "rectangle": {
          if (adjustedPoints.length < 2) return;
          const [start, end] = adjustedPoints;
          drawRectangle(start, end, context);
          break;
        }
        case "line": {
          if (adjustedPoints.length < 2) return;
          const [lineStart, lineEnd] = adjustedPoints;
          drawLine(lineStart, lineEnd, context);
          break;
        }
        case "ellipse": {
          if (adjustedPoints.length < 2) return;
          const [start, end] = adjustedPoints;
          drawCircle(context, start, end);
          break;
        }
        case "rhombus": {
          if (adjustedPoints.length < 2) return;
          const [start, end] = adjustedPoints;
          drawRhombus(context, start, end);
          break;
        }
      }

      context.stroke();
      context.closePath();
      context.restore();
    },
    [zoom]
  );
  // Iterate over each page and combine pdfCanvas and static Canvas into a canvas Image
  const downloadPDF = async () => {
    if (!pdf) return;

    const doc = new jsPDF();
    const devicePixelRatio = window.devicePixelRatio || 1;

    for (let i = 1; i <= numPages; i++) {
      // Render the page
      const page = await pdf.getPage(i);
      const scale = 1.5 * zoom;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = viewport.width * devicePixelRatio;
      canvas.height = viewport.height * devicePixelRatio;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Draw annotations
      const pageElements = elements[i] || [];
      pageElements.forEach((element) => drawElement(element, context));

      // Add the page to the PDF
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      if (i > 1) {
        doc.addPage();
      }
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    // Save the final PDF
    doc.save("annotated.pdf");
  };

  useEffect(() => {
    if (!staticContext || !staticCanvasRef.current) return;

    const pageElements = elements[currentPage] || [];
    staticContext.clearRect(
      0,
      0,
      staticCanvasRef.current.width,
      staticCanvasRef.current.height
    );
    pageElements.forEach((element) => drawElement(element, staticContext));
  }, [
    staticContext,
    elements,
    currentPage,
    zoom,
    drawElement,
    canvasDimensions,
  ]);

  // Screen to world coordinates
  const screenToWorldCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | TouchEvent) => {
      const canvas = staticCanvasRef.current; // Assuming you want to get coordinates for the static canvas
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect(); // Get canvas position and size

      const x =
        (e instanceof TouchEvent
          ? e.changedTouches[0].clientX - rect.left
          : (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left) /
        zoom;
      const y =
        (e instanceof TouchEvent
          ? e.changedTouches[0].clientY - rect.top
          : (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top) /
        zoom;

      // Adjust for zoom level and canvas scale (if needed)
      return {
        x,
        y,
      };
    },
    [zoom]
  );

  //Handle mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | TouchEvent) => {
      setDrawing(true);

      const worldCoords = screenToWorldCoordinates(e);

      const newElement: Element = {
        id: Date.now(),
        type: tool,
        points: [worldCoords],
      };
      setTempElement(newElement);
      console.log(newElement);
    },
    [tool, screenToWorldCoordinates]
  );
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | TouchEvent) => {
      if (
        !drawing ||
        !tempElement.points ||
        !dynamicContext ||
        !dynamicCanvasRef.current
      )
        return;

      const worldCoords = screenToWorldCoordinates(e);
      const updatedElement = {
        ...tempElement,
        points:
          tempElement.type === "pencil"
            ? [...tempElement.points, worldCoords]
            : [tempElement.points[0], worldCoords],
      };
      setTempElement(updatedElement);

      if (tool !== "pencil") {
        dynamicContext.clearRect(
          0,
          0,
          dynamicCanvasRef.current.width,
          dynamicCanvasRef.current.height
        );
      }
      drawElement(updatedElement as Element, dynamicContext, true);
    },
    [
      drawing,
      tempElement,
      dynamicContext,
      drawElement,
      screenToWorldCoordinates,
      tool,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing || !tempElement.type || !tempElement.points) return;

    setDrawing(false);
    const newElement = tempElement as Element;
    if (newElement.points.length < 2) return;

    setElements((prevElements) => ({
      ...prevElements,
      [currentPage]: [...(prevElements[currentPage] || []), newElement],
    }));

    if (staticContext) {
      drawElement(newElement, staticContext);
    }

    // Clear the dynamic canvas after drawing the final element
    if (dynamicContext && dynamicCanvasRef.current) {
      dynamicContext.clearRect(
        0,
        0,
        dynamicCanvasRef.current.width,
        dynamicCanvasRef.current.height
      );
    }

    setTempElement({});
  }, [
    drawing,
    tempElement,
    staticContext,
    dynamicContext,
    currentPage,
    drawElement,
  ]);

  // Page controls
  const handleNextPage = () =>
    currentPage < numPages && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);
  useEffect(() => {
    const handleMouseDownEvent = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseDown(e as unknown as React.MouseEvent<HTMLCanvasElement>);
    };
    const handleMouseMoveEvent = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseMove(e as unknown as React.MouseEvent<HTMLCanvasElement>);
    };
    const handleMouseUpEvent = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseUp();
    };

    const handleTouchStartEvent = (e: TouchEvent) => {
      handleMouseDown(e);
    };
    const handleTouchMoveEvent = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseMove(e);
    };
    const handleTouchEndEvent = () => {
      handleMouseUp();
    };
    if (!staticCanvasRef.current) return;

    staticCanvasRef.current.addEventListener(
      "touchstart",
      handleTouchStartEvent,
      {
        passive: false,
      }
    );
    staticCanvasRef.current.addEventListener(
      "touchmove",
      handleTouchMoveEvent,
      {
        passive: false,
      }
    );
    staticCanvasRef.current.addEventListener("touchend", handleTouchEndEvent, {
      passive: false,
    });

    staticCanvasRef.current.addEventListener("mousedown", handleMouseDownEvent);
    staticCanvasRef.current.addEventListener("mousemove", handleMouseMoveEvent);
    staticCanvasRef.current.addEventListener("mouseup", handleMouseUpEvent);

    // Add wheel event listener for zooming

    return () => {
      if (!staticCanvasRef.current) return;
      staticCanvasRef.current.removeEventListener(
        "touchstart",
        handleTouchStartEvent
      );
      staticCanvasRef.current.removeEventListener(
        "touchmove",
        handleTouchMoveEvent
      );
      staticCanvasRef.current.removeEventListener(
        "touchend",
        handleTouchEndEvent
      );

      staticCanvasRef.current.removeEventListener(
        "mousedown",
        handleMouseDownEvent
      );
      staticCanvasRef.current.removeEventListener(
        "mousemove",
        handleMouseMoveEvent
      );
      staticCanvasRef.current.removeEventListener(
        "mouseup",
        handleMouseUpEvent
      );
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);
  return (
    <>
      <NavBar setTool={setTool} closeDocument={closeDocument} tool={tool} />

      <div className="canvas-container">
        <div className="canvas-wrapper">
          <canvas className="canvas" ref={PdfCanvasRef} />
          <canvas
            className="canvas canvas-overlay"
            ref={dynamicCanvasRef}
          ></canvas>
          <canvas
            className="canvas canvas-overlay"
            ref={staticCanvasRef}
          ></canvas>
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
        downloadPDF={downloadPDF}
      />
    </>
  );
};

export default PdfViewer;
