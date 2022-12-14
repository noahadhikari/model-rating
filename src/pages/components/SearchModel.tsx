import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import SearchModelList from "./SearchModelList";

const SearchModel = () => {
  const [userInputString, setUserInputString] = useState("");
  const [userLimitAmount, setUserLimitAmount] = useState(0);
  const [searchModelListString, setSearchModelListString] = useState("");
  const [searchModelListLimit, setSearchModelListLimit] = useState(0);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchModelListString(userInputString);
    if (userLimitAmount !== 0) {
      setSearchModelListLimit(userLimitAmount);
    } else {
      setSearchModelListLimit(10);
    }
  }

  return (
    <div className="searchModelWrapper">
      <h1>Search Models by Name</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          onChange={(e) => setUserInputString(e.target.value)}
          placeholder="name"
        ></input>
        <input
          type="number"
          onChange={(e) => setUserLimitAmount(parseInt(e.target.value))}
          placeholder="limit (default 10)"
          min={1}
        ></input>
        <button type="submit">Search</button>
      </form>
      <SearchModelList
        query={searchModelListString}
        limit={searchModelListLimit}
      />
    </div>
  );
};

export default SearchModel;
