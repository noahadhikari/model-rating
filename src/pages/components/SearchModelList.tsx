import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

interface SearchModelListProps {
  queryString: string;
}
const SearchModelList = (props: SearchModelListProps) => {
  const { queryString } = props;
  const searchQuery = trpc.model.searchModels.useQuery(
    { query: queryString },
    {
      enabled: queryString !== "",
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

  // Create a table with the models
  return (
    <>
      <table className="searchTable">
        <th>
          <td>Id</td>
          <td>Name</td>
        </th>
        {data.map((model) => (
          <tr key={model.id}>
            <td><a href={`/model/${model.id}`}>{model.id}</a></td>
            <td>{model.name}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default SearchModelList;
