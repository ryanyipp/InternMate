import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import wallpaperLight from "../assets/wall.jpg";
import wallpaperDark from "../assets/wall-dark.jpg";
import AddEntryModal from "../components/AddEntryModal"; // adjust path as neededz
import {
  MagnifyingGlassIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { getInternship } from "../api/index.js";
import { deleteInternship } from "../api/index";
import { toast } from "react-toastify";
import { createInternship } from "../api/index";
import { updateInternship } from "../api/index";
import { dismissFollowUp, updateFollowUp } from "../api/index";
import Navbar from "../components/NavBar";
import FollowUpNotif from "../components/FollowUpNotif.jsx";
import { getThemeColors, getThemeShadows } from "../utils/theme";
import { getUserById } from "../api/index.js";
import GradientText from "../components/GradientText";
import CommentModal from "../components/CommentModal";

const currentUserID = JSON.parse(localStorage.getItem("profile"))?.id;

const InternshipTable = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [commentToView, setCommentToView] = useState(null);
  const navigate = useNavigate();
  const colors = getThemeColors(isDark);
  const shadows = getThemeShadows(isDark);
  const [activeTab, setActiveTab] = useState("current");

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    navigate("/landing");
    toast.success("Successfully logged out");
  };

  // handle follow up
  const today = new Date();
  const followUps = applications.filter((app) => {
    if (app.status?.toLowerCase() !== "follow up") return false;
    const followUpDate = new Date(app.followUpDate || app.applicationDate);
    return followUpDate >= today || followUpDate < today; // both future and overdue
  });

  const handleDismissFollowUp = async (id) => {
    try {
      await updateFollowUp(internshipId, payload);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, followUpDismissed: true } : app
        )
      );
    } catch (error) {
      console.error("Dismiss follow-up failed", error);}
  };
  //select wallpaper
  const bg = isDark ? wallpaperDark : wallpaperLight;

  // retrieve all internship data
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await getInternship();

        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        const currentUserID = currentUser?.id;

        const filteredData = data.filter(
          (intern) => String(intern.user) === String(currentUserID)
        );

        console.log("Fetched internships:", filteredData);
        setApplications(filteredData);
      } catch (err) {
        console.log("No Applications Found");
      }
    };

    fetchInternship();
  }, []);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));

        console.log("Current user from storage:", currentUser);

        if (currentUser?.id) {
          const { data } = await getUserById(currentUser.id);
          console.log("API response:", data);
          if (data.success) {
            setUserInfo(data.user);
            console.log("Set userInfo to:", data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Fallback to localStorage if API fails
        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        setUserInfo(currentUser);
      }
    };

    fetchUserInfo();
  }, []);

  // (for archive entry)
  // changed code here
  const handleArchiveEntry = async (id) => {
    const target = applications.find((app) => app._id === id);
    const newArchived = !target.archived;
    try {
      await updateInternship(currentUserID, id, { archived: newArchived });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, archived: newArchived } : app
        )
      );
      setActiveTab("archived");
      toast.success(newArchived ? "Archived" : "Retrieved");
    } catch (err) {
      console.error("Archive failed:, err");
      toast.error("Couldn't save archive state");
    }
  };

  // (for edit entry)
  const [editEntry, setEditEntry] = useState(null);

  // (for search and filter feature)

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // (for page and date settings)

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filteredApplications = applications.filter((app) => {
    const isArchivedMatch =
      activeTab === "archived" ? app.archived : !app.archived;
    const matchesSearch =
      (app.company ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.position ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return isArchivedMatch && matchesSearch && matchesStatus;
  });

  // (for date filter feature)

  const [dateFilter, setDateFilter] = useState("");
  const dateOptions = [
  { label: "Sort by Date", value: "" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },];

  const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Accepted", label: "Accepted" },
  { value: "Withdrawn", label: "Withdrawn" },
  { value: "Rejected", label: "Rejected" },
  { value: "Pending", label: "Pending" },
  { value: "Follow Up", label: "Follow Up" },];
  
  const sortedApplications = [...filteredApplications];
  if (dateFilter === "newest") {
    sortedApplications.sort(
      (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
    );
  } else if (dateFilter === "oldest") {
    sortedApplications.sort(
      (a, b) => new Date(a.applicationDate) - new Date(b.applicationDate)
    );
  }

  // (Paginate the sorted results)

  const paginatedData = sortedApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(sortedApplications.length / rowsPerPage);

  // (for + Add Entry)

  const handleAddEntry = () => {
    setEditEntry(null); // Ensure it's a fresh entry, not editing
    setShowModal(true); // Just open the modal
  };

  const handleDeleteEntry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    try {
      const currentUser =
        JSON.parse(localStorage.getItem("profile")) ||
        JSON.parse(sessionStorage.getItem("profile"));
      if (!currentUser) return alert("No user logged in");
      await deleteInternship(currentUser.id, id); // must use currentUser.id
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete entry. Check console.");
    }
  };

  // (for handling submiting button)
  //
  const handleModalSubmit = async (entry) => {
    // this gets logged in user
    const currentUser =
      JSON.parse(localStorage.getItem("profile")) ||
      JSON.parse(sessionStorage.getItem("profile"));
    if (!currentUser) {
      toast.error("No user found");
      return;
    }

    // For editing existing entry
    if (entry._id) {
      const payload = {
        user: currentUser.id,
        company: entry.company,
        position: entry.position,
        applicationDate: entry.applicationDate,
        status: entry.status,
        followUpDate: entry.followUpDate,
        comments: entry.comments,
        links: entry.link ? [{ label: "Job Link", url: entry.link }] : [],
      };
      try {
        await updateInternship(currentUser.id, entry._id, payload);
        toast.success("Entry updated successfully");
      } catch (error) {
        console.error("Update failed:", error);
        toast.error(error.response?.data?.error || "Failed to update entry");
      }
    }
    // For creating new entry
    else {
      const formData = new FormData();
      formData.append("user", currentUser.id);
      formData.append("company", entry.company);
      formData.append("position", entry.position);
      formData.append("applicationDate", entry.applicationDate || entry.date);
      formData.append("status", entry.status);

      if (entry.followUpDate)
        formData.append("followUpDate", entry.followUpDate);

      if (entry.resume) {
        // Log file info for debugging
        console.log(
          "Appending resume file:",
          entry.resume.name,
          entry.resume.type,
          entry.resume.size
        );
        formData.append("resume", entry.resume);
      }

      if (entry.comments) formData.append("comments", entry.comments);

      if (entry.link) {
        formData.append("link", entry.link);
      }

      try {
        const response = await createInternship(formData);
        console.log("Create success:", response);
        toast.success("Entry created successfully");
      } catch (error) {
        console.error("Create failed:", error.response || error);
        const errorMsg =
          error.response?.data?.error || "Failed to create entry";
        toast.error(errorMsg);
      }
    }

    setShowModal(false);
    setEditEntry(null);

    try {
      // Refresh applications
      const { data } = await getInternship();
      const currentUserID = currentUser?.id;
      const filteredData = data.filter(
        (intern) => String(intern.user) === String(currentUserID)
      );
      setApplications(filteredData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    }
  };

  // (for status badges)

  const getStatusBadge = (status) => {
    const baseClasses =
      `
      text-white font-semibold
      px-3 py-1 text-[15px] rounded-full     /* desktop */
      sm:px-3 sm:py-1 sm:text-[15px]         /* desktop lock */
      px-4 py-2.5 text-md rounded-lg          /* mobile */
      min-w-[96px] text-center
      `;

    if (!status || typeof status !== "string") {
      return (
        <span
          className={baseClasses}
          style={{ backgroundColor: colors.mutedForeground }}
        >
          Unknown
        </span>
      );
    }

    switch (status.toLowerCase()) {
      case "accepted":
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: "#10b981" }} // Green for accepted
          >
            Accepted
          </span>
        );
      case "withdrawn":
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: "#6B7280" }}
          >
            Withdrawn
          </span>
        );
      case "rejected":
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: colors.destructive }}
          >
            Rejected
          </span>
        );
      case "pending":
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: "#f59e0b" }} // Orange for pending
          >
            Pending
          </span>
        );
      case "follow up":
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: colors.primary }}
          >
            Follow Up
          </span>
        );
      default:
        return (
          <span
            className={baseClasses}
            style={{ backgroundColor: colors.mutedForeground }}
          >
            {status}
          </span>
        );
    }
  };
  return (
    <>
      <Navbar
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
        handleLogout={handleLogout}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
         className="relative min-h-screen flex items-start justify-center pt-2 p-4 overflow-hidden transition-all duration-300"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",  
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="w-full max-w-8xl lg:scale-[0.90] lg:origin-top mx-auto rounded-3xl shadow-xl px-4 sm:px-6 py-3 flex flex-col transition-all duration-100"
          style={{
            backgroundColor: colors.card,
            boxShadow: colors.shadows,
            border: `1px solid ${colors.border}`,
          }}
        >
          {commentToView && (
            <CommentModal
              comment={commentToView}
              onClose={() => setCommentToView(null)}
            />
          )}

          {/* New Header Section with 70/30 Split */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.02 }}
            className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 mb-6"
          >
            {/* Left Section - 70% */}
            <div className="w-full lg:w-[65%] flex flex-col gap-4">
              {/* Motivational Header */}
              <div className="text-left">
                <h1
                  style={{ color: colors.brand}}
                  className="text-4xl font-bold mb-2 transition-all duration-100"
                >
                  Time to hustle, {userInfo?.username || "User"}!
                </h1>
                <p
                  className="text-lg transition-all duration-100"
                  style={{ color: colors.mutedForeground }}
                >
                  Track your internship applications and stay on top of your
                  career goals
                </p>
              </div>

              {/* Archive Tabs */}
              <div>
                <div
                  className="w-full max-w-lg p-1.5 mb-5 mt-5 flex justify-between rounded-full transition-all duration-100 border"
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${colors.border}`,
                    boxShadow: shadows.sm,
                  }}
                >
                  <button
                    onClick={() => setActiveTab("current")}
                    className="w-1/2 py-3 text-base font-semibold flex items-center justify-center gap-3 rounded-full transition-all duration-100"
                    style={{
                      background: activeTab === "current" ? colors.primary : "transparent",
                      color: activeTab === "current" ? colors.primaryForeground : colors.mutedForeground,
                      boxShadow: activeTab === "current" ? shadows.glow : "none",
                      transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <ClockIcon className="h-6 w-6" />
                    Current
                  </button>
                  <button
                    onClick={() => setActiveTab("archived")}
                    className="w-1/2 py-3 text-base font-semibold flex items-center justify-center gap-3 rounded-full transition-all duration-100"
                    style={{
                      background: activeTab === "archived" ? colors.primary : "transparent",
                      color: activeTab === "archived" ? colors.primaryForeground : colors.mutedForeground,
                      boxShadow: activeTab === "archived" ? shadows.glow : "none",
                      transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <ArchiveBoxIcon className="h-6 w-6" />
                    Archived
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.01 }}
                className="mb-1"
              >
                {/* ===================== */}
                {/* DESKTOP (unchanged)   */}
                {/* ===================== */}
                <div className="hidden lg:flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon
                        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: colors.mutedForeground }}
                      />
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 shadow-sm rounded-2xl w-56 border transition-all duration-100 focus:ring-2 focus:ring-primary focus:outline-none"
                        style={{
                          backgroundColor: colors.input,
                          borderColor: colors.border,
                          color: colors.foreground,
                        }}
                      />
                    </div>

                    {/* Status */}
                    <Listbox value={statusFilter} onChange={setStatusFilter}>
                      <div className="relative w-44">
                        <Listbox.Button
                          className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm border transition-all duration-150 hover:shadow-md"
                          style={{
                            backgroundColor: colors.input,
                            borderColor: colors.border,
                            color: colors.foreground,
                          }}
                        >
                          <ClipboardDocumentCheckIcon
                            className="w-5 h-5"
                            style={{ color: colors.mutedForeground }}
                          />
                          <span className="flex-1 text-left">
                            {statusOptions.find((o) => o.value === statusFilter)?.label ?? "All Status"}
                          </span>
                          <ChevronDownIcon className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                        </Listbox.Button>

                        <Listbox.Options
                          className="absolute z-50 mt-2 w-full rounded-2xl shadow-lg border overflow-hidden"
                          style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                          {statusOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value}>
                              {({ active, selected }) => (
                                <div
                                  className="cursor-pointer px-4 py-2 transition-colors"
                                  style={{
                                    backgroundColor: active ? colors.accent : "transparent",
                                    color: selected ? colors.foreground : colors.mutedForeground,
                                    fontWeight: selected ? 600 : 400,
                                  }}
                                >
                                  {option.label}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>

                    {/* Date */}
                    <Listbox value={dateFilter} onChange={setDateFilter}>
                      <div className="relative w-46">
                        <Listbox.Button
                          className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm border transition-all duration-150 hover:shadow-md"
                          style={{
                            backgroundColor: colors.input,
                            borderColor: colors.border,
                            color: colors.foreground,
                          }}
                        >
                          <CalendarDaysIcon className="w-5 h-5" style={{ color: colors.mutedForeground }} />
                          <span className="flex-1 text-left">
                            {dateOptions.find((o) => o.value === dateFilter)?.label}
                          </span>
                          <ChevronDownIcon className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                        </Listbox.Button>

                        <Listbox.Options
                          className="absolute z-50 mt-2 w-full rounded-2xl shadow-lg border overflow-hidden"
                          style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                          {dateOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value}>
                              {({ active, selected }) => (
                                <div
                                  className="cursor-pointer px-4 py-2 transition-colors"
                                  style={{
                                    backgroundColor: active ? colors.accent : "transparent",
                                    color: selected ? colors.foreground : colors.mutedForeground,
                                    fontWeight: selected ? 600 : 400,
                                  }}
                                >
                                  {option.label}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>

                    {/* Add */}
                    {activeTab === "current" && (
                      <motion.button
                        onClick={handleAddEntry}
                        className="px-6 py-3 rounded-2xl shadow-sm transition-all duration-100 hover:scale-102 active:scale-95 font-semibold"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.primaryForeground,
                          boxShadow: shadows.sm,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        + Add New Entry
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* ===================== */}
                {/* MOBILE/TABLET (new)   */}
                {/* ===================== */}
                <div className="lg:hidden grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {/* Search full */}
                  <div className="relative col-span-2">
                    <MagnifyingGlassIcon
                      className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: colors.mutedForeground }}
                    />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm shadow-sm rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                      style={{
                        backgroundColor: colors.input,
                        borderColor: colors.border,
                        color: colors.foreground,
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div className="w-full">
                    <Listbox value={statusFilter} onChange={setStatusFilter}>
                      <div className="relative w-full">
                        <Listbox.Button
                          className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm shadow-sm border"
                          style={{
                            backgroundColor: colors.input,
                            borderColor: colors.border,
                            color: colors.foreground,
                          }}
                        >
                          <ClipboardDocumentCheckIcon className="w-5 h-5" style={{ color: colors.mutedForeground }} />
                          <span className="flex-1 text-left truncate">
                            {statusOptions.find((o) => o.value === statusFilter)?.label ?? "All Status"}
                          </span>
                          <ChevronDownIcon className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                        </Listbox.Button>

                        <Listbox.Options
                          className="absolute z-50 mt-2 w-full rounded-xl shadow-lg border overflow-hidden"
                          style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                          {statusOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value}>
                              {({ active, selected }) => (
                                <div
                                  className="cursor-pointer px-4 py-2"
                                  style={{
                                    backgroundColor: active ? colors.accent : "transparent",
                                    color: selected ? colors.foreground : colors.mutedForeground,
                                    fontWeight: selected ? 600 : 400,
                                  }}
                                >
                                  {option.label}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Date */}
                  <div className="w-full">
                    <Listbox value={dateFilter} onChange={setDateFilter}>
                      <div className="relative w-full">
                        <Listbox.Button
                          className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm shadow-sm border"
                          style={{
                            backgroundColor: colors.input,
                            borderColor: colors.border,
                            color: colors.foreground,
                          }}
                        >
                          <CalendarDaysIcon className="w-5 h-5" style={{ color: colors.mutedForeground }} />
                          <span className="flex-1 text-left truncate">
                            {dateOptions.find((o) => o.value === dateFilter)?.label}
                          </span>
                          <ChevronDownIcon className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                        </Listbox.Button>

                        <Listbox.Options
                          className="absolute z-50 mt-2 w-full rounded-2xl shadow-lg border overflow-hidden"
                          style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                          {dateOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value}>
                              {({ active, selected }) => (
                                <div
                                  className="cursor-pointer px-4 py-2"
                                  style={{
                                    backgroundColor: active ? colors.accent : "transparent",
                                    color: selected ? colors.foreground : colors.mutedForeground,
                                    fontWeight: selected ? 600 : 400,
                                  }}
                                >
                                  {option.label}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Add full */}
                  {activeTab === "current" && (
                    <motion.button
                      onClick={handleAddEntry}
                      className="col-span-2 w-full px-5 py-2 text-md rounded-xl font-semibold"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryForeground,
                        boxShadow: shadows.sm,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Add New Entry
                    </motion.button>
                  )}
                </div>
              </motion.div>
              </div> {/* ✅ CLOSE Left Section (lg:w-[65%]) */}

              {/* ✅ Right Side: Notification */}
              <div className="w-full lg:w-[35%] lg:min-w-[280px] h-full flex flex-col">
                <FollowUpNotif
                  applications={applications}
                  isDark={isDark}
                  onDismiss={handleDismissFollowUp}
                  onEdit={(entry) => {
                    setEditEntry(entry);
                    setShowModal(true);
                  }}
                />
              </div>

              </motion.div> {/* ✅ CLOSE header wrapper (70/30 split) */}
              <div className="flex items-center gap-3 my-4">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: colors.border }}
                />
                <span
                  className="text-xs uppercase tracking-wide font-semibold"
                  style={{ color: colors.mutedForeground }}
                >
                  Applications
                </span>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: colors.border }}
                />
              </div>
          {/* Main Content Container */}
          <div className="flex-1 flex flex-col">
            {/* Main Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.01 }}
                className="flex-1 rounded-2xl overflow-hidden transition-all duration-300
           lg:border lg:bg-[var(--card-bg)]"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              boxShadow: shadows.sm,
              }}
            >
             {/* ===== DESKTOP (table) ===== */} <div className="hidden md:block">
            <div className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
              {/* gives horizontal scroll on small screens while keeping desktop normal */}
              <div className="min-w-[980px] sm:min-w-0">
                <table className="w-full table-auto">
                  <thead>
                    <tr
                      className="text-sm sm:text-base text-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryForeground,
                      }}
                    >
                      <th className="px-3 py-3 sm:px-6 sm:py-4 text-left font-semibold whitespace-nowrap">
                        Company
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Position
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Date Applied
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-3 py-3 sm:px-4 sm:py-2 font-semibold whitespace-nowrap">
                        Follow-Up Date
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Resume
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Comments
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Link
                      </th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        {/* IMPORTANT: colSpan should match your number of columns (9) */}
                        <td
                          colSpan={9}
                          className="text-center py-10 sm:py-12 transition-colors"
                          style={{ color: colors.mutedForeground }}
                        >
                          <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <div className="text-5xl sm:text-6xl">📝</div>
                            <p className="text-lg sm:text-xl font-medium">No applications yet</p>
                            <p className="text-sm sm:text-base">
                              Click “+ Add New Entry” to start tracking your applications
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((app, index) => (
                        <motion.tr
                          key={app._id || app.id}
                          className="text-sm sm:text-base border-b transition-colors duration-150 ease-out"
                          style={{
                            backgroundColor: colors.card,
                            color: colors.foreground,
                            borderColor: colors.border,
                          }}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, delay: index * 0.03 }}
                          whileHover={{ backgroundColor: colors.accent }}
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium whitespace-nowrap">
                            {app.company}
                          </td>

                          {/* allow position to wrap instead of forcing extra width */}
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-normal">
                            {app.position}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {app.applicationDate
                              ? new Date(app.applicationDate).toLocaleDateString("en-GB")
                              : "-"}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {getStatusBadge(app.status)}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {app.followUpDate
                              ? new Date(app.followUpDate).toLocaleDateString("en-GB")
                              : "-"}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {app.resume ? (
                              <a
                                href={`http://localhost:3000/api/internships/${app._id}/resume`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block underline text-xs sm:text-sm font-medium transition-transform duration-150 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                View
                              </a>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {app.comments ? (
                              <button
                                onClick={() => setCommentToView(app.comments)}
                                className="underline text-xs sm:text-sm font-medium transition-transform duration-150 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                View
                              </button>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>

                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            {Array.isArray(app.links) && app.links.length > 0 && app.links[0]?.url ? (
                              <a
                                href={app.links[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block underline text-xs sm:text-sm font-medium transition-transform duration-150 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                {app.links[0].label || "Link"}
                              </a>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>

                          {/* actions: stack on mobile, row on desktop */}
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                              <button
                                onClick={() => {
                                  setEditEntry({
                                    ...app,
                                    applicationDate: app.applicationDate
                                      ? new Date(app.applicationDate).toISOString()
                                      : "",
                                    ...(app.followUpDate && {
                                      followUpDate: new Date(app.followUpDate).toISOString(),
                                    }),
                                  });
                                  setShowModal(true);
                                }}
                                className="text-sm font-semibold transition-all duration-100 hover:underline hover:scale-105 active:scale-95"
                                style={{ color: colors.primary }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-sm font-semibold transition-all duration-100 hover:underline hover:scale-105 active:scale-95"
                                style={{ color: colors.destructive }}
                                onClick={() => handleDeleteEntry(app._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
            {/* ===== MOBILE (cards) ===== */}
            <div className="md:hidden space-y-3">
              {applications.length === 0 ? (
                <div
                  className="text-center py-10 rounded-2xl border"
                  style={{ borderColor: colors.border, color: colors.mutedForeground, background: colors.card }}
                >
                  <div className="text-5xl mb-2">📝</div>
                  <p className="text-lg font-medium">No applications yet</p>
                  <p className="text-sm">Tap “+ Add New Entry” to start tracking</p>
                </div>
              ) : (
                paginatedData.map((app, index) => (
                  <motion.div
                key={app._id || app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.03 }}
                className="rounded-3xl p-4 border"
                style={{
                backgroundColor: isDark
                  ? "rgba(59,130,246,0.08)"   // subtle blue for dark mode
                  : "rgba(59,130,246,0.05)",  // very light blue for light mode
                border: `1.5px solid ${colors.border}`,
                boxShadow: isDark
                  ? "0 1px 6px rgba(0,0,0,0.35)"
                  : "0 2px 6px rgba(0,0,0,0.08)",
              }}
                whileHover={{
                  y: -2,
                }}
              >
                  {/* Top row: Company + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Company
                        </p>
                        <p className="text-[15px] font-semibold truncate leading-tight"
                          style={{ color: colors.foreground }}>
                          {app.company || "-"}
                        </p>
                      </div>
                      <div className="shrink-0">{getStatusBadge(app.status)}</div>
                    </div>

                    {/* Position */}
                    <div className="mt-2">
                      <p className="text-[11px] under font-semibold uppercase tracking-wide"
                        style={{ color: colors.mutedForeground }}>
                        Position
                      </p>
                      <p className="text-[14px] font-medium leading-tight"
                        style={{ color: colors.foreground }}>
                        {app.position || "-"}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="mt-3 h-px" style={{ backgroundColor: colors.border }} />

                    {/* Dates */}
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Applied
                        </p>
                        <p className="text-[14px] font-semibold"
                          style={{ color: colors.foreground }}>
                          {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString("en-GB") : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Follow-up
                        </p>
                        <p className="text-[14px] font-semibold"
                          style={{ color: colors.foreground }}>
                          {app.followUpDate ? new Date(app.followUpDate).toLocaleDateString("en-GB") : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-3 h-px" style={{ backgroundColor: colors.border }} />

                    {/* Links row */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {/* Resume */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Resume
                        </p>
                        {app.resume ? (
                          <a
                            href={`http://localhost:3000/api/internships/${app._id}/resume`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-semibold underline underline-offset-2"
                            style={{ color: colors.primary }}
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-[13px]" style={{ color: colors.mutedForeground }}>-</span>
                        )}
                      </div>

                      {/* Job link */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Link
                        </p>
                        {Array.isArray(app.links) && app.links[0]?.url ? (
                          <a
                            href={app.links[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-semibold underline underline-offset-2"
                            style={{ color: colors.primary }}
                          >
                            {app.links[0].label || "Open"}
                          </a>
                        ) : (
                          <span className="text-[13px]" style={{ color: colors.mutedForeground }}>-</span>
                        )}
                      </div>

                      {/* Comments */}
                      <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: colors.mutedForeground }}>
                          Comments
                        </p>
                        {app.comments ? (
                          <button
                            onClick={() => setCommentToView(app.comments)}
                            className="text-[13px] font-semibold underline underline-offset-2"
                            style={{ color: colors.primary }}
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-[13px]" style={{ color: colors.mutedForeground }}>-</span>
                        )}
                      </div>
                    </div>


                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditEntry({
                            ...app,
                            applicationDate: app.applicationDate ? new Date(app.applicationDate).toISOString() : "",
                            ...(app.followUpDate && { followUpDate: new Date(app.followUpDate).toISOString() }),
                          });
                          setShowModal(true);
                        }}
                        className="flex-1 rounded-xl py-1.5 text-d font-semibold border"
                        style={{ borderColor: colors.border, color: colors.primary, background: "transparent" }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteEntry(app._id)}
                        className="flex-1 rounded-xl py-1.5 text-sm font-semibold"
                        style={{ background: colors.destructive, color: "#fff" }}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            </motion.div>

            {/* Pagination */}
            {applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-10 mt-4 px-2 sm:px-4"
                style={{ color: colors.foreground }}
              >
                {/* Rows per page section */}
                <div className="flex items-center gap-3">
                  <label htmlFor="rowsPerPage" className="font-medium text-sm">
                    Rows per page:
                  </label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-4 py-1 text-sm transition-all duration-100 focus:ring-2 focus:ring-primary focus:outline-none"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.foreground,
                    }}
                  >
                    {[5, 10, 20, 30, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">
                    Page {currentPage} of {Math.max(totalPages, 1)}
                  </span>

                  <div className="flex items-center gap-1">
                    {[
                      {
                        symbol: "«",
                        action: () => setCurrentPage(1),
                        disabled: currentPage === 1,
                      },
                      {
                        symbol: "‹",
                        action: () => setCurrentPage((p) => Math.max(p - 1, 1)),
                        disabled: currentPage === 1,
                      },
                      {
                        symbol: "›",
                        action: () =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages)),
                        disabled: currentPage === totalPages,
                      },
                      {
                        symbol: "»",
                        action: () => setCurrentPage(totalPages),
                        disabled: currentPage === totalPages,
                      },
                    ].map((btn, index) => (
                      <button
                        key={index}
                        onClick={btn.action}
                        disabled={btn.disabled}
                        className="border rounded-lg px-3 py-1 text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: colors.input,
                          borderColor: colors.border,
                          color: colors.foreground,
                        }}
                      >
                        {btn.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>


        </div>
      </motion.div>
      {showModal && (
            <AddEntryModal
              onClose={() => {
                setShowModal(false);
                setEditEntry(null);
              }}
              onSubmit={handleModalSubmit}
              onArchive={handleArchiveEntry}
              initialData={editEntry}
            />
          )}
    </>
  );
};
          
export default InternshipTable;
