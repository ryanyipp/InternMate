import axios from 'axios';
import { API_CONFIG } from '../config/api.js';
import { transformExternalJob, filterJobsBySkills, filterJobsByLocation } from '../utils/jobUtils.js';

const API = axios.create({baseURL: 'http://localhost:3000/api'});

// External API for fetching internships from RapidAPI
const EXTERNAL_API = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'x-rapidapi-key': API_CONFIG.RAPIDAPI_KEY,
    'x-rapidapi-host': API_CONFIG.RAPIDAPI_HOST
  },
  timeout: 10000 // 10 second timeout
});

export const login = (formData) => API.post('/users/login', formData);
export const forgotPassword = (formData) => API.post('/users/forgotPassword', formData)
export const register = (formData) => API.post('/users/register', formData);

// Get user information by ID
export const getUserById = (userId) => API.get(`/users/${userId}`);

// this is for Add Entry
export const getInternship = () => API.get('/internships');

// Improved internship creation with proper file upload handling
export const createInternship = (formData) => {
  return API.post('/internships', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// for delete entry
export const deleteInternship = (userId, internshipId) =>
  API.delete(`/internships/${userId}/internship/${internshipId}`);

// for updating internship status
export const updateInternshipStatus = (userId, internshipId, status) =>
  API.patch(`/internships/${userId}/internship/${internshipId}/status`, { status });

// for updating internship entry
export const updateInternship = (userId, internshipId, formData) =>
  API.patch(`/internships/${userId}/internship/${internshipId}`, formData);

// for dismissing followup notif 
export const dismissFollowUp = (internshipId) =>
  API.patch(`/internships/${internshipId}/dismiss-follow-up`);

// for updating followup notif 
export const updateFollowUp = (internshipId, payload) =>
  API.patch(`/internships/${internshipId}/follow-up`, payload);


// External API functions

export const getExternalInternships = async () => {
  try {
    console.log('🔄 Fetching from external API...');
    const response = await EXTERNAL_API.get('/active-ats-7d');
    console.log('✅ API Response received:', response.status);
    
    // Handle different response structures
    let jobsData = response.data;
    console.log('📊 Raw jobs data type:', typeof jobsData, 'Length:', Array.isArray(jobsData) ? jobsData.length : 'Not an array');
    
    if (jobsData.data) jobsData = jobsData.data;
    if (jobsData.jobs) jobsData = jobsData.jobs;
    if (jobsData.results) jobsData = jobsData.results;
    
    // Ensure we have an array
    if (!Array.isArray(jobsData)) {
      console.warn('External API returned non-array data:', jobsData);
      return [];
    }
    
    // Transform the data
    const transformedJobs = jobsData.map((job, index) => transformExternalJob(job, index));
    console.log('🔄 Transformed jobs:', transformedJobs.length);
    console.log('📋 Sample transformed job:', transformedJobs[0]);
    
    return transformedJobs;
  } catch (error) {
    console.error('❌ Error fetching external internships:', error);
    
    // Return detailed error info for debugging
    if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    }
    
    throw error;
  }
};

// Disabled external API fetch due to quota limit
// export const getExternalInternships = async () => {
//   console.warn("⚠️ External API call skipped (quota limit reached)");
//   return []; // return empty array to prevent frontend crash
// };


// // Function to get filtered internships based on skills/preferences
export const getRecommendedInternships = async (skills = [], location = '') => {
  try {
    console.log('🎯 Getting recommended internships with skills:', skills, 'location:', location);
    let internships = await getExternalInternships();
    console.log('📊 Raw internships count:', internships.length);
    
    // Apply filters
    if (skills.length > 0) {
      const beforeSkillFilter = internships.length;
      internships = filterJobsBySkills(internships, skills);
      console.log(`🔍 After skills filter: ${internships.length} (from ${beforeSkillFilter})`);
    }
    
    if (location && location !== "All") {
      const beforeLocationFilter = internships.length;
      internships = filterJobsByLocation(internships, location);
      console.log(`📍 After location filter: ${internships.length} (from ${beforeLocationFilter})`);
    }
    
    // Sort by date posted (newest first)
    internships.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    
    console.log('✅ Final recommended internships:', internships.length);
    return internships;
  } catch (error) {
    console.error('❌ Error fetching recommended internships:', error);
    throw error;
  }
};

// export const getRecommendedInternships = async (skills = [], location = '') => {
//   console.warn("⚠️ getRecommendedInternships is using fallback due to disabled external API");
//   return []; // return empty recommendations
// };


