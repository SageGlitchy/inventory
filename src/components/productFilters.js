import { useState } from "react";

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
        <div 
            style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem"
            }}>
            
            <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            style={{
                flex: 1,
                padding: "8px",
                borderRadius:"6px",
                border: "1px solid #ccc"
            }}
            />

            <select
                value={category}
                onChange={handleCategory}
                style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                }}
            >
                <option value="">All Categories</option>
                {categories.map((cat)=> (
                    <option key={cat} value={cat}>{cat}</option>
                ))}


            </select>
        </div>
    );
}