'use client'
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
const API_URL = "https://bajaj-backend-5-rhdc.onrender.com/bfhl"; 
export default function Home() {
    const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);

  const options = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
    { value: "is_prime_found", label: "Prime Found" },
  ];

  const handleSubmit = async () => {
    try {
      
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.arr || !Array.isArray(parsedInput.arr)) {
        throw new Error("Invalid JSON format. 'arr' should be an array.");
      }

      
      const { data } = await axios.post(API_URL, parsedInput);
      setResponse(data);
      setError("");
    } catch (err) {
      setError(err.message || "Invalid JSON or API error");
      setResponse(null);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    selectedFields.forEach((field) => {
      if (response[field.value] !== undefined) {
        filteredResponse[field.label] = response[field.value];
      }
    });

    return (
      <pre style={{ background: "#f8f8f8", padding: "10px" }}>
        {JSON.stringify(filteredResponse, null, 2)}
      </pre>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <textarea
        placeholder={`Enter JSON data, e.g. {"arr": ["A", "1", "z"]}`}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          color:'white'
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#007bff",
          color: "black",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <>
          <h3>Filter Response</h3>
          <Select
            isMulti
            options={options}
            onChange={setSelectedFields}
            placeholder="Select fields to display"
          />
          <h3>Filtered Response:</h3>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}
