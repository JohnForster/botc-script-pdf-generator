import { ComponentChildren } from "preact";
import "./PrintablePage.css";
import { PrintGuides } from "./PrintGuides";
import { PageDimensions } from "../types";

type PrintablePageProps = {
  children: ComponentChildren;
  dimensions: PageDimensions;
};

const PRINT_GUIDE_IMAGE_SIZE = 20; // in mm

export const PrintablePage = (props: PrintablePageProps) => {
  const { margin, bleed, width, height } = props.dimensions;
  return (
    <div
      className="printable-page"
      style={{
        "--page-width": width + "mm",
        "--page-height": height + "mm",
        "--print-margin": margin + "mm",
        "--print-bleed": bleed + "mm",
        "--print-guide-size": PRINT_GUIDE_IMAGE_SIZE + "mm",
      }}
    >
      {props.children}
      {(margin > 0 || bleed > 0) && (
        <>
          <PrintGuides dimensions={props.dimensions} position={"top-left"} />
          <PrintGuides dimensions={props.dimensions} position={"top-right"} />
          <PrintGuides dimensions={props.dimensions} position={"bottom-left"} />
          <PrintGuides
            dimensions={props.dimensions}
            position={"bottom-right"}
          />
        </>
      )}
    </div>
  );
};
