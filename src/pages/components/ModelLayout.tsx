import { IsBestOrientation, Model } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

import { StlViewer } from "react-stl-viewer";
import { env } from "../../env/server.mjs";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
    model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
    const { model } = props;
    console.log(env);
    const url = BASE_URL + model.stlId + "?alt=media&key=" + env.GOOGLE_API_KEY;


    const style = {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
    }

    return (
        <StlViewer
            style={style}
            orbitControls
            shadows
            url={url}
        />
    );
}

export default ModelLayout;