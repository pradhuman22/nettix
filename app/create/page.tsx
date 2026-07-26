import MainWrapper from "@/components/shared/main-wrapper";
import React from "react";
import CreateForm from "./_components/create-form";

const CreatePage = () => {
  return (
    <MainWrapper>
      <div className="pt-4">
        <CreateForm />
      </div>
    </MainWrapper>
  );
};

export default CreatePage;
