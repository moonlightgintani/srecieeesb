-- Supabase Setup Script

-- 1. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    sno INT NOT NULL,
    event TEXT NOT NULL,
    date TEXT NOT NULL,
    chief_guest TEXT NOT NULL,
    participants TEXT NOT NULL
);

-- 2. Office Bearers Table
CREATE TABLE IF NOT EXISTS office_bearers (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL
);

-- 3. Executive Members Table
CREATE TABLE IF NOT EXISTS executive_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL
);

-- 4. Advisors Table
CREATE TABLE IF NOT EXISTS advisors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL
);

-- 5. Societies Table
CREATE TABLE IF NOT EXISTS societies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- ENABLE ROW LEVEL SECURITY (RLS) BUT ALLOW PUBLIC READ/WRITE FOR NOW 
-- (For a rigid Admin dashboard, you'd later restrict this to authenticated users)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update activities" ON activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete activities" ON activities FOR DELETE USING (true);

ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read office_bearers" ON office_bearers FOR SELECT USING (true);
CREATE POLICY "Allow public insert office_bearers" ON office_bearers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update office_bearers" ON office_bearers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete office_bearers" ON office_bearers FOR DELETE USING (true);

ALTER TABLE executive_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read executive_members" ON executive_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert executive_members" ON executive_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update executive_members" ON executive_members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete executive_members" ON executive_members FOR DELETE USING (true);

ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read advisors" ON advisors FOR SELECT USING (true);
CREATE POLICY "Allow public insert advisors" ON advisors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update advisors" ON advisors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete advisors" ON advisors FOR DELETE USING (true);

ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read societies" ON societies FOR SELECT USING (true);
CREATE POLICY "Allow public insert societies" ON societies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update societies" ON societies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete societies" ON societies FOR DELETE USING (true);

-- Insert Current Data
INSERT INTO office_bearers (role, name, department) VALUES 
('Student Branch Counsellor', 'Dr.K.Balamurugan', 'AsP/EEE'),
('Chairperson', 'P Joselyn', 'IV/EEE'),
('Vice-Chairperson', 'S Darshan', 'III/EEE'),
('Secretary', 'T Akshreeya', 'III/EEE'),
('Activities Co-ordinator', 'Anjanalakshmi S Prabhu', 'III/BME'),
('Joint Activities Co-ordinator', 'R Keerthana', 'III/CSE'),
('Treasurer', 'S Mukesh Kumaaran', 'II/EEE'),
('Web Designer', 'S Deepak', 'III/EEE'),
('Editor', 'K G Amritha Varshini', 'III/IT');

INSERT INTO executive_members (name, department) VALUES
('S Karishma', 'III/EEE'),
('S K Karishma', 'III/IT'),
('V Maha Shree', 'III/ECE'),
('K S Karthika', 'III/IT'),
('Dipendra Mahato', 'III/EEE'),
('R Dhananjayan', 'II/RA'),
('S Sharmila', 'II/EEE'),
('S Reshmi', 'II/EEE'),
('S R Shanjana Sri', 'II/EEE');

INSERT INTO advisors (name, role) VALUES
('Dr.K.Balamurugan', 'IEEE SB Counselor'),
('Dr.P.Perumal', 'Dean-SAC'),
('Dr.A.Soundarrajan', 'Principal');

INSERT INTO societies (name) VALUES
('IEEE Power Electronics Society'),
('IEEE EMB Society'),
('IEEE Communications Society'),
('IEEE Measurement & Instrumentation Society');

INSERT INTO activities (year, sno, event, date, chief_guest, participants) VALUES
(2025, 1, 'IEEE Student Branch Inaugural Function', '17.09.2025', 'Mr. Viswanathan Rajalingam, VP & GM, Multicoreware, Chennai', 'All IEEE Members'),
(2025, 2, 'VisionX 2025 – Driving the Future with Innovation', '29.08.2025', 'Mr. Sivakumar Palanisamy, Vice President, StartupTN', '30 participants'),
(2025, 3, 'Workshop "The Road Not Taken" for Slow Learners', '04.04.2025', 'Dr. G. Senthil Kumar, Founder, Helikx, Salem', '60 participants'),
(2024, 1, 'Teaching from Rear View - New Normal Pedagogy', '15.02.2024', 'Dr Chockalingam Aravind Vaithilingam, Taylor''s University, Malaysia', '30 Faculties');
-- The rest of your activities can be added via the new Admin Dashboard!
