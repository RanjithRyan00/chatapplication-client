import React from "react";
import { Document, Page } from "react-pdf";
import { PDFViewer } from '@react-pdf/renderer';

function MessageSelf({ props }) {
  console.log("Props:", props);

  const getFileType = (url) => {
    if (!url) {
      return null;
    }
    if (url.startsWith("data:application/pdf")) {
      return "pdf";
    } else if (
      url.startsWith("data:image/jpeg") ||
      url.startsWith("data:image/png")
    ) {
      return "image";
    } else if (
      url.startsWith("data:application/vnd.openxmlformats-officedocument")
    ) {
      return "excel";
    }
    return null;
  };

  const renderPdf = (url) => {
    return (
      <embed src={url} type="application/pdf" width="100%" height="600px" />
    );
  };

  const renderImage = (url) => {
    return <img src={url} alt="image" width="200" />;
  };

  const fileType = getFileType(props.file);

  let content = null;

  if (fileType === "image") {
    content = renderImage(props.file);
  } else if (fileType === "pdf") {
    content = renderPdf(props.file);
  }

  return (
    <div className="self-message-container">
      <p className="con-icon">{props.sender.name[0]}</p>
      <div className="other-text-content ">
        {props.content && <p style={{ color: "black" }}>{props.content}</p>}
        <div style={{ color: "black" }}>
          {content}
        </div>
        {/* <p className="self-timeStamp" style={{ color: "black" }}>
          12:00am
        </p> */}
      </div>
    </div>
  );
}

export default MessageSelf;
