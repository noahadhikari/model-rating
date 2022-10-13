import { IsBestOrientation } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const CreateRating = () => {
    const [author, setAuthor] = useState('');
    const [modelId, setModelId] = useState<number>(0);
    const [bestPossible, setBestPossible] = useState<IsBestOrientation>(IsBestOrientation.MAYBE);
    const [quality, setQuality] = useState<number>(0);
    const [reasoning, setReasoning] = useState('');


    const createRatingMutation = trpc.rating.createRating.useMutation({
        onSuccess: (rating) => {
            alert(`Successfully created rating`);
        },
        onError: (error) => {
            alert(error.message);
        },
        
    });


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await createRatingMutation.mutateAsync({
            modelId,
            author,
            bestPossible,
            quality,
            reasoning,
        });
        // console.log(modelId, author, bestPossible, quality, reasoning);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Rate a Model</h1>
                <div>
                    <label>Name:</label>
                    <input value={author} onChange={e => setAuthor(e.target.value)} type="text" placeholder="Enter your full name" />
                </div>
                <div>
                    <label>Model ID:</label>
                    <input value={modelId} onChange={e => setModelId(parseInt(e.target.value))} type="number" placeholder="Enter the model id" />
                </div>
                <div>
                    <label>Best orientation?</label>
                    <select value={bestPossible} onChange={e => setBestPossible(e.target.value as IsBestOrientation)}>
                        {/* map over the values of IsBestOrientation and use those as options */}
                        {Object.values(IsBestOrientation).map((value) => (
                            <option key={value} value={value}>{value.toLowerCase()}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quality:</label>
                    <input value={quality} onChange={e => setQuality(parseInt(e.target.value))} type="number" placeholder="-2 (worst) to 2 (best)" />
                </div>
                <div>
                    <label>Reasoning:</label>
                    <input value={reasoning} onChange={e => setReasoning(e.target.value)} type="text" placeholder="Why did you give this rating?" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateRating;