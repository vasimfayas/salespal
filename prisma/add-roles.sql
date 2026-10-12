-- One-off, AFTER `npx prisma db push`: adds the Operations (5) and Super Admin (6) roles. Idempotent; safe to re-run.
INSERT INTO roles (id, name) VALUES (5, 'Operations'), (6, 'Super Admin') ON CONFLICT (id) DO NOTHING;

-- Make an existing login the super admin (replace the email):
-- UPDATE users SET role_id = 6 WHERE email = 'you@example.com';
