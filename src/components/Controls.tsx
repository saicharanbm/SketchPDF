import { ControlsProps } from "../../utils/typesAndInterfaces";

const Controls: React.FC<ControlsProps> = ({
  zoom,
  currentPage,
  numPages,
  handleNextPage,
  handlePreviousPage,
  handleZoomIn,
  handleZoomOut,
  downloadPDF,
}) => {
  return (
    <div className="controls-container">
      <div className="controls">
        <div className="page-controls">
          <button
            className="control-button"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentPage <= 1 ? "grey" : "#000000"}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <title>Previous Page</title>
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          {currentPage}/{numPages}
          <button
            className="control-button"
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentPage >= numPages ? "grey" : "#000000"}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <title>Next Page</title>

              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
        </div>
        <div className="zoom-controls">
          <button
            className="control-button"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 -0.5 21 21"
              version="1.1"
            >
              <title>zoom out</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-59.000000, -480.000000)"
                  fill={zoom <= 0.5 ? "grey" : "#000000"}
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M8.37269901,326.967331 L14.8199378,326.967331 C15.4130838,326.967331 15.8944776,327.416448 15.8944776,327.969825 C15.8944776,328.523201 15.4130838,328.972319 14.8199378,328.972319 L8.37269901,328.972319 C7.77955304,328.972319 7.29815921,328.523201 7.29815921,327.969825 C7.29815921,327.416448 7.77955304,326.967331 8.37269901,326.967331 L8.37269901,326.967331 Z M23.6848912,338.288493 C24.1050363,338.679465 24.1050363,339.315046 23.6848912,339.706019 L23.6848912,339.706019 C23.2647461,340.097994 22.5845624,340.097994 22.1654919,339.706019 L17.7888913,335.746169 L19.3082906,334.328642 L23.6848912,338.288493 Z M11.5963184,334.034912 C8.04174075,334.034912 5.14907961,331.337201 5.14907961,328.01995 C5.14907961,324.7037 8.04174075,322.004987 11.5963184,322.004987 C15.1508961,322.004987 18.0435572,324.7037 18.0435572,328.01995 C18.0435572,331.337201 15.1508961,334.034912 11.5963184,334.034912 L11.5963184,334.034912 Z M11.5963184,320 C6.84900157,320 3,323.590932 3,328.01995 C3,332.449969 6.84900157,336.039899 11.5963184,336.039899 C16.3436353,336.039899 20.1926368,332.449969 20.1926368,328.01995 C20.1926368,323.590932 16.3436353,320 11.5963184,320 L11.5963184,320 Z"
                      id="zoom out"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
          {zoom * 100}%
          <button
            className="control-button"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 -0.5 21 21"
              version="1.1"
            >
              <title>zoom in</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-379.000000, -440.000000)"
                  fill={zoom >= 2 ? "grey" : "#000000"}
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M332.449994,286.967331 L334.549993,286.967331 C335.129593,286.967331 335.599993,287.416448 335.599993,287.969825 C335.599993,288.523201 335.129593,288.972319 334.549993,288.972319 L332.449994,288.972319 L332.449994,290.977306 C332.449994,291.530683 331.979595,291.9798 331.399995,291.9798 C330.820395,291.9798 330.349996,291.530683 330.349996,290.977306 L330.349996,288.972319 L328.249997,288.972319 C327.670397,288.972319 327.199998,288.523201 327.199998,287.969825 C327.199998,287.416448 327.670397,286.967331 328.249997,286.967331 L330.349996,286.967331 L330.349996,284.962344 C330.349996,284.408967 330.820395,283.95985 331.399995,283.95985 C331.979595,283.95985 332.449994,284.408967 332.449994,284.962344 L332.449994,286.967331 Z M343.692338,299.706019 L343.692338,299.706019 C343.282838,300.097994 342.617138,300.097994 342.207639,299.706019 L338.060141,295.746169 L339.54484,294.328642 L343.692338,298.288493 C344.102887,298.679465 344.102887,299.315046 343.692338,299.706019 L343.692338,299.706019 Z M331.399995,294.034912 C327.926597,294.034912 325.099999,291.337201 325.099999,288.01995 C325.099999,284.7037 327.926597,282.004987 331.399995,282.004987 C334.873393,282.004987 337.699991,284.7037 337.699991,288.01995 C337.699991,291.337201 334.873393,294.034912 331.399995,294.034912 L331.399995,294.034912 Z M331.399995,280 C326.761098,280 323,283.590932 323,288.01995 C323,292.449969 326.761098,296.039899 331.399995,296.039899 C336.038892,296.039899 339.79999,292.449969 339.79999,288.01995 C339.79999,283.590932 336.038892,280 331.399995,280 L331.399995,280 Z"
                      id="zoom_in-[#1462]"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
        <div className="download">
          <button className="control-button" onClick={() => downloadPDF()}>
            <svg
              width={30}
              height={30}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <title>Download</title>
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fill="#000000"
                  fillRule="evenodd"
                  d="M11 2a1 1 0 10-2 0v7.74L5.173 6.26a1 1 0 10-1.346 1.48l5.5 5a1 1 0 001.346 0l5.5-5a1 1 0 00-1.346-1.48L11 9.74V2zm-7.895 9.204A1 1 0 001.5 12v3.867a2.018 2.018 0 002.227 2.002c1.424-.147 3.96-.369 6.273-.369 2.386 0 5.248.236 6.795.383a2.013 2.013 0 002.205-2V12a1 1 0 10-2 0v3.884l-13.895-4.68zm0 0L2.5 11l.605.204zm0 0l13.892 4.683a.019.019 0 01-.007.005h-.006c-1.558-.148-4.499-.392-6.984-.392-2.416 0-5.034.23-6.478.38h-.009a.026.026 0 01-.013-.011V12a.998.998 0 00-.394-.796z"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
