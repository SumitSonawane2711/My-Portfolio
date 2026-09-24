export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactResponse = {
  message?: string;
  error?: string;
};
