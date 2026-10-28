-- One-off: folds the old client_tasks table into tasks, then renames it so this can't run twice.
-- Run BEFORE (or at the same time as) deploying the code that no longer reads client_tasks:
--   psql "$DATABASE_URL" -f prisma/merge-client-tasks-into-tasks.sql
-- Each client task becomes a task with category 'client_follow_up' and its client_id, same people, text, date and status.
-- Closed ones get closed_at = due_date so the daily cleanup (6 months after closing) treats them like other closed tasks.
-- Afterwards client_tasks_old is a backup: check the app, then `DROP TABLE client_tasks_old;`.
BEGIN;
INSERT INTO tasks (category, client_id, assigned_to_id, created_by_id, description, due_date, notification, status, closed_at)
SELECT 'client_follow_up', client_id, assigned_to_id, created_by_id, description, due_date, false, status,
       CASE WHEN status IN ('achieved', 'unsuccessful') THEN due_date END
FROM client_tasks;
ALTER TABLE client_tasks RENAME TO client_tasks_old;
COMMIT;
