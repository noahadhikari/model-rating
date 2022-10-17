import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import ModelLayout from "../components/ModelLayout";


const ModelPage: NextPage = () => {
    const [success, setSuccess] = useState(true);

    const router = useRouter();
    const id  = Number(router.query.id);

    const {isLoading, data: model} = trpc.model.getModel.useQuery(
        { id },
        { enabled: id !== undefined && !isNaN(id),
        
        onSuccess: model => {
            setSuccess((model !== null) && (model !== undefined));
        }
    });
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (!success) {
        return <h1>Model with id { id } doesn't exist.</h1>
    }
    return (<ModelLayout model={model!}/>)
}




export default ModelPage;