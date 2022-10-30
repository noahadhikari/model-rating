import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const CreateModel = () => {
  const [name, setName] = useState("");
  const [stlId, setStlId] = useState("");
  const [binvoxId, setBinvoxId] = useState("");

  const createModelMutation = trpc.model.createModel.useMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createModelMutation
        .mutateAsync({
          name,
          stlId,
          binvoxId,
        })
        .then((model) => {
          console.log(model);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create a Model</h1>
        <div>
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter the model name"
          />
        </div>
        <div>
          <label>STL Google Drive File ID</label>
          <input
            value={stlId}
            onChange={(e) => setStlId(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <label>Binvox Google Drive File ID</label>
          <input
            value={binvoxId}
            onChange={(e) => setBinvoxId(e.target.value)}
            type="text"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateModel;
