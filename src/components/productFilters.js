import { useState } from "react";
import styles from "@/styles/inventory.module.scss";

export default function ProductFilters({categories, onSearch, onCategory}){
    const [search, setSearch]= useState("");
    const [category, setCategory]= useState("");

    const handleSearch= (e)=>{
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    const handleCategory= (e)=>{
        setCategory(e.target.value);
        onCategory(e.target.value);
    };

    return (
        <div className={styles.filterBar}>
            <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            />

            <select
                value={category}
                onChange={handleCategory}>
                <option value="">All Categories</option>
                {categories.map((cat)=> (
                    <option key={cat} value={cat}>{cat}</option>
                ))}

            </select>
        </div>
    );
}