import { AuthFormsContext } from "@/contexts/auth-forms.context";
import { useContext } from "react";

export function useAuthForms() {
  const context = useContext(AuthFormsContext);
  if (!context) {
    throw new Error("useAuthForms must be used within an AuthFormsProvider");
  }
  return context;
}

export function useResetAuthForms() {
  const { resetAuthForms } = useAuthForms();
  return resetAuthForms;
}
