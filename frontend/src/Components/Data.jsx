import React from "react";

const Data = ({ html, css }) => {
  return (
      <iframe
        style={{ width: "100%", height: "100%", border: "none"}}
        srcDoc={`
          <html>
            <head>
              <style>
                html, body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  margin: 0;
                }
                ${css}
              </style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `}
      ></iframe>
  );
};

export default Data;
