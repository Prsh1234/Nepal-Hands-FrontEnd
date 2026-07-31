export type VolunteerProfile = {
    id: string;
    name: string;
    avatar: string;
    location: string;
    age: number;
    bio: string;
    skills: string[];
    causes: string[];
    availability: string;
    pastExperience: {
      title: string;
      org: string;
      year: number;
      hours: number;
      rating: number;
    }[];
    completedOps: number;
  };
  
  export const volunteerProfiles: VolunteerProfile[] = [
    {
      id: "vp-001",
      name: "Sunil Bhattarai",
      avatar: "SB",
      location: "Kathmandu, Bagmati",
      age: 26,
      bio: "Former teacher passionate about rural education and children's literacy.",
      skills: ["Teaching", "Translation", "IT & Digital", "English"],
      causes: ["Education", "Women Empowerment"],
      availability: "Short-term (1–2 weeks)",
      pastExperience: [
        { title: "English Camp for Kids", org: "Teach Nepal", year: 2025, hours: 60, rating: 4.9 },
        { title: "Library Setup – Gorkha", org: "Room to Read", year: 2024, hours: 40, rating: 4.8 },
      ],
      completedOps: 4,
    },
    {
      id: "vp-002",
      name: "Priya Lama",
      avatar: "PL",
      location: "Pokhara, Gandaki",
      age: 31,
      bio: "Registered nurse with 4 years of experience in mobile health camps.",
      skills: ["Nursing", "First Aid", "Medical", "Counseling"],
      causes: ["Healthcare", "Disaster Relief"],
      availability: "One-time Event",
      pastExperience: [
        { title: "Health Camp – Jumla", org: "Shakti Samuha", year: 2025, hours: 56, rating: 5.0 },
        { title: "Earthquake Response", org: "Red Cross Nepal", year: 2023, hours: 120, rating: 4.9 },
      ],
      completedOps: 6,
    },
    {
      id: "vp-003",
      name: "Kiran Adhikari",
      avatar: "KA",
      location: "Lalitpur, Bagmati",
      age: 22,
      bio: "Engineering student volunteering on construction and STEM outreach.",
      skills: ["Construction", "Engineering", "Math", "Teaching"],
      causes: ["Education", "Disaster Relief"],
      availability: "Medium-term (1–3 months)",
      pastExperience: [
        { title: "School Rebuild – Sindhupalchok", org: "Education First Nepal", year: 2025, hours: 180, rating: 4.7 },
      ],
      completedOps: 2,
    },
    {
      id: "vp-004",
      name: "Sabina Rai",
      avatar: "SR",
      location: "Dharan, Koshi",
      age: 28,
      bio: "Logistics coordinator with a focus on women-led community programs.",
      skills: ["Logistics", "Project Management", "Social Work"],
      causes: ["Women Empowerment", "Culture & Heritage"],
      availability: "Short-term (1–2 weeks)",
      pastExperience: [
        { title: "Skill Training Center", org: "Women's Foundation", year: 2024, hours: 90, rating: 4.6 },
      ],
      completedOps: 3,
    },
    {
      id: "vp-005",
      name: "Dipesh Magar",
      avatar: "DM",
      location: "Chitwan, Bagmati",
      age: 34,
      bio: "Environmentalist and trail guide committed to conservation projects.",
      skills: ["Environment", "Trail Building", "First Aid"],
      causes: ["Environment", "Culture & Heritage"],
      availability: "Medium-term (1–3 months)",
      pastExperience: [
        { title: "Trail Restoration Annapurna", org: "Himalayan Trust", year: 2025, hours: 240, rating: 4.8 },
        { title: "Reforestation Chitwan", org: "WWF Nepal", year: 2023, hours: 80, rating: 4.7 },
      ],
      completedOps: 5,
    },
    {
      id: "vp-006",
      name: "Anita Shrestha",
      avatar: "AS",
      location: "Bhaktapur, Bagmati",
      age: 29,
      bio: "Graphic designer and English tutor helping education-focused NGOs.",
      skills: ["Design", "Teaching", "English", "Creative Activities"],
      causes: ["Education", "Culture & Heritage"],
      availability: "Short-term (1–2 weeks)",
      pastExperience: [
        { title: "Art with Kids – Bhaktapur", org: "Nepal Youth Foundation", year: 2024, hours: 45, rating: 4.9 },
      ],
      completedOps: 2,
    },
  ];
  
  export const getVolunteerProfile = (id: string) =>
    volunteerProfiles.find((v) => v.id === id);
  
  /**
   * Simple recommendation scoring.
   * Weights: skills 3, interests/causes 2, availability match 2, verified 1, rating*.
   */
  export function scoreVolunteer(
    v: VolunteerProfile,
    criteria: {
      skills?: string[];
      interests?: string[];
      availability?: string;
      minRating?: number;
    }
  ) {
    let score = 0;
    const matched: string[] = [];
    (criteria.skills ?? []).forEach((s) => {
      if (v.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())) {
        score += 3;
        matched.push(`Skill: ${s}`);
      }
    });
    (criteria.interests ?? []).forEach((i) => {
      if (
        v.causes.map((x) => x.toLowerCase()).includes(i.toLowerCase())
      ) {
        score += 2;
        matched.push(`Interest: ${i}`);
      }
    });
    if (criteria.availability && v.availability === criteria.availability) {
      score += 2;
      matched.push(`Available: ${criteria.availability}`);
    }
    // score += v.rating; // 0-5 baseline
    score += Math.min(v.completedOps, 5) * 0.5;
    // if (criteria.minRating && v.rating < criteria.minRating) score -= 5;
    return { score, matched };
  }