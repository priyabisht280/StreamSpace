import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChannelHome from "./ChannelHome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ChannelVideos from "./ChannelVideos";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Zoom from "@mui/material/Zoom";
import Signup from "../Signup";
import Signin from "../Signin";
import ChannelAbout from "./ChannelAbout";
import ChannelPlaylists from "./ChannelPlaylists";
import FeaturedChannels from "./FeaturedChannels";
import { RiUserSettingsLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

// YOUTUBE API CONFIG
const YOUTUBE_API_KEY = 'AIzaSyB4W-97MCpDfohtHuejVDAe0BR2LsePXQ0';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

function OtherChannel() {
  // FIXED: Use correct backend URL (MongoDB connection)
  const backendURL = "http://localhost:5000"; // ✅ FIXED PORT
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const Section = localStorage.getItem("Section") || "Home";
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [Subscribers, setSubscribers] = useState();
  const [Top, setTop] = useState("155px");
  const [coverIMG, setCoverIMG] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  // YOUTUBE STATES
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [showYoutubeSection, setShowYoutubeSection] = useState(false);

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  //TOAST FUNCTIONS

  const SubscribeNotify = () =>
    toast.success("Channel subscribed!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  // YOUTUBE FUNCTIONS
  const playVideo = (videoId, videoTitle) => { // ✅ FIXED (Error 9): Removed async since no await is used.
    setSelectedVideo({
      id: videoId,
      title: videoTitle
    });
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
  };

  const searchYoutubeVideos = async (query, pageToken = "") => {
    if (!query.trim()) {
      toast.error("Please enter a search query", {
        position: "bottom-center",
        theme: theme ? "dark" : "light",
      });
      return;
    }

    setYoutubeLoading(true);
    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 12,
        key: YOUTUBE_API_KEY,
        pageToken: pageToken
      });

      const response = await fetch(
        `${YOUTUBE_API_BASE_URL}/search?${params}` // ✅ FIXED: Now using correct base URL
      );
      const data = await response.json();
      
      // ✅ FIXED (Error 7): Better error checking and handling.
      if (!response.ok) {
        const errorMessage = data?.error?.message || 'Search failed';
        throw new Error(errorMessage);
      }

      if (!data.items) {
        throw new Error('No videos found');
      }

      setYoutubeVideos(data.items || []);
      setNextPageToken(data.nextPageToken || "");
      setPrevPageToken(data.prevPageToken || "");
      setShowYoutubeSection(true);
    } catch (error) {
      console.error('YouTube Search Error:', error); // ✅ Added console log
      toast.error("Error searching videos: " + error.message, {
        position: "bottom-center",
        theme: theme ? "dark" : "light",
      });
    } finally {
      setYoutubeLoading(false);
    }
  };

  //USE EFFECTS

  // ✅ FIXED (Error 1): Added proper dependency array to prevent stale closures and warnings.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // Cleanup to avoid memory leaks
  }, []); // Empty array since no dependencies

  // ✅ FIXED (Error 1): Added 'id' to dependency array.
  useEffect(() => {
    const getUserMail = async () => {
      try {
        const response = await fetch(`${backendURL}/getotherchannel/${id}`);
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        console.error('Error fetching user mail:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };

    getUserMail();
  }, [id, backendURL]); // Added backendURL as dependency

  // ✅ FIXED (Error 1): Added 'Email' and 'backendURL' to dependency array.
  useEffect(() => {
    const getChannelData = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getchannel/${Email}`);
          const data = await response.json();
          const { userProfile, ChannelName } = data;
          setChannelProfile(userProfile);
          setChannelname(ChannelName);
        }
      } catch (error) {
        console.error('Error fetching channel data:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };

    getChannelData();
  }, [Email, backendURL]);

  document.title =
    channelName && channelName !== undefined
      ? `${channelName} - YouTube`
      : "YouTube";

  // ✅ FIXED (Error 1): Added 'Email' and 'backendURL' to dependency array.
  useEffect(() => {
    const getChannelCover = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getcover/${Email}`);
          const coverimg = await response.json();
          setCoverIMG(coverimg);
        }
      } catch (error) {
        console.error('Error fetching cover:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };

    getChannelCover();
  }, [Email, backendURL]);

  // ✅ FIXED (Error 1): Added 'Email' and 'backendURL' to dependency array.
  useEffect(() => {
    const getSubscribers = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getchannelid/${Email}`);
          const { subscribers } = await response.json();
          setSubscribers(subscribers);
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };

    getSubscribers();
  }, [Email, backendURL]);

  // ✅ FIXED (Error 1): Added 'Email' and 'backendURL' to dependency array.
  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getuservideos/${Email}`);
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };
    getUserVideos();
  }, [Email, backendURL]);

  // ✅ FIXED (Error 1): Added 'Section' and 'coverIMG' to dependency array.
  useEffect(() => {
    if (Section === "Home" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Home" && coverIMG === "No data") {
      setTop("2%");
    } else if (Section === "Videos" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Videos" && coverIMG === "No data") {
      setTop("2%");
    } else if (
      (Section !== "Videos" && coverIMG === "No data") ||
      (Section !== "Home" && coverIMG === "No data")
    ) {
      setTop("2%");
    } else if (
      (Section !== "Videos" && coverIMG !== "No data") ||
      (Section !== "Home" && coverIMG !== "No data")
    ) {
      setTop("31%");
    }
  }, [Section, coverIMG]);

  // ✅ FIXED (Error 8): Improved theme logic to avoid potential issues with window.location.
  useEffect(() => {
    const isStudioPage = window.location.href.includes("/studio");
    if (!isStudioPage) {
      document.body.style.backgroundColor = theme ? "0f0f0f" : "white";
    }
  }, [theme]);

  // ✅ FIXED (Error 4): Added 'user?.email' and 'id' to dependency array. Also, added null check for user.
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (user?.email && id) {
          const response = await fetch(
            `${backendURL}/checksubscription/${id}/${user.email}/${Email}`
          );
          const { message } = await response.json();
          if (message === true) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error); // ✅ FIXED (Error 7): Added error logging.
      }
    };

    checkSubscription();
  }, [id, user?.email, Email, backendURL]);

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  const username = Email && getUsername(Email);

  //POST REQUESTS

  // ✅ FIXED (Error 4): Added null check for user.email to prevent errors since JWT was removed.
  const SubscribeChannel = async () => {
    try {
      if (!user?.email) {
        setisbtnClicked(true);
        document.body.classList.add("bg-css");
        return;
      }

      const channelData = {
        youtuberName: channelName,
        youtuberProfile: ChannelProfile,
        youtubeChannelID: id,
      };

      const response = await fetch(
        `${backendURL}/subscribe/${id}/${user.email}/${Email}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Subscribed") {
        SubscribeNotify();
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error subscribing:', error); // ✅ FIXED (Error 7): Added error logging.
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      {coverIMG !== "No data" ? (
        <div className="channel-cover">
          <img
            src={coverIMG}
            alt="Banner"
            loading="lazy"
            className="channel-cover-img"
          />
        </div>
      ) : (
        ""
      )}
      {ChannelProfile ? (
        <div
          className={
            Top === "2%"
              ? "channel-main-content-nocover"
              : "channel-main-content"
          }
          style={{ top: Top }}
        >
          <SkeletonTheme
            baseColor={theme ? "#353535" : "#aaaaaa"}
            highlightColor={theme ? "#444" : "#b6b6b6"}
          >
            <div
              className="channel-top-content"
              style={
                loading === true ? { display: "flex" } : { display: "none" }
              }
            >
              <div className="channel-left-content">
                <Skeleton
                  count={1}
                  width={130}
                  height={130}
                  style={{ borderRadius: "100%" }}
                  className="sk-channel-profile"
                />
                <div className="channel-topleft-data">
                  <div className="channel-left">
                    <div className="channel-name-verified">
                      <Skeleton
                        count={1}
                        width={200}
                        height={20}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-main-name"
                      />
                    </div>
                    <div className="channel-extra">
                      <Skeleton
                        count={1}
                        width={220}
                        height={15}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-liner"
                      />
                    </div>
                    <div className="more-about">
                      <Skeleton
                        count={1}
                        width={200}
                        height={14}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-more"
                      />
                    </div>
                  </div>
                  {user?.email === Email ? (
                    <div className="channel-right-content channel-dualbtns">
                      <Skeleton
                        count={1}
                        width={160}
                        height={38}
                        style={{ borderRadius: "20px" }}
                        className="sk-channel-customize"
                      />
                      <Skeleton
                        count={1}
                        width={160}
                        height={38}
                        style={{
                          borderRadius: "20px",
                          position: "relative",
                          left: "25px",
                        }}
                        className="sk-channel-manage"
                      />
                    </div>
                  ) : (
                    <div className="channel-right-content">
                      <Skeleton
                        count={1}
                        width={125}
                        height={38}
                        style={{ borderRadius: "20px" }}
                        className="sk-channel-subscribe"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SkeletonTheme>
          <div
            className="channel-top-content"
            style={
              loading === true
                ? { visibility: "hidden", display: "none" }
                : { visibility: "visible", display: "flex" }
            }
          >
            <div
              className={
                theme
                  ? "channel-left-content"
                  : "channel-left-content text-light-mode"
              }
            >
              <img
                src={ChannelProfile}
                alt="channelDP"
                className="channel_profile"
              />
              <div className="channel-topleft-data">
                <div className="channel-left">
                  <div className="channel-name-verified">
                    <p className="channelname">{channelName && channelName}</p>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Verified"
                      placement="right"
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        style={{
                          color: "rgb(138, 138, 138)",
                          marginLeft: "6px",
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div
                    className={
                      theme ? "channel-extra" : "channel-extra text-light-mode2"
                    }
                  >
                    <p className="channeluser">@{username && username}</p>
                    <p className="my-subs">
                      {Subscribers && Subscribers} subscribers
                    </p>
                    {myVideos && myVideos.message !== "USER DOESN'T EXIST" ? (
                      <p className="my-videoscount">
                        {myVideos && myVideos.length} videos
                      </p>
                    ) : (
                      <p className="my-videoscount">0 videos</p>
                    )}
                  </div>
                  <div
                    className={
                      theme ? "more-about" : "more-about text-light-mode2"
                    }
                    onClick={() => {
                      localStorage.setItem("Section", "About");
                      window.location.reload();
                    }}
                  >
                    <p className="more-text">More about this channel</p>
                    <ArrowForwardIosIcon
                      fontSize="15px"
                      style={{ color: "#aaa", marginLeft: "7px" }}
                    />
                  </div>
                </div>
                {user?.email === Email ? (
                  <div className="channel-right-content channel-dualbtns">
                    <button
                      className={
                        theme
                          ? "customize-channel"
                          : "customize-channel btn-light-mode"
                      }
                      onClick={() => {
                        window.location.href = "/studio/customize";
                      }}
                    >
                      Customize channel
                    </button>
                    <button
                      className={
                        theme ? "manage-videos" : "manage-videos btn-light-mode"
                      }
                      onClick={() => {
                        window.location.href = "/studio/video";
                      }}
                    >
                      Manage videos
                    </button>
                    <div
                      className="setting-btn"
                      onClick={() => {
                        window.location.href = "/studio/video";
                      }}
                    >
                      <RiUserSettingsLine
                        fontSize="28px"
                        color={theme ? "white" : "black"}
                        className={
                          theme
                            ? "channel-settings"
                            : "channel-settings channel-settings-light"
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="channel-right-content">
                    <button
                      className={
                        theme
                          ? "subscribethis-channel"
                          : "subscribethis-channel-light text-dark-mode"
                      }
                      style={
                        isSubscribed === true
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      onClick={() => {
                        if (user?.email) {
                          SubscribeChannel();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      Subscribe
                    </button>
                    <button
                      className={
                        theme
                          ? "subscribethis-channel2"
                          : "subscribethis-channel2-light"
                      }
                      style={
                        isSubscribed === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => {
                        if (user?.email) {
                          SubscribeChannel();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      Subscribed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="channel-mid-content">
            <div className="different-sections">
              {Section === "Home" ? (
                <p
                  className={theme ? "channel-home1" : "channel-home2"}
                  onClick={() => {
                    localStorage.setItem("Section", "Home");
                    window.location.reload();
                  }}
                >
                  HOME
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-home" : "channel-home text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Home");
                    window.location.reload();
                  }}
                >
                  HOME
                </p>
              )}
              {Section === "Videos" ? (
                <p
                  className={theme ? "channel-videos1" : "channel-videos2"}
                  style={
                    myVideos && myVideos.message === "USER DOESN'T EXIST"
                      ? { display: "none" }
                      : { display: "block" }
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Videos");
                    window.location.reload();
                  }}
                >
                  VIDEOS
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-videos" : "channel-videos text-light-mode2"
                  }
                  style={
                    myVideos && myVideos.message === "USER DOESN'T EXIST"
                      ? { display: "none" }
                      : { display: "block" }
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Videos");
                    window.location.reload();
                  }}
                >
                  VIDEOS
                </p>
              )}
              {Section === "Playlists" ? (
                <p
                  className={
                    theme ? "channel-playlists1" : "channel-playlists2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Playlists");
                    window.location.reload();
                  }}
                >
                  PLAYLISTS
                </p>
              ) : (
                <p
                  className={
                    theme
                      ? "channel-playlists"
                      : "channel-playlists text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Playlists");
                    window.location.reload();
                  }}
                >
                  PLAYLISTS
                </p>
              )}
              {Section === "Subscriptions" ? (
                <p
                  className={
                    theme ? "channel-subscriptions1" : "channel-subscriptions2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Subscriptions");
                    window.location.reload();
                  }}
                >
                  CHANNELS
                </p>
              ) : (
                <p
                  className={
                    theme
                      ? "channel-subscriptions"
                      : "channel-subscriptions text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Subscriptions");
                    window.location.reload();
                  }}
                >
                  CHANNELS
                </p>
              )}
              {Section === "About" ? (
                <p
                  className={theme ? "channel-about1" : "channel-about2"}
                  onClick={() => {
                    localStorage.setItem("Section", "About");
                    window.location.reload();
                  }}
                >
                  ABOUT
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-about" : "channel-about text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "About");
                    window.location.reload();
                  }}
                >
                  ABOUT
                </p>
              )}
              {/* YOUTUBE SEARCH TAB */}
              <p
                className={theme ? "channel-home" : "channel-home text-light-mode2"}
                onClick={() => setShowYoutubeSection(!showYoutubeSection)}
                style={{ cursor: "pointer", marginLeft: "20px" }}
              >
                YOUTUBE SEARCH
              </p>
            </div>
          </div>
          <br />
          <hr
            className={
              theme
                ? "seperate seperate-new"
                : "seperate seperate-new seperate-light"
            }
          />

          {/* YOUTUBE SEARCH SECTION */}
          {showYoutubeSection && (
            <div
              style={{
                padding: "20px",
                marginBottom: "30px",
                backgroundColor: theme ? "#212121" : "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                  type="text"
                  value={youtubeSearchQuery}
                  onChange={(e) => setYoutubeSearchQuery(e.target.value)}
                  // ✅ FIXED (Error 10): Replaced deprecated onKeyPress with onKeyDown.
                  onKeyDown={(e) =>
                    e.key === "Enter" && searchYoutubeVideos(youtubeSearchQuery)
                  }
                  placeholder="Search YouTube videos..."
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    borderRadius: "4px",
                    border: theme ? "1px solid #444" : "1px solid #ddd",
                    backgroundColor: theme ? "#333" : "white",
                    color: theme ? "white" : "black",
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={() => searchYoutubeVideos(youtubeSearchQuery)}
                  disabled={youtubeLoading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: youtubeLoading ? "not-allowed" : "pointer",
                    opacity: youtubeLoading ? 0.6 : 1,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {youtubeLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* VIDEO GRID */}
              {youtubeVideos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  {youtubeVideos.map((video) => (
                    // ✅ FIXED (Error 5): Added unique key prop to prevent React warnings.
                    <div
                      key={video.id.videoId}
                      onClick={() => playVideo(video.id.videoId, video.snippet.title)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "transform 0.3s",
                        backgroundColor: theme ? "#2c2c2c" : "white",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          style={{
                            width: "100%",
                            height: "130px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.3s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                        >
                          <span style={{ fontSize: "40px", color: "white" }}>▶</span>
                        </div>
                      </div>
                      <div style={{ padding: "10px" }}>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: theme ? "white" : "black",
                            lineHeight: "1.3",
                            marginBottom: "5px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {video.snippet.title}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: theme ? "#aaa" : "#606060",
                          }}
                        >
                          {video.snippet.channelTitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {youtubeVideos.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() => searchYoutubeVideos(youtubeSearchQuery, prevPageToken)}
                    disabled={!prevPageToken || youtubeLoading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: !prevPageToken ? "#555" : "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: !prevPageToken ? "not-allowed" : "pointer",
                      opacity: !prevPageToken ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => searchYoutubeVideos(youtubeSearchQuery, nextPageToken)}
                    disabled={!nextPageToken || youtubeLoading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: !nextPageToken ? "#555" : "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: !nextPageToken ? "not-allowed" : "pointer",
                      opacity: !nextPageToken ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIDEO PLAYER MODAL */}
          {selectedVideo && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
              }}
              onClick={closeVideoPlayer}
            >
              <div
                style={{
                  backgroundColor: theme ? "#212121" : "white",
                  borderRadius: "8px",
                  maxWidth: "900px",
                  width: "100%",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: theme ? "1px solid #444" : "1px solid #eee",
                  }}
                >
                  <h3
                    style={{
                      color: theme ? "white" : "black",
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {selectedVideo.title}
                  </h3>
                  <button
                    onClick={closeVideoPlayer}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      color: theme ? "white" : "black",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "20px" }}>
                  <iframe
                    width="100%"
                    height="500"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    // ✅ FIXED (Error 6): Added allowFullScreen as a boolean prop.
                    allowFullScreen={true}
                    style={{ borderRadius: "4px" }}
                  />
                </div>
              </div>
            </div>
          )}

          {Section === "Home" || Section === "" ? (
            <ChannelHome newmail={Email} />
          ) : (
            ""
          )}
          {Section === "Videos" &&
          myVideos &&
          myVideos.message !== "USER DOESN'T EXIST" ? (
            <ChannelVideos newmail={Email} />
          ) : (
            ""
          )}
          {Section === "Playlists" ? <ChannelPlaylists newmail={Email} /> : ""}
          {Section === "Subscriptions" ? (
            <FeaturedChannels newmail={Email} />
          ) : (
            ""
          )}

          {Section === "About" ? (
            <ChannelAbout newmail={Email} channelid={id} />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="main-trending-section">
          <div className="spin23" style={{ top: "200px" }}>
            <span className={theme ? "loader2" : "loader2-light"}></span>
          </div>
        </div>
      )}

      {/* SIGNUP/SIGNIN  */}

      <div
        className={
          theme ? "auth-popup" : "auth-popup light-mode text-light-mode"
        }
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherChannel;
