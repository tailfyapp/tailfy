import { getUserProfile } from "@/lib/auth-helpers";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { OpeningHoursEditor } from "@/components/dashboard/opening-hours-editor";
import { ProfileImageUpload } from "@/components/dashboard/profile-image-upload";
import type { OpeningHours } from "@/types";

export default async function PerfilPage() {
  const profile = await getUserProfile();
  const openingHours = (profile.openingHours as OpeningHours) ?? {};

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-500 mt-1">
          Edite as informações do seu negócio.
        </p>
      </div>

      <ProfileImageUpload
        avatarUrl={profile.avatarUrl}
        coverUrl={profile.coverUrl}
        businessName={profile.businessName}
        profileId={profile.id}
      />

      <ProfileForm profile={profile} />

      <OpeningHoursEditor openingHours={openingHours} />
    </div>
  );
}
