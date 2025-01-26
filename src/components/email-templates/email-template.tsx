import * as React from "react";

interface EmailTemplateProps {
  username: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  message,
}) => (
  <div>
    <h1>Hi, {username}!</h1>
    <p>{message}</p>
  </div>
);
