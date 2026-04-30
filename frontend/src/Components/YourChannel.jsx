import { useEffect, useState } from "react";
import "../Css/yourchannel.css";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function YourChannel() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    const getChannelData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const result = await response.json();
          setChannelData(result);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getChannelData();
  }, [user?.email]);

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div
        className={
          theme ? "yourchannel-container" : "yourchannel-container light-mode"
        }
      >
        {loading ? (
          <SkeletonTheme
            baseColor={theme ? "#353535" : "#aaaaaa"}
            highlightColor={theme ? "#444" : "#b6b6b6"}
          >
            <div className="channel-skeleton">
              <Skeleton height={200} />
              <Skeleton height={80} />
              <Skeleton count={3} height={20} />
            </div>
          </SkeletonTheme>
        ) : channelData ? (
          <>
            {/* Channel Banner */}
            <div className="channel-banner">
              {channelData.channelBanner ? (
                <img
                  src={channelData.channelBanner}
                  alt="Channel Banner"
                  className="banner-image"
                />
              ) : (
                <div className="banner-placeholder"></div>
              )}
            </div>

            {/* Channel Info */}
            <div className="channel-info-section">
              <div className="channel-profile-container">
                <img
                  src={channelData.channelProfile}
                  alt="Channel Profile"
                  className="channel-profile-pic"
                />
                <div className="channel-header-info">
                  <div className="channel-name-row">
                    <h1>{channelData.channelname}</h1>
                    {channelData.isVerified && (
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Verified channel"
                        placement="right"
                      >
                        <VerifiedUserIcon className="verified-badge" />
                      </Tooltip>
                    )}
                  </div>
                  <p className="channel-handle">@{channelData.channelHandle}</p>
                  <p className="channel-stats">
                    {channelData.subscribers} subscribers •{" "}
                    {channelData.videos} videos
                  </p>
                </div>
              </div>

              <button
                className={theme ? "edit-channel-btn" : "edit-channel-btn light"}
                onClick={() => (window.location.href = "/studio/customize")}
              >
                <EditIcon fontSize="small" />
                Edit Channel
              </button>
            </div>

            {/* Channel Description */}
            {channelData.description && (
              <div className="channel-description">
                <h3>About</h3>
                <p>{channelData.description}</p>
              </div>
            )}

            {/* Channel Stats */}
            <div className="channel-stats-grid">
              <div className={theme ? "stat-card" : "stat-card light"}>
                <p className="stat-label">Total Views</p>
                <p className="stat-value">{channelData.totalViews || 0}</p>
              </div>
              <div className={theme ? "stat-card" : "stat-card light"}>
                <p className="stat-label">Videos Uploaded</p>
                <p className="stat-value">{channelData.videos || 0}</p>
              </div>
              <div className={theme ? "stat-card" : "stat-card light"}>
                <p className="stat-label">Subscribers</p>
                <p className="stat-value">{channelData.subscribers || 0}</p>
              </div>
              <div className={theme ? "stat-card" : "stat-card light"}>
                <p className="stat-label">Total Likes</p>
                <p className="stat-value">{channelData.totalLikes || 0}</p>
              </div>
            </div>

            {/* Channel Links */}
            {(channelData.links || []).length > 0 && (
              <div className="channel-links">
                <h3>Links</h3>
                <div className="links-list">
                  {channelData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-item"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
              <button
                className={theme ? "action-btn" : "action-btn light"}
                onClick={() => (window.location.href = "/studio")}
              >
                Go to Studio
              </button>
              <button
                className={theme ? "action-btn" : "action-btn light"}
                onClick={() => (window.location.href = "/studio/video")}
              >
                View Content
              </button>
              <button
                className={theme ? "action-btn" : "action-btn light"}
                onClick={() => (window.location.href = "/studio/customize")}
              >
                Customize Channel
              </button>
            </div>
          </>
        ) : (
          <div className="no-channel">
            <p>Channel data not found</p>
          </div>
        )}
      </div>
    </>
  );
}

export default YourChannel;
