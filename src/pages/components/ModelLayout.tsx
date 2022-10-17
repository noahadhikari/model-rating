import { IsBestOrientation, Model } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
    model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
    const { model } = props;
    const url = BASE_URL + model.stlId + "?alt=media&key=" + process.env.GOOGLE_API_KEY;
    return <p>{ model.stlId }</p>
}

export default ModelLayout;