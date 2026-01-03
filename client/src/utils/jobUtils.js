// Utility functions for external API data processing

// Transform external API job data to internal format
export const transformExternalJob = (externalJob, index = 0) => {
  // Extract location from locations_derived array or locations_raw
  const getLocation = () => {
    if (externalJob.locations_derived && externalJob.locations_derived.length > 0) {
      return externalJob.locations_derived[0];
    }
    if (externalJob.locations_raw && externalJob.locations_raw.length > 0) {
      const locationRaw = externalJob.locations_raw[0];
      if (locationRaw.address) {
        const addr = locationRaw.address;
        const parts = [
          addr.addressLocality,
          addr.addressRegion,
          addr.addressCountry
        ].filter(Boolean);
        return parts.join(', ') || 'Remote';
      }
    }
    return 'Remote';
  };
  return {
    id: externalJob.id || `ext_${index}`,
    title: externalJob.title || "Software Engineer Intern",
    company: externalJob.organization || "Tech Company",
    location: getLocation(),
    description: externalJob.description || "",
    requirements: externalJob.requirements || "",
    applyUrl: externalJob.url || "#",
    salary: externalJob.salary_raw || "Competitive",
    datePosted: externalJob.date_posted || new Date().toISOString(),
    source: externalJob.source || "External API",
    jobType: externalJob.employment_type ? externalJob.employment_type.join(', ') : "Internship",
    remote: externalJob.remote_derived || false,
    tags: externalJob.tags || [],
    organizationLogo: externalJob.organization_logo || null,
    // Add additional useful fields
    country: externalJob.countries_derived ? externalJob.countries_derived[0] : 'Unknown',
    city: externalJob.cities_derived ? externalJob.cities_derived[0] : 'Unknown',
    region: externalJob.regions_derived ? externalJob.regions_derived[0] : 'Unknown'
  };
};

// Filter jobs based on skills (more flexible matching)
export const filterJobsBySkills = (jobs, skills) => {
  if (!skills || skills.length === 0) return jobs;
  
  return jobs.filter(job => {
    const searchText = `${job.title} ${job.description} ${job.requirements} ${job.company}`.toLowerCase();
    
    // Check for direct skill matches
    const hasSkillMatch = skills.some(skill => 
      searchText.includes(skill.toLowerCase())
    );
    
    // Also include tech-related keywords for broader matching
    const techKeywords = ['engineer', 'developer', 'software', 'tech', 'it', 'intern', 'student'];
    const hasTechMatch = techKeywords.some(keyword => 
      searchText.includes(keyword)
    );
    
    return hasSkillMatch || hasTechMatch;
  });
};

// Enhanced location filtering with better matching
export const filterJobsByLocation = (jobs, location) => {
  if (!location || location === "All") return jobs;
  
  return jobs.filter(job => {
    const filterLocation = location.toLowerCase();
    
    // Check various location fields for better matching
    const locationMatches = [
      job.location?.toLowerCase().includes(filterLocation),
      job.country?.toLowerCase().includes(filterLocation),
      job.city?.toLowerCase().includes(filterLocation),
      job.region?.toLowerCase().includes(filterLocation)
    ];
    
    return locationMatches.some(match => match);
  });
};

// Get unique locations from jobs array
export const getUniqueLocations = (jobs) => {
  const locations = new Set();
  jobs.forEach(job => {
    if (job.location) {
      locations.add(job.location);
    }
  });
  return Array.from(locations).sort();
};

// Get unique companies from jobs array
export const getUniqueCompanies = (jobs) => {
  const companies = new Set();
  jobs.forEach(job => {
    if (job.company) {
      companies.add(job.company);
    }
  });
  return Array.from(companies).sort();
};

// Get unique countries from jobs array
export const getUniqueCountries = (jobs) => {
  const countries = new Set();
  jobs.forEach(job => {
    if (job.country && job.country !== 'Unknown') {
      countries.add(job.country);
    }
  });
  return Array.from(countries).sort();
};

// Get unique cities from jobs array
export const getUniqueCities = (jobs) => {
  const cities = new Set();
  jobs.forEach(job => {
    if (job.city && job.city !== 'Unknown') {
      cities.add(job.city);
    }
  });
  return Array.from(cities).sort();
};

// Get unique regions from jobs array
export const getUniqueRegions = (jobs) => {
  const regions = new Set();
  jobs.forEach(job => {
    if (job.region && job.region !== 'Unknown') {
      regions.add(job.region);
    }
  });
  return Array.from(regions).sort();
};

// Generate dynamic location options (combining cities, regions, and countries)
export const getDynamicLocationOptions = (jobs) => {
  const options = new Set(['All']);
  
  jobs.forEach(job => {
    // Add full location
    if (job.location) {
      options.add(job.location);
    }
    
    // Add country
    if (job.country && job.country !== 'Unknown') {
      options.add(job.country);
    }
    
    // Add city
    if (job.city && job.city !== 'Unknown') {
      options.add(job.city);
    }
    
    // Add region
    if (job.region && job.region !== 'Unknown') {
      options.add(job.region);
    }
  });
  
  return Array.from(options).sort();
};

// Get unique sources from jobs array
export const getUniqueSources = (jobs) => {
  const sources = new Set();
  jobs.forEach(job => {
    if (job.source) {
      sources.add(job.source);
    }
  });
  return Array.from(sources).sort();
};

// Enhanced location filtering with better matching
export const filterJobsByLocationEnhanced = (jobs, location) => {
  if (!location || location === "All") return jobs;
  
  return jobs.filter(job => {
    const filterLocation = location.toLowerCase();
    
    // Check various location fields
    const locationMatches = [
      job.location?.toLowerCase().includes(filterLocation),
      job.country?.toLowerCase().includes(filterLocation),
      job.city?.toLowerCase().includes(filterLocation),
      job.region?.toLowerCase().includes(filterLocation)
    ];
    
    return locationMatches.some(match => match);
  });
};
