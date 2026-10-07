import React from "react";
import ContractorHub from "../../security/ContractorHub";

export default function ContractorDashboard() {
  // We can just reuse the robust ContractorHub which already locks them into their own details!
  return <ContractorHub />;
}
