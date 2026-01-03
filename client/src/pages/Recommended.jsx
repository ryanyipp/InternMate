import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ShopeeLogo from "../assets/shopee logo.png";
import GrabLogo from "../assets/grablogo.svg";
import GoogleLogo from "../assets/google logo.webp";
import SeaLogo from "../assets/seagroup.png";
import BytedanceLogo from "../assets/bytedance.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDarkMode from "../hooks/useDarkMode";
import Navbar from "../components/Navbar";
import { getExternalInternships, getRecommendedInternships, createInternship } from "../api/index";
import { 
  transformExternalJob, 
  getDynamicLocationOptions, 
  getUniqueCompanies, 
  getUniqueSources,
  filterJobsByLocation 
} from "../utils/jobUtils";
import { getThemeColors } from "../utils/theme";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const applicationTimeline = [
  { week: "Week 1", count: 2 },
  { week: "Week 2", count: 4 },
  { week: "Week 3", count: 1 },
  { week: "Week 4", count: 5 },
];

const roleBreakdown = [
  { name: "Frontend", value: 54 },
  { name: "Backend", value: 25 },
  { name: "Data", value: 15 },
  { name: "UX", value: 6 },
];

const keywordCloud = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Redux",
  "Figma",
];
const matchScore = 82;

const mockJobs = [
  {
    id: 1,
    title: "React Frontend Developer",
    company: "Shopee",
    location: "Singapore",
    logo: ShopeeLogo,
    source: "LinkedIn",
  },
  {
    id: 2,
    title: "Frontend Software Engineer (React/Next.js)",
    company: "Google",
    location: "Remote",
    logo: GoogleLogo,
    source: "Indeed",
  },
  {
    id: 3,
    title: "UI Developer",
    company: "Grab",
    location: "Singapore",
    logo: GrabLogo,
    source: "MyCareersFuture",
  },
  {
    id: 4,
    title: "Frontend Engineer (React + Tailwind)",
    company: "Sea Group",
    location: "Singapore",
    logo: SeaLogo,
    source: "Glassdoor",
  },
  {
    id: 5,
    title: "Web UI Intern",
    company: "Bytedance",
    location: "Singapore",
    logo: BytedanceLogo,
    source: "Indeed",
  },
];

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

const Recommended = () => {
  const [isDark, setIsDark] = useDarkMode();
  const colors = getThemeColors(isDark);
  const navigate = useNavigate();  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  
  // Dynamic filter options
  const [locationOptions, setLocationOptions] = useState(['All']);
  const [companyOptions, setCompanyOptions] = useState(['All']);
  const [sourceOptions, setSourceOptions] = useState(['All']);

  // Extract fetchExternalInternships as a separate function for reuse
  const fetchExternalInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user skills from localStorage to personalize recommendations
      const currentUser = JSON.parse(localStorage.getItem("profile")) || 
                        JSON.parse(sessionStorage.getItem("profile"));
      
      // Use broader skills for better matching with real API data
      const userSkills = []; // Empty array means no skill filtering initially
      
      // Don't filter by location initially - show all available jobs
      const data = await getRecommendedInternships(userSkills, "");
        // Add company logos to the data
      const jobsWithLogos = data.slice(0, 10).map(job => ({
        ...job,
        logo: getCompanyLogo(job.company)
      }));
      
      console.log('🎯 Jobs with logos sample:', jobsWithLogos[0]);
      console.log('📊 Available locations:', jobsWithLogos.map(job => job.location));
      console.log('🏢 Available companies:', jobsWithLogos.map(job => job.company));
      console.log('📡 Available sources:', jobsWithLogos.map(job => job.source));
        setExternalJobs(jobsWithLogos);
      setFilteredJobs(jobsWithLogos);
      
      // Update dynamic filter options based on the fetched data
      setLocationOptions(getDynamicLocationOptions(jobsWithLogos));
      setCompanyOptions(['All', ...getUniqueCompanies(jobsWithLogos)]);
      setSourceOptions(['All', ...getUniqueSources(jobsWithLogos)]);
    } catch (err) {
      console.error("Error fetching external internships:", err);
      setError("Failed to load external internships. Using mock data.");      // Fallback to mock data if API fails
      setExternalJobs(mockJobs);
      setFilteredJobs(mockJobs);
      
      // Set default filter options for mock data
      setLocationOptions(['All', 'Singapore', 'Remote']);
      setCompanyOptions(['All', 'Shopee', 'Google', 'Grab', 'Sea Group', 'Bytedance']);
      setSourceOptions(['All', 'LinkedIn', 'Indeed', 'MyCareersFuture', 'Glassdoor']);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh jobs
  const handleRefreshJobs = async () => {
    console.log('🔄 Refreshing jobs...');
    await fetchExternalInternships();
    toast.success("Jobs refreshed successfully!");
  };

  // Fetch external internships on component mount
  useEffect(() => {
    fetchExternalInternships();
  }, []);
  // Filter jobs based on search term, location, company, and source
  useEffect(() => {
    let filtered = externalJobs.length > 0 ? externalJobs : mockJobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "All") {
      console.log(`🌍 Filtering by location: "${locationFilter}"`);
      console.log('📍 Available locations:', filtered.map(job => job.location));
        // Use enhanced location filtering
      filtered = filterJobsByLocation(filtered, locationFilter);
      
      console.log(`🌍 After location filter: ${filtered.length} jobs remaining`);
    }

    if (companyFilter !== "All") {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (sourceFilter !== "All") {
      filtered = filtered.filter(job => 
        job.source.toLowerCase().includes(sourceFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [externalJobs, searchTerm, locationFilter, companyFilter, sourceFilter]); // Add sourceFilter dependency
  // Helper function to get company logos
  const getCompanyLogo = (companyName) => {
    if (!companyName) return null;
    const company = companyName.toLowerCase();
    if (company.includes('shopee')) return ShopeeLogo;
    if (company.includes('grab')) return GrabLogo;
    if (company.includes('google')) return GoogleLogo;
    if (company.includes('sea')) return SeaLogo;
    if (company.includes('bytedance') || company.includes('tiktok')) return BytedanceLogo;
    return null; // Will show company initial instead
  };

  // Function to add external job to user's internship tracker
  const handleAddToTracker = async (job) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("profile")) || 
                        JSON.parse(sessionStorage.getItem("profile"));
      
      if (!currentUser?.id) {
        toast.error("Please log in to add jobs to your tracker");
        return;
      }

      const internshipData = {
        companyName: job.company,
        position: job.title,
        applicationDate: new Date().toISOString().split('T')[0],
        status: "Applied",
        location: job.location,
        jobUrl: job.applyUrl || "",
        notes: `Added from external recommendations - ${job.source}`,
        salary: job.salary || "",
        user: currentUser.id
      };

      await createInternship(internshipData);
      toast.success(`Added "${job.title}" at ${job.company} to your tracker!`);
    } catch (error) {
      console.error("Error adding job to tracker:", error);
      toast.error("Failed to add job to tracker");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    navigate("/login");
    toast.success("Successfully logged out");
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
        transition={{ duration: 0.2 }}
        style={{
          minHeight: '100vh',
          background: colors.background,
          color: colors.foreground,
        }}
        className="p-4 sm:p-10 font-sans transition-colors duration-300"
      >
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-4xl font-extrabold mb-2" style={{ color: colors.primary }}>
            Recommended Listings
          </h2>
          <p className="text-lg" style={{ color: colors.mutedForeground }}>
            Based on your internship applications, we've curated job suggestions
            tailored to your interests.
          </p>
        </div>

        {/* Line chart + pie chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Application Activity */}
          <div className="rounded-xl shadow-sm border p-5 h-full" style={{ background: colors.card, borderColor: colors.border }}>
            <h4 className="font-semibold mb-3 text-lg" style={{ color: colors.cardForeground }}>
              Application Activity
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={applicationTimeline}>
                <XAxis dataKey="week" stroke={colors.mutedForeground} />
                <YAxis allowDecimals={false} stroke={colors.mutedForeground} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", background: colors.card, color: colors.cardForeground }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={colors.primary}
                  strokeWidth={3}
                  dot={{ r: 4, stroke: colors.primary, fill: colors.background }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart – Role Focus */}
          <div className="rounded-xl shadow-sm border p-5 h-full flex flex-col items-center justify-center" style={{ background: colors.card, borderColor: colors.border }}>
            <h4 className="font-semibold mb-3 text-lg" style={{ color: colors.cardForeground }}>
              Application Role Focus
            </h4>
            <div className="w-full h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roleBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors.chart?.[index + 1] || colors.primary}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", background: colors.card, color: colors.cardForeground }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-center" style={{ color: colors.mutedForeground }}>
              Shows how your applications are distributed across roles.
            </p>
          </div>
        </div>

        {/* Skill Match Score and Keyword Cloud */}
        <div className="rounded-xl shadow-sm border p-5 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="flex flex-col items-center justify-center">
            <h4 className="font-semibold text-lg mb-2" style={{ color: colors.cardForeground }}>
              Skill Match Score
            </h4>
            <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner" style={{ background: colors.accent }}>
              <span className="text-4xl font-extrabold" style={{ color: colors.primary }}>
                {matchScore}%
              </span>
            </div>
            <p className="mt-2 text-sm text-center" style={{ color: colors.mutedForeground }}>
              Reflects how well your skills align with the roles you applied to.
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold mb-3 text-lg" style={{ color: colors.cardForeground }}>
              Frequently Mentioned Skills
            </h4>
            <div className="flex flex-wrap gap-3">
              {keywordCloud.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full font-medium"
                  style={{ background: colors.accent, color: colors.primary }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Based on Activity */}
        <div
          className="rounded-xl p-5 mb-10 text-sm"
          style={{
            background: isDark ? colors.card : colors.secondary,
            border: `1px solid ${colors.accent}`,
            color: isDark ? colors.foreground : colors.cardForeground,
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
            💡 Tips Based on Your Activity
          </h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You're targeting frontend heavily – consider applying to
              full-stack roles to widen your scope.
            </li>
            <li>
              React and JavaScript are trending in your applications – ensure
              your resume reflects strength in them.
            </li>
            <li>Explore more remote roles – your last 3 were all onsite.</li>
          </ul>
        </div>
        {/* Filter and Search Section */}
        <div className="rounded-xl shadow-sm border p-5 mb-6" style={{ background: colors.card, borderColor: colors.border }}>
          <h4 className="font-semibold text-lg mb-4" style={{ color: colors.cardForeground }}>Filter Opportunities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
                Search by title or company
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Frontend Engineer, Google"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors.input, background: colors.background, color: colors.foreground }}
              />
            </div>
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors.input, background: colors.background, color: colors.foreground }}
              >
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
                Company
              </label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors.input, background: colors.background, color: colors.foreground }}
              >
                {companyOptions.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.mutedForeground }}>
                Source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ borderColor: colors.input, background: colors.background, color: colors.foreground }}
              >
                {sourceOptions.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Results Count */}
          <div className="mt-4 text-sm" style={{ color: colors.mutedForeground }}>
            Showing {filteredJobs.length} of {externalJobs.length || mockJobs.length} opportunities
            {searchTerm && ` matching "${searchTerm}"`}
            {locationFilter !== "All" && ` in ${locationFilter}`}
            {companyFilter !== "All" && ` at ${companyFilter}`}
            {sourceFilter !== "All" && ` from ${sourceFilter}`}
          </div>
        </div>
        {/* Suggested Job Listings */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg" style={{ color: colors.cardForeground }}>
            Suggested Opportunities
            {loading && <span style={{ color: colors.primary }} className="ml-2">(Loading...)</span>}
            {error && <span style={{ color: colors.destructive }} className="ml-2 text-sm">({error})</span>}
          </h4>
          <button
            onClick={handleRefreshJobs}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${loading ? '' : 'hover:opacity-90'}`}
            style={{
              background: loading ? colors.muted : colors.primary,
              color: loading ? colors.mutedForeground : colors.primaryForeground,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            🔄 Refresh Jobs
          </button>
        </div>
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-5 rounded-xl border animate-pulse" style={{ background: colors.card, borderColor: colors.border }}>
                <div className="h-10 w-20" style={{ background: colors.muted, borderRadius: 8, marginBottom: 12 }}></div>
                <div className="h-4" style={{ background: colors.muted, borderRadius: 8, marginBottom: 8 }}></div>
                <div className="h-3 w-3/4" style={{ background: colors.muted, borderRadius: 8, marginBottom: 12 }}></div>
                <div className="h-6 w-20" style={{ background: colors.muted, borderRadius: 8 }}></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4" style={{ color: colors.mutedForeground }}>🔍</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.cardForeground }}>No opportunities found</h3>
            <p className="mb-4" style={{ color: colors.mutedForeground }}>
              Try adjusting your search criteria or clearing filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("All");
                setCompanyFilter("All");
                setSourceFilter("All");
              }}
              className="px-4 py-2 rounded-lg transition"
              style={{ background: colors.primary, color: colors.primaryForeground }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl shadow-md border hover:shadow-lg transition relative"
                style={{ background: colors.card, borderColor: colors.border }}
              >
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="h-10 w-auto mb-3 object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 mb-3 rounded-full flex items-center justify-center" style={{ background: colors.accent }}>
                    <span className="font-bold text-sm" style={{ color: colors.primary }}>
                      {job.company?.charAt(0) || 'C'}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold line-clamp-2" style={{ color: colors.primary }}>{job.title}</h3>
                <p className="text-sm mb-2" style={{ color: colors.cardForeground }}>
                  {job.company} – {job.location}
                </p>
                {job.salary && job.salary !== "Competitive" && (
                  <p className="text-sm font-medium mb-2" style={{ color: colors.cardForeground }}>
                    💰 {job.salary.value.minValue}/{job.salary.value.unitText} - {job.salary.value.maxValue}/{job.salary.value.unitText}
                  </p>
                )}
                {job.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: colors.mutedForeground }}>
                    {job.description}
                  </p>
                )}
                <div className="flex justify-between items-center gap-2">
                  <span className="inline-block text-sm font-medium px-2 py-1 rounded" style={{ background: colors.accent, color: colors.primary }}>
                    Source: {job.source}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToTracker(job)}
                      className="text-xs px-2 py-1 rounded hover:opacity-90 transition"
                      style={{ background: colors.secondary, color: colors.secondaryForeground }}
                      title="Add to your internship tracker"
                    >
                      + Track
                    </button>
                    {job.applyUrl && job.applyUrl !== "#" ? (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded hover:opacity-90 transition"
                        style={{ background: colors.primary, color: colors.primaryForeground }}
                      >
                        Apply
                      </a>
                    ) : (
                      <button
                        onClick={() => toast.info("Application link not available")}
                        className="text-xs px-2 py-1 rounded cursor-not-allowed"
                        style={{ background: colors.muted, color: colors.mutedForeground }}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Back to Dashboard */}
        <div className="text-sm" style={{ color: colors.mutedForeground }}>
          <Link to="/dashboard" style={{ color: colors.primary }} className="hover:underline">
            ← Back to Internship Tracker
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Recommended;
