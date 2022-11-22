import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Model } from "@prisma/client";
import ModelVisualizer from "./ModelVisualizer";

interface SearchModelListProps {
  query: string;
  limit: number;
}
const SearchModelList = (props: SearchModelListProps) => {
  const [model, setModel] = useState(null as Model | null);
  const { query, limit } = props;
  const searchQuery = trpc.model.searchModels.useQuery(
    { query, limit },
    {
      enabled: query !== "",
      refetchOnWindowFocus: false,
    }
  );
  if (query === "" || limit === 0) {
    return <></>;
  }
  if (searchQuery.data === undefined) {
    return <></>;
  }
  if (searchQuery.isLoading) {
    return <p>Loading...</p>;
  }

  const data = searchQuery.data;

  function handlePreviewClick(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, previewModel: Model) {
    e.preventDefault();
    if (previewModel !== null) {
      setModel(previewModel);
    }
  }
  function tableRow(model: Model) {
    return (
      <tr key={model.id}>
        <td>
          <a href={`/model/${model.id}`}>{model.id}</a>
        </td>
        <td>{model.name}</td>
        <td onClick={(e) => handlePreviewClick(e, model)}>
          <div className="previewModel">preview</div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <h2>
        {data.length} search results for "{query}"
      </h2>
      <div className="searchWrapper">
        <div>
          <table className="searchTable">
            <thead>
              <tr>
                <td>ID</td>
                <td>Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>{data.map(tableRow)}</tbody>
          </table>
        </div>
        <ModelVisualizer
          model={model}
          orbitControls={true}
          shadows={true}
          showAxes={true}
          style={{
            top: 0,
            left: 0,
            height: "100%",
            backgroundColor: "#eee",
          }}
        />
      </div>
    </>
  );
};

export default SearchModelList;
