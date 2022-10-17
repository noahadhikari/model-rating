import { IsBestOrientation, Model } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

import { ModelDimensions, StlViewer } from "react-stl-viewer";
import { env } from "../../env/client.mjs";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
    model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
    const { model } = props;
    // console.log(env);
    const url = BASE_URL + model.stlId + "?alt=media&key=" + env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const [modelDimensions, setModelDimensions] = useState<ModelDimensions>();

    function makeModelProps(modelDims: ModelDimensions | undefined) {
        var modelProps = {
            color: "#15404f",
            positionX: 0,
            positionY: 0,
        }
        if (modelDims) {
            modelProps.positionX = modelDims.width;
            modelProps.positionY = modelDims.length;
        }
        return modelProps;
    }

    function makeFloorProps(modelDims: ModelDimensions | undefined) {
        var floorProps = {
            gridWidth: 200,
            gridLength: 200,
        }
        if (modelDims) {
            floorProps.gridWidth = modelDims.width * 2;
            floorProps.gridLength = modelDims.length * 2;
        }
        return floorProps;
    }

    const style = {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#eeeeee',
    }

    return (
        <StlViewer
            onChange={x => console.log(x)}
            url={url}
            style={style}
            orbitControls
            shadows
            showAxes
            onFinishLoading={setModelDimensions}
            modelProps={makeModelProps(modelDimensions)}
            floorProps={makeFloorProps(modelDimensions)}
        />
    );
}

export default ModelLayout;