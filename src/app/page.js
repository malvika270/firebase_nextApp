"use client";
import { useEffect,useState } from "react";
import {ref,onValue} from "firebase/database";
import { database } from "./firebase/firebaseConfig";

export default function Home() {
  const [allData, setAllData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [search, setSearch] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  useEffect(() => {
    const data_reference = ref(database, "logs");
    onValue(data_reference, (snapshot) => {
      const data =snapshot.val();
      entries=[];
      if(data){
        for(let sub_folder in data){
          if(data[sub_folder]){
            let logs = data[sub_folder];
            for(let log_value in logs){
              entries.push({
                uid: logs.UID,
                name: logs.Name,
                time: logs.Time})}
          }
          };
          }
        })

  })
}

