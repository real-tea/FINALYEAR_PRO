"use client";
import {
  LinkIcon,
  EyeIcon,
  PresentationChartBarIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import Toggle from "@/app/_components/shared/buttons/toggle";
import Link from "next/link";
import IconButton from "@/app/_components/shared/buttons/iconButton";
import { useContext, useState } from "react";
import { DocumentType } from "@/types/documents.types";
import MediumButton from "@/app/_components/shared/buttons/mediumButton";
import EditLinkModal from "../[document_id]/(controls)/_components/editLinkModal";
import { ThumbnailImage } from "@/app/_components/shared/thumbnail";
import UploadDocumentModal from "./uploadDocument";
import PopOver from "@/app/_components/shared/popover";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { classNames } from "@/app/_utils/classNames";
import { DocumentsContext } from "./documentsProvider";

/*=========================================== MAIN COMPONENT FUNCTION ===========================================*/

const DocumentRow: React.FC<DocumentType> = (props) => {
  const { document_id, document_name, image, is_enabled, links } = props;

  const [isEnabled, setIsEnabled] = useState<boolean>(is_enabled);
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [showUpdateDocumentModal, setShowUpdateDocumentModal] = useState(false);

  const _documents = useContext(DocumentsContext);

  if (!_documents) throw Error("Error in fetching documents");

  const { setDocuments } = _documents;

  const router = useRouter();

  const active_links_count =
    links.filter((link) => link.is_active === true).length ?? 0;

  const total_links_count = links.length ?? 0;
  let total_views_count = 0;

  links.forEach((link) => {
    total_views_count += link.views.length ?? 0;
  });

  /* -------------------------------- FUNCTIONS ------------------------------- */

  // Optimistically set document on toggle
  const handleToggle = async (checked: boolean) => {
    setDocuments((prevDocuments: DocumentType[]) => {
      const newDocuments = prevDocuments;
      const index = newDocuments.findIndex(
        (document) => document.document_id === document_id
      );
      newDocuments[index].is_enabled = checked;
      return newDocuments;
    });
    return new Promise(async (resolve, reject) => {
      const res = fetch(`/api/documents/${props.document_id}`, {
        method: "PUT",
        body: JSON.stringify({
          is_enabled: checked,
        }),
      });

      res
        .then((res) => {
          if (res.ok) {
            resolve(res.status);
          }
        })
        .catch((err) => {
          reject(Error("Error updating doc status"));
          setDocuments((prevDocuments: DocumentType[]) => {
            const newDocuments = prevDocuments;
            const index = newDocuments.findIndex(
              (document) => document.document_id === document_id
            );
            newDocuments[index].is_enabled = !checked;
            return newDocuments;
          });
        });
    });
  };

  // Delete document and set after deletion
  const handleDelete = async () => {
    const deletePromise = new Promise(async (resolve, reject) => {
      const res = fetch(`/api/documents/${props.document_id}`, {
        method: "DELETE",
      });

      res
        .then((res) => {
          if (res.ok) {
            resolve(res.status);
            setDocuments((prevDocuments: DocumentType[]) => {
              let newDocuments = prevDocuments;
              const index = newDocuments.findIndex(
                (document) => document.document_id === document_id
              );
              newDocuments = newDocuments.filter((item, i) => i !== index);
              return newDocuments;
            });
            router.refresh();
          }
        })
        .catch((err) => {
          reject(Error("Error updating doc status"));
        });
    });

    toast.promise(deletePromise, {
      loading: "Deleting document...",
      success: "Successfully deleted document",
      error: "Error in deleting document. Please try again",
    });
  };

  /* --------------------------------- RENDER --------------------------------- */

  return (
    <li
      key={document_id}
      className="my-2 flex items-center justify-between space-x-4 rounded-md bg-white p-4 text-shade-pencil-black shadow-sm"
    >
      <div className="flex w-1/2 items-center space-x-4">
        <ThumbnailImage src={image} document_id={document_id} />
        <div className="flex flex-col space-y-2">
          <Link href={`/documents/${document_id}/links`}>
            <h4 className="w-full overflow-hidden text-base font-semibold hover:text-stratos-default hover:underline">
              {document_name}
            </h4>
          </Link>
          <div className="flex space-x-4">
            <MediumButton
              ButtonId={`${document_id}-links`}
              ButtonText={`${total_links_count} links`}
              ButtonIcon={LinkIcon}
              ButtonSize={3}
              ButtonHref={`/documents/${document_id}/links`}
            />
            <MediumButton
              ButtonId={`${document_id}-views`}
              ButtonText={`${total_views_count} views`}
              ButtonIcon={EyeIcon}
              ButtonSize={3}
              ButtonHref={`/documents/${document_id}/views`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-4">
        <button
          type="button"
          key={`${document_id}-newlink`}
          className={classNames(
            "flex shrink-0 items-center space-x-2 rounded-md border border-shade-line bg-white px-2  py-1 text-xs font-semibold text-shade-pencil-dark  hover:border-stratos-50 hover:bg-shade-overlay hover:text-stratos-default"
          )}
          onClick={() => setShowNewLinkModal(true)}
        >
          <LinkIcon className={`h-4 w-4`} aria-hidden="true" />
          <span className="">{"New Link"}</span>
        </button>
        <Toggle
          toggleId={`${document_id}-toggle`}
          SuccessToastText={
            isEnabled ? (
              <p>
                {document_name} is now{" "}
                {<span className="text-shade-pencil-light">DISABLED</span>}
              </p>
            ) : (
              <p>
                {document_name} is now{" "}
                {<span className="text-stratos-default">ENABLED</span>}
              </p>
            )
          }
          isChecked={isEnabled}
          setIsChecked={setIsEnabled}
          onToggle={handleToggle}
          EnabledHoverText="Disable all links"
          DisabledHoverText="Enable links"
          LoadingToastText={<p>Updating {document_name}...</p>}
          ErrorToastText={
            <p>Error in updating {document_name}. Please try again!</p>
          }
          Label={
            isEnabled
              ? `${active_links_count} links are enabled`
              : "All links are disabled"
          }
        />
        <div className="flex space-x-1">
          <Link href={`/preview/${document_id}`} target="_blank">
            <IconButton
              key={`${document_id}-preview`}
              ButtonId={`${document_id}-preview`}
              ButtonText={"Preview document"}
              ButtonIcon={PresentationChartBarIcon}
            />
          </Link>
          <IconButton
            key={`${document_id}-update`}
            ButtonId={`${document_id}-update`}
            ButtonText={"Update document"}
            ButtonIcon={DocumentArrowUpIcon}
            onClick={() => setShowUpdateDocumentModal(true)}
          />
          <PopOver
            options={[
              {
                name: "Edit",
                icon: PencilIcon,
                optionClick: () => {
                  router.push(`/documents/${document_id}`);
                },
              },
              {
                name: "Analytics",
                icon: ChartBarIcon,
                optionClick: () => {
                  router.push(`/documents/${document_id}/analytics`);
                },
              },
              {
                name: "Delete",
                icon: TrashIcon,
                optionClick: handleDelete,
                optionClassName: "text-red-500",
              },
            ]}
          />
        </div>
      </div>
      <EditLinkModal
        isOpen={showNewLinkModal}
        setIsOpen={setShowNewLinkModal}
        link_id={null}
        {...props}
      />
      <UploadDocumentModal
        isOpen={showUpdateDocumentModal}
        setIsOpen={setShowUpdateDocumentModal}
        document_id={document_id}
        document_name={document_name}
      />
    </li>
  );
};

export default DocumentRow;
