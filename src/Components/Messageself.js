import React from "react";

function MessageSelf({ props }) {
  // console.log("Message self Prop : ", props);
  // console.log(props,"the recieved data")
  return (
    <div className="self-message-container">
        <p className="con-icon" >
          {props.sender.name[0]}</p>
      <div className="other-text-content ">
    
        <p style={{ color: "black" }}>{props.content}</p>
        <p style={{ color: 'black' }}>
      {/* Assuming props.file contains the URL of the image */}
      <img src={props.file} alt="my-image" width="200" />
    </p>
        {/* <p className="self-timeStamp" style={{ color: "black" }}>
          12:00am
        </p> */}
      </div>
    </div>
  );
}

export default MessageSelf;