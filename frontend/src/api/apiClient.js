import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

/**
 * Centralized Lumina Axios HTTP Client
 * Pre-configured with base URL, timeout, and defensive interceptors.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach timestamp and optional logging
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Defensive logging and status inspection
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Lumina ApiClient: Unauthorized / Forbidden response detected.", error.response);
    }
    return Promise.reject(error);
  }
);

/**
 * 1. Authentication Endpoints
 * Supports Admin, Teacher, and Student login & registration
 */
export const authApi = {
  adminLogin: (credentials) => apiClient.post("/AdminLogin", credentials),
  teacherLogin: (credentials) => apiClient.post("/TeacherLogin", credentials),
  studentLogin: (credentials) => apiClient.post("/StudentLogin", credentials),
  adminRegister: (data) => apiClient.post("/AdminReg", data),
  teacherRegister: (data) => apiClient.post("/TeacherReg", data),
  studentRegister: (data) => apiClient.post("/StudentReg", data),
};

/**
 * 2. Academic Setup Endpoints
 * Classes, Subjects, and Allocation
 */
export const academicApi = {
  // Sclass
  createClass: (data) => apiClient.post("/SclassCreate", data),
  getClasses: (schoolId) => apiClient.get(`/SclassList/${schoolId}`),
  getClassDetail: (classId) => apiClient.get(`/Sclass/${classId}`),
  getClassStudents: (classId) => apiClient.get(`/Sclass/Students/${classId}`),
  deleteClass: (classId) => apiClient.delete(`/Sclass/${classId}`),
  deleteClasses: (schoolId) => apiClient.delete(`/Sclasses/${schoolId}`),

  // Subjects
  createSubject: (data) => apiClient.post("/SubjectCreate", data),
  getClassSubjects: (classId) => apiClient.get(`/ClassSubjects/${classId}`),
  getAllSubjects: (schoolId) => apiClient.get(`/AllSubjects/${schoolId}`),
  getFreeSubjects: (schoolId) => apiClient.get(`/FreeSubjectList/${schoolId}`),
  getSubjectDetail: (subjectId) => apiClient.get(`/Subject/${subjectId}`),
  deleteSubject: (subjectId) => apiClient.delete(`/Subject/${subjectId}`),
  deleteSubjects: (schoolId) => apiClient.delete(`/Subjects/${schoolId}`),
  updateTeacherSubject: (data) => apiClient.put("/TeacherSubject", data),
};

/**
 * 3. Daily Classroom & Student Evaluation Endpoints
 * Daily Attendance & Marks recording
 */
export const classroomApi = {
  // Attendance & Marks
  updateAttendance: (studentId, { subName, status, date }) =>
    apiClient.put(`/StudentAttendance/${studentId}`, { subName, status, date }),
  updateExamResult: (studentId, { subName, marksObtained }) =>
    apiClient.put(`/UpdateExamResult/${studentId}`, { subName, marksObtained }),

  // Students
  getStudents: (schoolId) => apiClient.get(`/Students/${schoolId}`),
  getStudentDetail: (studentId) => apiClient.get(`/Student/${studentId}`),
  updateStudent: (studentId, fields) => apiClient.put(`/Student/${studentId}`, fields),
  deleteStudent: (studentId) => apiClient.delete(`/Student/${studentId}`),
  deleteStudents: (schoolId) => apiClient.delete(`/Students/${schoolId}`),

  // Teachers
  getTeachers: (schoolId) => apiClient.get(`/Teachers/${schoolId}`),
  getTeacherDetail: (teacherId) => apiClient.get(`/Teacher/${teacherId}`),
  deleteTeacher: (teacherId) => apiClient.delete(`/Teacher/${teacherId}`),
  deleteTeachers: (schoolId) => apiClient.delete(`/Teachers/${schoolId}`),
};

/**
 * 4. School Bulletin & Grievance Endpoints
 * Notices & Ethical Grievances
 */
export const bulletinApi = {
  getNotices: (schoolId) => apiClient.get(`/NoticeList/${schoolId}`),
  createNotice: (data) => apiClient.post("/NoticeCreate", data),
  updateNotice: (noticeId, data) => apiClient.put(`/Notice/${noticeId}`, data),
  deleteNotice: (noticeId) => apiClient.delete(`/Notice/${noticeId}`),
  deleteNotices: (schoolId) => apiClient.delete(`/Notices/${schoolId}`),
};

export const grievanceApi = {
  getComplains: (schoolId) => apiClient.get(`/ComplainList/${schoolId}`),
  createComplain: (data) => apiClient.post("/ComplainCreate", data),
};

export default apiClient;
