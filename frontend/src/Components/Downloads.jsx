import { useEffect, useState } from "react";
import "../Css/downloads.css";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import GetAppIcon from "@mui/icons-material/GetApp";

function Downloads() {
  const backendURL = "http://localhost:5000";
  // const backendURL = "http://localhost:3000";
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    const getDownloads = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getdownloads/${user?.email}`
          );
          const result = await response.json();
          setDownloads(result.downloads || []);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getDownloads();
  }, [user?.email]);

  const handleRemoveDownload = async (videoId) => {
    try {
      if (user?.email) {
        await fetch(`${backendURL}/removedownload/${user?.email}/${videoId}`, {
          method: "DELETE",
        });
        setDownloads(downloads.filter((item) => item._id !== videoId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDownloadVideo = (videoUrl, title) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${title}.mp4`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div
        className={
          theme ? "downloads-container" : "downloads-container light-mode"
        }
      >
        <div className="downloads-header">
          <h1>My Downloads</h1>
          <p className="downloads-subtitle">Offline videos saved to your device</p>
        </div>

        <div className="downloads-list">
          {loading ? (
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              {[...Array(5)].map((_, i) => (
                <div className="download-item-skeleton" key={i}>
                  <Skeleton height={150} width={250} />
                  <Skeleton count={2} height={15} />
                </div>
              ))}
            </SkeletonTheme>
          ) : downloads.length > 0 ? (
            downloads.map((video) => (
              <div
                key={video._id}
                className={theme ? "download-item" : "download-item light"}
              >
                <div className="download-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="download-badge">
                    <GetAppIcon fontSize="small" />
                  </div>
                </div>
                <div className="download-details">
                  <h3>{video.title}</h3>
                  <p className="channel-name">{video.channelname}</p>
                  <p className="download-size">
                    {video.size ? `${video.size} MB` : "Size unknown"}
                  </p>
                  <div className="download-actions">
                    <button
                      className="watch-btn"
                      onClick={() => (window.location.href = `/video/${video._id}`)}
                    >
                      Watch
                    </button>
                    <button
                      className="download-btn"
                      onClick={() =>
                        handleDownloadVideo(video.videoUrl, video.title)
                      }
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div
                  className="remove-download-btn"
                  onClick={() => handleRemoveDownload(video._id)}
                >
                  <ClearRoundedIcon />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-downloads">
              <p>You haven't downloaded any videos yet</p>
              <small>Download videos to watch them offline</small>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Downloads;
