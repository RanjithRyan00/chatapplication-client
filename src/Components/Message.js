import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector } from "react-redux";
import axios from "axios";
import VoiceDisplay from "./VoiceDisplay";

function MessageSelf({ props, userData }) {
  const [userId, setUserId] = useState(userData.data._id);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [showAudio, setShowAudio] = useState(false);

  let content;
  let fileType;
  const ENDPOINT = "http://localhost:8080";

  function base64toBlob(base64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const downloadAsPDF = async (fileInfo) => {
    try {
      let linkSource = fileInfo.fileUrl;
      let fileName = fileInfo.fileName;
      let downloadLink = document.createElement("a");

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.log("Error Downloading PDF..", error);
    }
  };

  const viewAsPDF = async (fileInfo) => {
    try {
      const base64Parts = fileInfo.fileUrl.split(",");

      const base64String = base64Parts[1];
      const contentType = "application/pdf";

      const blob = base64toBlob(base64String, contentType);
      const pdfURL = URL.createObjectURL(blob);

      window.open(pdfURL, "_blank");
    } catch (error) {
      console.log("Error Viewing the PDF", error);
    }
  };

  const renderPdf = (fileInfo) => {
    return (
      <div className="pdf-card">
        {/* <div className="pdf-card-header"> PDF </div> */}
        <div className="pdf-card-body">
          <div className="pdf-icon-title-div">
            <PictureAsPdfIcon />
            <div className="pdf-title">{fileInfo.fileName}</div>
          </div>

          <div className="pdf-info">
            Size - {formatFileSize(fileInfo.fileSize)}
          </div>
          <div className="pdf-download-view-div">
            <a href="#" className="button" onClick={() => viewAsPDF(fileInfo)}>
              View PDF
            </a>
            <DownloadIcon onClick={() => downloadAsPDF(fileInfo)} />{" "}
          </div>
        </div>
      </div>
    );
  };

  const renderImage = (url) => {
    return <img src={url} alt="image" width="200" />;
  };

  if (props.file) {
    fileType = props.file.fileType;
  } else {
    fileType = null;
  }

  if (fileType === "image/jpeg" || fileType === "image/png") {
    content = renderImage(props.file.fileUrl);
  } else if (fileType === "application/pdf") {
    content = renderPdf(props.file);
  }

  const lightTheme = useSelector((state) => state.themeKey);
  // console.log("props:", props)
  return props.sender?._id === userId ? (
    <div className="self-message-container">
      <p className="con-icon">{props.sender?.name[0]}</p>
      {props.content && (
        <div className="other-text-content ">
          <p style={{ color: "black" }}>
            {props.translatedContent ? props.translatedContent : props.content}
          </p>
        </div>
      )}
      {content && <div style={{ color: "black" }}>{content}</div>}
      {props.voiceNote && (
        <VoiceDisplay audioUrl={props.voiceNote.url} />
        // <VoiceMessage voiceUrl = {props.voiceNote.url} voiceDuration = {props.voiceNote.duration}/>
      )}
    </div>
  ) : (
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
            {props.content && (
              <p style={{ color: "black" }}>
                {props.translatedContent
                  ? props.translatedContent
                  : props.content}
              </p>
            )}
            {content && <div style={{ color: "black" }}>{content}</div>}
            {props.voiceNote && (
              // <audio controls>
              //   <source src={audioBlobUrl} type="audio/wav" />
              // </audio>
              <VoiceDisplay src = { props.voice.url}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageSelf;
