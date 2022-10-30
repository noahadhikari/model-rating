import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import SearchModelList from "./SearchModelList";

const SearchModel = () => {
  const [searchQueryString, setSearchQueryString] = useState("");
  const searchQuery = trpc.model.searchModels.useQuery(
    { query: searchQueryString },
    {
      enabled: searchQueryString !== "",
      refetchOnWindowFocus: false,
    }
  );

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchQuery.refetch();
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <h1>Search Models</h1>
        <input
          type="text"
          name="search"
          onChange={(e) => setSearchQueryString(e.target.value)}
          placeholder="name"
        ></input>
        <button type="submit">Search</button>
      </form>
      <SearchModelList queryString={searchQueryString} />
    </>
  );
};

export default SearchModel;
