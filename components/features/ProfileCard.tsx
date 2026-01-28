import Image from "next/image";
import { ProfileData } from "../../types/github";
import { MetricCard } from "../ui/MetricCard";
import {
  ExternalLinkIcon,
  LocationIcon,
  CompanyIcon,
  CalendarIcon,
} from "../ui/Icon";

interface ProfileCardProps {
  profile: ProfileData;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src={profile.avatarUrl}
              alt={`${profile.name}'s avatar`}
              fill
              className="rounded-2xl object-cover ring-2 ring-border"
              priority
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {profile.name}
            </h1>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              aria-label={`Visit ${profile.username}'s GitHub profile`}
            >
              @{profile.username}
              <ExternalLinkIcon />
            </a>
          </div>

          {profile.bio && (
            <p className="text-muted text-sm leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <MetricCard
              label="Followers"
              value={profile.followers.toLocaleString()}
              variant="compact"
            />
            <MetricCard
              label="Following"
              value={profile.following.toLocaleString()}
              variant="compact"
            />
            <MetricCard
              label="Repositories"
              value={profile.publicRepos.toLocaleString()}
              variant="compact"
            />
            <MetricCard
              label="Joined"
              value={profile.accountAge}
              variant="compact"
            />
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted">
            {profile.location && (
              <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg">
                <LocationIcon />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg">
                <CompanyIcon />
                <span>{profile.company}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg">
              <CalendarIcon />
              <span>Joined {profile.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
