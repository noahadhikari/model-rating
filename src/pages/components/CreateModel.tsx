import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const CreateModel = () => {
    const [name, setName] = useState('');
    const [stlLink, setStlLink] = useState('');
    const [binvoxLink, setBinvoxLink] = useState('');
    const [vizLink, setVizLink] = useState('');

    const createModelMutation = trpc.model.createModel.useMutation();


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            await createModelMutation.mutateAsync({
                name,
                stlLink,
                binvoxLink,
                vizLink,
            })
            .then((model) => {
                console.log(model);
            });
        } catch (error) {
            console.log(error);
        };
        // console.log(name, stlLink, binvoxLink, vizLink);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Create a Model</h1>
                <div>
                    <label>Name:</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Enter the model name" />
                </div>
                <div>
                    <label>STL Link</label>
                    <input value={stlLink} onChange={e => setStlLink(e.target.value)} type="text" />
                </div>
                <div>
                    <label>Binvox Link</label>
                    <input value={binvoxLink} onChange={e => setBinvoxLink(e.target.value)} type="text" />
                </div>
                <div>
                    <label>Visualization Link</label>
                    <input value={vizLink} onChange={e => setVizLink(e.target.value)} type="text" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateModel;