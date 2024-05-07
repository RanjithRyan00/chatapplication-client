import "./Mystyles.css"
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Messageothers({props}) {
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
      // <embed src={url} type="application/pdf" width="100%" height="600px" />
      <div className="pdf-card">
        <div className="pdf-card-header"> PDF Document </div>
        <div className="pdf-card-body">
          <div className="pdf-icon">
            <i className="fa fa-file-pdf-o" ></i>
          </div>
          <div class="pdf-title">
                Document Title
            </div>
            <div class="pdf-info">
                Uploaded by User on Date
            </div>
            <a href="#" class="button">View PDF</a>
        </div>
      </div>
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

  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  // console.log("message others : ", props);
  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark")}>
      <div className={"message-Box" + (lightTheme ? "" : " dark")}>
        <p className={"con-icon" + (lightTheme ? "" : " dark")}>
          {props.sender.name[0]}
        </p>
        <div className={"other-text-content" + (lightTheme ? "" : " dark")}>
          <p className={"con-title" + (lightTheme ? "" : " dark")}>
            {props.sender.name}
          </p>
          <div className="other-text-content ">
            {props.content && <p style={{ color: "black" }}>{props.content}</p>}
            {content && <div style={{ color: "black" }}>{content}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Messageothers


