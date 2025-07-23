import { doctorService } from "../services/doctorService";

export async function fetchTeamMembers() {
  try {
    const response = await doctorService.getAllDoctors();
    return (response.data || [])
      .filter((doc) => doc.status === "active")
      .map((doc) => ({
        name: `Dr. ${doc.first_name} ${doc.last_name}`.trim(),
        role: doc.specialization || "Veterinarian",
        image: doc.profile_image, // Always use the photo from DB
        experience_years: doc.experience_years
          ? `Experience : ${doc.experience_years} years`
          : "",
        description: doc.bio || doc.description || "",
        email: doc.email,
        phone: doc.phone,
      }));
  } catch (e) {
    return [];
  }
}
