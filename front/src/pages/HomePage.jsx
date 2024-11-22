import { useState, useEffect } from "react";
import axios from "axios";
import { urlAllDiscussions } from "../utils/endpoints";
import Discussion from "../discussion/Discussion";
import CreateLink from "../utils/CreateLink";

export default function HomePage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkcija za osvežavanje liste diskusija
  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(urlAllDiscussions, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDiscussions(response.data);
    } catch (err) {
      console.error("Error fetching discussions:", err);
      setError("Failed to fetch discussions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Poziva fetchDiscussions prilikom učitavanja stranice
  useEffect(() => {
    fetchDiscussions();
  }, []);

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      {/* Dugme za navigaciju ka stranici za kreiranje diskusije */}
      <CreateLink to="/create-discussion">+ Create Discussion</CreateLink>

      {discussions.length === 0 ? (
        <div className="alert alert-info">No discussions available.</div>
      ) : (
        discussions.map((discussion, index) => (
          <Discussion
            key={index}
            title={discussion.title}
            author={discussion.author}
            creation_date={discussion.creation_date}
            text={discussion.text}
            description={discussion.description}
            comments={discussion.comments || []}
            likes_count={discussion.likes_count}
            dislikes_count={discussion.dislikes_count}
          />
        ))
      )}
    </div>
  );
}
