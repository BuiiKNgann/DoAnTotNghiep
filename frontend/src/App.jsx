import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import StudentInfoPage from "./pages/StudentInfoPage";
import StudentManagement from "./pages/StudentManagement";
import ParentManagement from "./pages/ParentManagement";
import TeacherManagement from "./pages/TeacherManager";
import SemesterManagement from "./pages/SemesterManagement";
import SubjectManagement from "./pages/SubjectManagement";
import TeacherAssignmentManagement from "./pages/TeacherAssignmentManagement";
import ClassManagement from "./pages/ClassManagement";
import TimetableManagement from "./pages/TimetableManagement";
import GradeManagement from "./pages/GradeManagement";
import AttendancePage from "./pages/AttendancePage";
import ConductPage from "./pages/ConductPage";
// import GradeManagement from "./pages/GradeManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stuInfo" element={<StudentInfoPage />} />
        <Route path="/stuManagement" element={<StudentManagement />} />
        <Route path="/parentManagement" element={<ParentManagement />} />
        <Route path="/teacherManagement" element={<TeacherManagement />} />
        <Route path="/semester" element={<SemesterManagement />} />
        <Route path="/subject" element={<SubjectManagement />} />
        <Route path="/timetable" element={<TimetableManagement />} />
        <Route path="/gradeManagement" element={<GradeManagement />} />
        <Route
          path="/teacherAssignment"
          element={<TeacherAssignmentManagement />}
        />
        <Route path="/class" element={<ClassManagement />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/conduct" element={<ConductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
