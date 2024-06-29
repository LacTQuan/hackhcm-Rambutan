'use client'

import React, { useState } from "react";
import styles from "./styles/index.module.css";
import Image from "next/image";

export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>
          <Image src="/search-icon.png" alt="Search" width={20} height={20} />
        </button>
      </div>
    </div>
  );
};
