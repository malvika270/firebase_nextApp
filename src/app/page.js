"use client";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "/firebase/firebaseConfig";

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [selectedDate, setSelectedDate] = useState("");

  // Convert yyyy-mm-dd → dd-mm-yyyy
  const change_date_format = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  // Sort by time
  const sortData = (data) => {
    const sorted = [...data].sort((a, b) => {
      if (sortOrder === "Ascending") {
        return a.time.localeCompare(b.time);
      } else {
        return b.time.localeCompare(a.time);
      }
    });
    setFilteredData(sorted);
  };

  // Fetch logs from Firebase
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
      sortData(entries);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Search filter
  const searchLogs = (searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    const foundEntries = allData.filter(
      (entry) =>
        entry.uid.toLowerCase().includes(searchLower) ||
        entry.name.toLowerCase().includes(searchLower)
    );
    sortData(foundEntries);
  };

  // Date filter
  const filterByDate = (date) => {
    if (!date) {
      sortData(allData);
      return;
    }
    const formattedDate = change_date_format(date);
    const matchingData = allData.filter((entry) =>
      entry.time.startsWith(formattedDate)
    );
    sortData(matchingData);
  };

  // Update search results dynamically
  useEffect(() => {
    searchLogs(search);
  }, [search]);

  // Resort when sort order changes
  useEffect(() => {
    sortData(filteredData);
  }, [sortOrder]);

  // Filter by date when selectedDate changes
  useEffect(() => {
    filterByDate(selectedDate);
  }, [selectedDate]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "30px", textAlign: "center" }}>Log Viewer</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={get_logs}
          style={{
            padding: "8px 16px",
            marginRight: "20px",
            cursor: "pointer",
            backgroundColor: "#456882",
            borderRadius: "6px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Read Logs
        </button>

        <input
          type="text"
          placeholder="Search UID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginRight: "10px",
            marginLeft: "10px",
            padding: "8px",
            backgroundColor: "#456882",
            borderRadius: "6px",
            border: "1px solid black",
            color: "white",
            flexGrow: 1,
            minWidth: "200px",
          }}
        />

        <label htmlFor="filters" style={{ marginLeft: "20px", color: "black" }}>
          Sort by:{" "}
        </label>
        <select
          id="filters"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            color: "white",
            marginLeft: "10px",
            backgroundColor: "#456882",
          }}
        >
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>

        <label htmlFor="date" style={{ marginLeft: "20px", color: "black" }}>
          Date:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid black",
            color: "black",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        {filteredData.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#1B3C53",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#456882" }}>
                <th style={{ border: "1px solid #999", padding: "10px" }}>
                  S.No
                </th>
                <th style={{ border: "1px solid #999", padding: "10px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #999", padding: "10px" }}>
                  UID
                </th>
                <th style={{ border: "1px solid #999", padding: "10px" }}>
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td style={{ border: "1px solid #999", padding: "10px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #999", padding: "10px" }}>
                    {entry.name}
                  </td>
                  <td style={{ border: "1px solid #999", padding: "10px" }}>
                    {entry.uid}
                  </td>
                  <td style={{ border: "1px solid #999", padding: "10px" }}>
                    {entry.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>Search for logs</p>
        )}
      </div>
    </div>
  );
}
