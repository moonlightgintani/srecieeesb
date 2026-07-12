import workshop from "@/assets/gallery-workshop.jpg";
import conference from "@/assets/gallery-conference.jpg";
import hackathon from "@/assets/gallery-hackathon.jpg";
import awards from "@/assets/gallery-awards.jpg";
import ieeeday from "@/assets/gallery-ieeeday.jpg";
import industrial from "@/assets/gallery-industrial.jpg";
import talk from "@/assets/gallery-talk.jpg";
import competition from "@/assets/gallery-competition.jpg";
import community from "@/assets/gallery-community.jpg";
import group from "@/assets/gallery-group.jpg";
import expo from "@/assets/gallery-expo.jpg";
import inauguration from "@/assets/gallery-inauguration.jpg";

export type Category =
  | "Workshops"
  | "Conferences"
  | "Hackathons"
  | "Technical Talks"
  | "Competitions"
  | "Industrial Visits"
  | "Community Service"
  | "IEEE Day"
  | "Awards"
  | "Student Activities";

export const categories: Category[] = [
  "Workshops",
  "Conferences",
  "Hackathons",
  "Technical Talks",
  "Competitions",
  "Industrial Visits",
  "Community Service",
  "IEEE Day",
  "Awards",
  "Student Activities",
];

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: Category;
  image: string;
  year: number;
}

export const galleryItems: GalleryItem[] = [
  { id: "1", title: "AI & ML Bootcamp", date: "March 2025", description: "Hands-on machine learning workshop with industry mentors.", category: "Workshops", image: workshop, year: 2025 },
  { id: "2", title: "International Conference on Emerging Tech", date: "Feb 2025", description: "Global speakers unpack the future of engineering.", category: "Conferences", image: conference, year: 2025 },
  { id: "3", title: "SREC HackFest 24", date: "Oct 2024", description: "36-hour hackathon with 200+ passionate coders.", category: "Hackathons", image: hackathon, year: 2024 },
  { id: "4", title: "Excellence Awards Night", date: "Dec 2024", description: "Celebrating outstanding student contributions.", category: "Awards", image: awards, year: 2024 },
  { id: "5", title: "IEEE Day 2024", date: "Oct 2024", description: "Global celebration of engineering impact.", category: "IEEE Day", image: ieeeday, year: 2024 },
  { id: "6", title: "Visit to Bosch R&D", date: "Aug 2024", description: "Behind-the-scenes at a global engineering leader.", category: "Industrial Visits", image: industrial, year: 2024 },
  { id: "7", title: "Distinguished Lecture Series", date: "July 2024", description: "Insights from an IEEE Fellow on future tech.", category: "Technical Talks", image: talk, year: 2024 },
  { id: "8", title: "RoboWars Championship", date: "Sep 2024", description: "Combat robots designed and built by our students.", category: "Competitions", image: competition, year: 2024 },
  { id: "9", title: "Digital Literacy Drive", date: "June 2024", description: "Teaching kids to code in nearby government schools.", category: "Community Service", image: community, year: 2024 },
  { id: "10", title: "Annual Group Photo", date: "May 2024", description: "The 2024 IEEE SB SREC family portrait.", category: "Student Activities", image: group, year: 2024 },
  { id: "11", title: "Project Expo 2024", date: "April 2024", description: "60+ student projects on display for the community.", category: "Student Activities", image: expo, year: 2024 },
  { id: "12", title: "Chapter Inauguration", date: "Jan 2023", description: "Launch of the Computer Society Student Chapter.", category: "IEEE Day", image: inauguration, year: 2023 },
  { id: "13", title: "Web3 Workshop", date: "Nov 2023", description: "Introduction to blockchain and smart contracts.", category: "Workshops", image: workshop, year: 2023 },
  { id: "14", title: "Signal Processing Symposium", date: "Aug 2023", description: "Regional IEEE technical symposium hosted at SREC.", category: "Conferences", image: conference, year: 2023 },
  { id: "15", title: "CodeStorm 22", date: "Sep 2022", description: "Competitive programming meet, 300+ participants.", category: "Competitions", image: competition, year: 2022 },
  { id: "16", title: "Rural Outreach Program", date: "Nov 2022", description: "IEEE SIGHT initiative for solar education.", category: "Community Service", image: community, year: 2022 },
];

export const featuredMemories = [
  { title: "IEEE Day Celebration", image: ieeeday, year: "2024" },
  { title: "International Conference", image: conference, year: "2025" },
  { title: "Project Expo", image: expo, year: "2024" },
  { title: "Hackathon Winners", image: hackathon, year: "2024" },
  { title: "Student Branch Inauguration", image: inauguration, year: "2023" },
  { title: "Industrial Visit", image: industrial, year: "2024" },
];

export const stats = [
  { label: "Events", value: 250, suffix: "+" },
  { label: "Participants", value: 5000, suffix: "+" },
  { label: "Workshops", value: 100, suffix: "+" },
  { label: "Years of Excellence", value: 10, suffix: "+" },
];

export const timelineYears = [2022, 2023, 2024, 2025, 2026];

export const achievements = [
  { title: "Best Student Branch", subtitle: "IEEE Madras Section 2024", image: awards },
  { title: "50+ Certificates", subtitle: "Awarded in 2024 alone", image: awards },
  { title: "Winning Teams", subtitle: "12 national-level wins", image: competition },
  { title: "Volunteers", subtitle: "150+ active this year", image: group },
  { title: "Distinguished Speakers", subtitle: "20+ IEEE Fellows hosted", image: talk },
  { title: "Organizing Committee", subtitle: "The people behind the scenes", image: inauguration },
];

export const videoGallery = [
  { title: "IEEE Day Highlights", id: "dQw4w9WgXcQ" },
  { title: "Workshop Highlights", id: "9bZkp7q19f0" },
  { title: "Conference Recap", id: "3JZ_D3ELwOQ" },
  { title: "Student Testimonials", id: "L_jWHffIx5E" },
];

export const testimonials = [
  { name: "Ananya Krishnan", dept: "ECE, Final Year", quote: "IEEE SB SREC gave me the confidence to speak at my first international conference. The community is unmatched.", rating: 5, avatar: "https://i.pravatar.cc/150?img=47" },
  { name: "Rahul Venkatesh", dept: "CSE, Third Year", quote: "From my first workshop to leading a hackathon team — every milestone happened here.", rating: 5, avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Divya Suresh", dept: "EEE, Alumni '23", quote: "The industrial visits and mentorship shaped the engineer I am today. Grateful forever.", rating: 5, avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "Karthik Rajan", dept: "IT, Second Year", quote: "A branch that treats every idea seriously. Best decision I made in college.", rating: 5, avatar: "https://i.pravatar.cc/150?img=15" },
];
