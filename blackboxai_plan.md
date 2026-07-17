## Edit plan (approved prerequisite step)

### Information gathered
- Backend login endpoint: `backend/app/api/v1/auth.py` currently returns `LoginResponse` containing only `{access_token, token_type, student}`.
- Backend `AuthService.login()` fetches a full portal dashboard via `LivePortalService().get_dashboard()`, then upserts student and syncs attendance, and returns only token + minimal student fields.
- Live dashboard payload shape returned by `LivePortalService.get_dashboard()` already includes:
  - `student` {roll_number, name, course, branch, semester, cgpa}
  - `attendance` (parsed)
  - `marks` (parsed)
- Frontend flow:
  - `frontend/src/components/LoginView.tsx` calls `api.login()` and then triggers `onLoginSuccess(res.student)`.
  - `frontend/src/App.tsx` `handleLoginSuccess()` calls `loadAllData()` which performs `api.getDashboard(false)` → this is the duplicate dashboard request.

### Plan
#### Backend
1. Extend backend response model(s) only as required:
   - Update `backend/app/schemas/auth.py` `LoginResponse` to include `dashboard: dict` (or a dedicated dashboard schema if present; none currently).
2. Modify `backend/app/api/v1/auth.py` POST `/login` to return:
   - `{ access_token, token_type, student, dashboard }`
3. Modify `backend/app/services/auth_service.py`:
   - After `portal_data = LivePortalService().get_dashboard(...)`, include `dashboard: portal_data` in the returned result.

#### Frontend
4. Update `frontend/src/types.ts`:
   - Extend `LoginResponse` to include `dashboard: DashboardResponse`.
5. Update `frontend/src/App.tsx`:
   - Change `handleLoginSuccess` to accept the whole login response (or use the returned `res.dashboard`).
   - Remove the `await loadAllData()` call from the login success path.
   - Populate:
     - `setStudent(loginRes.dashboard.student)`
     - `setStats(...)` using `dashboard.attendance` same mapping used in `loadAllData()`
     - `setSubjects(...)` and `setSubjectWise(...)`
     - `setMarks(...)` from `dashboard.marks`
6. Update `frontend/src/components/LoginView.tsx`:
   - Call `onLoginSuccess(res)` (pass full response, not just student) so `App.tsx` can reuse `dashboard`.
7. Keep refresh=true working:
   - Do not change `api.getDashboard(refresh)` or sync handler `handleSyncTriggered`.
8. Remove unnecessary GET `/dashboard` after login:
   - The login success path will no longer call `loadAllData()`.

### Dependent files to edit
- `backend/app/schemas/auth.py`
- `backend/app/api/v1/auth.py`
- `backend/app/services/auth_service.py`
- `frontend/src/types.ts`
- `frontend/src/lib/api.ts` (type only; runtime same)
- `frontend/src/components/LoginView.tsx`
- `frontend/src/App.tsx`

### Follow-up steps
- Run frontend TypeScript build/typecheck.
- Run backend startup and (if available) lint/tests.

<ask_followup_question>
Do you want me to proceed with this exact plan (backend login response extended + frontend bootstrapping from login dashboard, removing `loadAllData()` after login)?
</ask_followup_question>

