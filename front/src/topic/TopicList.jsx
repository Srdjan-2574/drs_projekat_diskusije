import React, { useState, useEffect } from "react";
import TopicCard from "./TopicCard";
import "../styles/TopicStyle.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  urlTopicDelete,
  urlTopicDeleteSelected,
  urlTopics,
} from "../utils/endpoints";

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(urlTopics)
      .then((response) => {
        setTopics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load topics");
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(urlTopicDelete, { data: { id } })
      .then((response) => {
        console.log(response.data.message);
        setTopics(topics.filter((topic) => topic.id !== id));
        setSelectedTopics(
          selectedTopics.filter((selectedId) => selectedId !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting topics:", error);
        // Provera greške i prikaz odgovarajuće poruke
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(error.response.data.error); // Prikazujemo tačnu grešku korisniku
        } else {
          alert("There was an error deleting the topics.");
        }
      });
  };

  const handleSelect = (id) => {
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map((topic) => topic.id));
    }
  };

  const handleDeleteSelected = () => {
    console.log("Selected IDs to delete:", selectedTopics); // Debugging: logovanje ID-eva koji se šalju

    axios
      .delete(urlTopicDeleteSelected, {
        data: selectedTopics, // Prosleđivanje samo liste ID-eva
      })
      .then((response) => {
        console.log(response.data.message);
        // Uklanjanje obrisanih tema iz stanja
        setTopics(topics.filter((topic) => !selectedTopics.includes(topic.id)));
        setSelectedTopics([]); // Resetovanje selektovanih tema
      })
      .catch((error) => {
        console.error("Error deleting topics:", error);
        // Provera greške i prikaz odgovarajuće poruke
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(error.response.data.error); // Prikazujemo tačnu grešku korisniku
        } else {
          alert("There was an error deleting the topics.");
        }
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="button-group">
        <button onClick={handleSelectAll} className="select-all-btn">
          {selectedTopics.length === topics.length
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTopics.length === 0}
          className="delete-selected-btn"
        >
          Delete Selected
        </button>
        <Link to="/create-topic">
          <button className="btn-create-topic">Create Topic</button>
        </Link>
      </div>

      <div className="topic-list">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleSelect}
            selected={selectedTopics.includes(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicList;
