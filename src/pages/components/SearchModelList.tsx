import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Model } from "@prisma/client";
import ModelVisualizer from "./ModelVisualizer";

interface SearchModelListProps {
  query: string;
  limit: number;
}
const SearchModelList = (props: SearchModelListProps) => {
  const { query, limit } = props;
  if (query === "" || limit === 0) {
    return <></>;
  }
  const searchQuery = trpc.model.searchModels.useQuery(
    { query, limit },
    {
      enabled: query !== "",
      refetchOnWindowFocus: false,
    }
  );
  if (searchQuery.data === undefined) {
    return <></>;
  }
  if (searchQuery.isLoading) {
    return <p>Loading...</p>;
  }

  const data = searchQuery.data;

  function tableRow(model: Model) {
    return (
      <tr key={model.id}>
        <td>
          <a href={`/model/${model.id}`}>{model.id}</a>
        </td>
        <td>{model.name}</td>
        <td><div className="searchModelViewer"><ModelVisualizer model={model} /></div></td>
      </tr>
    );
  }

  return (
    <>
      <h2>
        {data.length} search results for "{query}"
      </h2>
      <table className="searchTable">
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Visualization</td>
          </tr>
        </thead>
        <tbody>{data.map(tableRow)}</tbody>
      </table>
    </>
  );
};

export default SearchModelList;
