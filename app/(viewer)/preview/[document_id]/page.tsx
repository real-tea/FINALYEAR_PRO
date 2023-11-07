import { Database } from "@/types/supabase.types";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentType } from "@/types/documents.types";
import ViewerTopBar from "../../d/[link_id]/_components/viewerTopbar";
import PDFViewerPage from "../../_components/pdf_viewer_page";
import PreviewTopBar from "./previewTopBar";
import InvalidLink from "../../d/[link_id]/_components/invalid_link";

export const revalidate = 0;

async function getSignedURL(document_id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: document_data, error: document_error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (document_error || !document_data || !document_data[0]) {
    return null;
  }

  const document_props = document_data[0];
  const document_version =
    document_props.versions.find((version) => version.is_enabled)
      ?.document_version ?? 0;

  const token =
    document_props.versions.find(
      (version) => version.document_version === document_version
    )?.token ?? "";

  const signed_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/documents/${document_id}/${document_version}.pdf?token=${token}`;

  return { signed_url, document_props };
}

export default async function InternalViewerPage({
  params: { document_id },
}: {
  params: { document_id: string };
}) {
  const props = await getSignedURL(document_id);

  return props ? (
    <main className="flex h-screen w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 w-full">
        <PreviewTopBar documentProps={props.document_props} />
      </div>
      <div className=" flex max-h-screen w-full flex-1 justify-center overflow-hidden">
        <PDFViewerPage signedURL={props.signed_url} />;
      </div>
    </main>
  ) : (
    <InvalidLink />
  );
}
