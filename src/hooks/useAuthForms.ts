import { AuthFormsContext } from "@/contexts/authFormsContext";
import { useContext } from "react";

export function useAuthForms() {
  const context = useContext(AuthFormsContext);
  if (!context) {
    throw new Error("useAuthForms must be used within an AuthFormsProvider");
  }
  return context;
}