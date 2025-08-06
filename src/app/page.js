"use client";
import { useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "/firebase/firebaseConfig";

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const get_logs = async () => {
    setSearch(""); 
    try {
      const data_reference = ref(database, "logs");
      const snapshot = await get(data_reference);
      const data = snapshot.val();

      let entries = [];
      if (data) {
        Object.values(data).forEach((log) => {
          entries.push({
            uid: log.uid || "",
            name: log.name || "",
            time: log.time || "",
          });
        });
      }

      setAllData(entries);
      setFilteredData(entries); // default: show all logs
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const searchLogs = (searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    const foundEntries = allData.filter(
      (entry) =>
        entry.uid.toLowerCase().includes(searchLower) ||
        entry.name.toLowerCase().includes(searchLower)
    );
    setFilteredData(foundEntries);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{fontSize:"30px",textAlign:"center"}}>Log Viewer</h1>

      <div style={{ marginBottom: "20px" }}>
  <button
    onClick={get_logs}
    style={{ padding: "5px", marginRight: "20px", cursor: "pointer",backgroundColor:"#BC8F8F",borderRadius: "4px", color: "black" }}
  >
    Read Logs
  </button>

  <input
    type="text"
    placeholder="Search UID or Name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ marginRight: "10px", marginLeft:"10px",padding: "5px", backgroundColor: "whitesmoke", borderRadius: "4px", border: "7px black", color: "black" }}
  />

  <button
    onClick={() => searchLogs(search)}
    style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#8FBC8F", color: "black", borderRadius: "4px"}}
  >
    Search
  </button>
</div>


      <div>
        {filteredData.length > 0 ? (
          filteredData.map((entry, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "darkgray",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                color: "black"
              }}
            >
              <p><strong>UID:</strong> {entry.uid}</p>
              <p><strong>Name:</strong> {entry.name}</p>
              <p><strong>Time:</strong> {entry.time}</p>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
