import Loader from "@/app/_components/navigation/loader";
import { classNames } from "@/app/_utils/classNames";
import { Document, Page, Thumbnail, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ChartViewer({
  signedUrl,
  page_num,
}: {
  signedUrl: string;
  page_num: number;
}) {
  return (
    <Document
      file={signedUrl}
      loading={<Loader />}
      className="no-print flex w-full flex-1 flex-row justify-center bg-shade-overlay"
      externalLinkTarget="_blank"
    >
      <Thumbnail
        pageNumber={page_num}
        height={200}
        loading={<Loader />}
        className={classNames(
          "rounded-sm ring-2 ring-shade-overlay ring-offset-2 border border-shade-line"
        )}
      />
    </Document>
  );
}
