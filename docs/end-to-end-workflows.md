# End-to-End System Workflows & Sequence Diagrams

This document illustrates the complete cross-layer journeys across **Frontend**, **Backend**, and **Database** for key day-to-day operations in the Edu-365 School Management System.

---

## 1. 🏫 Admin Registration & School Onboarding

When a new school administrator joins the platform, the school entity and admin account are provisioned simultaneously.

```mermaid
sequenceDiagram
    autonumber
    actor AdminUser as School Administrator
    participant UI as AdminRegisterPage.js
    participant Redux as userHandle.js (registerUser)
    participant API as Express Router (/AdminReg)
    participant Ctrl as admin-controller.js
    participant DB as MongoDB (admins collection)

    AdminUser->>UI: Enters Name, School Name, Email, Password
    UI->>Redux: dispatch(registerUser(fields, "Admin"))
    Redux->>API: POST /AdminReg { name, email, password, schoolName }
    API->>Ctrl: adminRegister(req, res)
    Ctrl->>DB: Admin.findOne({ email }) & Admin.findOne({ schoolName })
    
    alt Either Email or School Exists
        DB-->>Ctrl: Found existing document
        Ctrl-->>API: 200 OK { message: "Email / School already exists" }
        API-->>Redux: Response payload
        Redux-->>UI: Displays error banner
    else Unique Validation Passes
        Ctrl->>Ctrl: bcrypt.hash(password, 10)
        Ctrl->>DB: new Admin(...).save()
        DB-->>Ctrl: Saved Admin document
        Ctrl->>Ctrl: result.password = undefined
        Ctrl-->>API: 200 OK (Clean Admin Document)
        API-->>Redux: 200 OK + Admin profile
        Redux->>Redux: dispatch(authSuccess(data))
        Redux->>UI: Save to localStorage('user') & navigate to /Admin/dashboard
    end
```

---

## 2. 📚 Subject Creation & Teacher Allocation

Administrators link classes, subjects, and teachers to establish academic assignments.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant UI as AddTeacher.js / ChooseSubject.js
    participant Redux as teacherHandle.js
    participant API as Express Router (/TeacherReg)
    participant Ctrl as teacher-controller.js
    participant DB as MongoDB (teachers & subjects)

    Admin->>UI: Selects Class ("Grade 10"), Subject ("Math"), Enters Teacher Info
    UI->>Redux: dispatch(registerUser(fields, "Teacher"))
    Redux->>API: POST /TeacherReg { name, email, password, teachSubject, teachSclass, school }
    API->>Ctrl: teacherRegister(req, res)
    Ctrl->>DB: Teacher.findOne({ email })
    
    alt Email in use
        DB-->>Ctrl: Existing teacher
        Ctrl-->>UI: { message: "Email already exists" }
    else Valid
        Ctrl->>Ctrl: bcrypt.hash(password, 10)
        Ctrl->>DB: new Teacher(...).save()
        DB-->>Ctrl: Saved teacher document
        Ctrl->>DB: Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id })
        Note over DB: Bi-directional link established: Subject <--> Teacher
        Ctrl-->>API: 200 OK (Teacher Data)
        API-->>Redux: 200 OK
        Redux-->>UI: Updates teacher roster in state
    end
```

---

## 3. 🎓 Student Enrollment & Role Authentication

```mermaid
sequenceDiagram
    autonumber
    actor StudentUser as Student / Parent
    participant UI as LoginPage.js (role="Student")
    participant Redux as userHandle.js (loginUser)
    participant API as Express Router (/StudentLogin)
    participant Ctrl as student_controller.js
    participant DB as MongoDB (students collection)

    StudentUser->>UI: Inputs Student Name, Roll Number, and Password
    UI->>Redux: dispatch(loginUser({ rollNum, studentName, password }, "Student"))
    Redux->>API: POST /StudentLogin
    API->>Ctrl: studentLogIn(req, res)
    Ctrl->>DB: Student.findOne({ rollNum, name: studentName })
    
    alt Student Not Found
        DB-->>Ctrl: null
        Ctrl-->>UI: { message: "Student not found" }
    else Student Found
        Ctrl->>Ctrl: bcrypt.compare(inputPassword, storedHash)
        alt Password Mismatch
            Ctrl-->>UI: { message: "Invalid password" }
        else Password Valid
            Ctrl->>DB: student.populate('school', 'schoolName').populate('sclassName', 'sclassName')
            DB-->>Ctrl: Populated Student Document
            Ctrl->>Ctrl: Delete password, attendance, examResult from payload
            Ctrl-->>API: 200 OK (Cleaned Student Profile)
            API-->>Redux: 200 OK
            Redux->>Redux: Store in localStorage('user')
            Redux-->>UI: currentRole set to "Student" -> StudentDashboard renders
        end
    end
```

---

## 4. 📅 Attendance Marking & Visual Analytics Workflow

This workflow tracks how an instructor records student presence and how that updates the student's visual analytics charts.

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher
    participant TUI as StudentAttendance.js
    participant API as Express Router (/StudentAttendance/:id)
    participant SCtrl as student_controller.js
    participant DB as MongoDB (students collection)
    actor Student as Student
    participant SUI as ViewStdAttendance.js (Recharts)

    Teacher->>TUI: Selects Date, Subject, and Status ("Present" / "Absent")
    TUI->>API: PUT /StudentAttendance/:studentID { subName, status, date }
    API->>SCtrl: studentAttendance(req, res)
    
    SCtrl->>DB: Student.findById(studentID)
    alt Subject already recorded for date
        SCtrl->>DB: Update existing attendance entry in array
    else First record for date
        SCtrl->>DB: $push into student.attendance [{ subName, status, date }]
    end
    DB-->>SCtrl: Updated student document
    SCtrl-->>TUI: 200 OK (Success notification)

    Note over Student, SUI: Later: Student checks attendance dashboard
    Student->>SUI: Opens "My Attendance" Page
    SUI->>API: GET /Student/:studentID
    API->>SCtrl: getStudentDetail(req, res)
    SCtrl->>DB: Student.findById(id).populate("attendance.subName", "subName sessions")
    DB-->>SCtrl: Fully populated attendance array
    SCtrl-->>SUI: Return student record with attendance array
    SUI->>SUI: Calculate Present %: (Present Count / Total Sessions) * 100
    SUI->>Student: Renders interactive Pie Chart & Subject Breakdown Bar Chart
```

---

## 5. 📝 Exam Results Grading Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher
    participant UI as StudentExamMarks.js
    participant API as Express Router (/UpdateExamResult/:id)
    participant Ctrl as student_controller.js
    participant DB as MongoDB (students collection)

    Teacher->>UI: Inputs Marks (e.g., 85/100) for Subject
    UI->>API: PUT /UpdateExamResult/:studentID { subName, marksObtained }
    API->>Ctrl: updateExamResult(req, res)
    Ctrl->>DB: Student.findOne({ _id: studentID, 'examResult.subName': subName })
    
    alt Existing marks for this subject
        Ctrl->>DB: Student.updateOne({ 'examResult.subName': subName }, { $set: { 'examResult.$.marksObtained': marksObtained } })
    else First exam entry for this subject
        Ctrl->>DB: Student.findByIdAndUpdate(studentID, { $push: { examResult: { subName, marksObtained } } })
    end
    
    DB-->>Ctrl: Updated student record
    Ctrl-->>UI: 200 OK { message: "Exam marks successfully updated" }
```

---

## 6. 🚨 Grievance & Complaint Redressal Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student
    participant SUI as StudentComplain.js
    participant API as Express Router (/ComplainCreate, /ComplainList/:id)
    participant Ctrl as complain-controller.js
    participant DB as MongoDB (complains collection)
    actor Admin as Administrator
    participant AUI as SeeComplains.js

    Student->>SUI: Enters Grievance Details & Submits Form
    SUI->>API: POST /ComplainCreate { user: studentID, date, complaint, school: schoolID }
    API->>Ctrl: complainCreate(req, res)
    Ctrl->>DB: new Complain(...).save()
    DB-->>Ctrl: Complaint document saved
    Ctrl-->>SUI: 200 OK (Success message)

    Note over Admin, AUI: Administrator logs into Admin Dashboard
    Admin->>AUI: Clicks "Complains" Menu Item
    AUI->>API: GET /ComplainList/:schoolID
    API->>Ctrl: complainList(req, res)
    Ctrl->>DB: Complain.find({ school: schoolID }).populate("user", "name")
    DB-->>Ctrl: List of complaints with student names
    Ctrl-->>AUI: 200 OK [ { complaint, date, user: { name } } ]
    AUI->>Admin: Displays complaint table with student attribution
```
