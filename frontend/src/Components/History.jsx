import { useEffect, useState } from "react";
import "../Css/history.css";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

function History() {
  const backendURL = "http://localhost:5000";
  // const backendURL = "http://localhost:3000";
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    const getHistory = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/gethistory/${user?.email}`
          );
          const result = await response.json();
          setHistory(result.history || []);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [user?.email]);

  const handleClearHistory = async () => {
    try {
      if (user?.email) {
        await fetch(`${backendURL}/clearhistory/${user?.email}`, {
          method: "DELETE",
        });
        setHistory([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      if (user?.email) {
        await fetch(`${backendURL}/removehistory/${user?.email}/${videoId}`, {
          method: "DELETE",
        });
        setHistory(history.filter((item) => item._id !== videoId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div
        className={theme ? "history-container" : "history-container light-mode"}
      >
        <div className="history-header">
          <h1>Watch history</h1>
          <button
            className={theme ? "clear-btn" : "clear-btn light"}
            onClick={handleClearHistory}
          >
            Clear all watch history
          </button>
        </div>

        <div className="history-list">
          {loading ? (
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              {[...Array(5)].map((_, i) => (
                <div className="history-item-skeleton" key={i}>
                  <Skeleton height={150} width={250} />
                  <Skeleton count={2} height={15} />
                </div>
              ))}
            </SkeletonTheme>
          ) : history.length > 0 ? (
            history.map((video) => (
              <div
                key={video._id}
                className={theme ? "history-item" : "history-item light"}
                onClick={() => (window.location.href = `/video/${video._id}`)}
              >
                <div className="history-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="history-details">
                  <h3>{video.title}</h3>
                  <p className="channel-name">{video.channelname}</p>
                  <p className="view-count">{video.views} views</p>
                </div>
                <div
                  className="remove-history-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo(video._id);
                  }}
                >
                  <ClearRoundedIcon />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-history">
              <p>Your watch history is empty</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default History;
