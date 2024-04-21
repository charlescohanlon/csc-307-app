import React, { useState, useEffect, useCallback } from "react";
import Table from "./table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchUsers();
        const json = await res.json();
        setCharacters(json["users_list"]);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const removeOneCharacter = useCallback(async (index) => {
    const res = await fetch(
      `http://localhost:8000/users/${characters[index].id}`,
      { method: "DELETE" }
    );
    if (res.status == 204) {
      const updated = characters.filter((character, i) => {
        return i !== index;
      });
      setCharacters(updated);
    }
  });

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }

  async function updateList(person) {
    try {
      const res = await postUser(person);
      if (res.status == 201) {
        const newPerson = await res.json();
        setCharacters([...characters, newPerson]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
