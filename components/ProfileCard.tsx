"use client";

import Image from "next/image";
import { ProfileData } from "../types/github";
import Tooltip from "./Tooltip";

interface ProfileCardProps {
  profile: ProfileData;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <Image
              src={profile.avatarUrl}
              alt={`${profile.name}'s avatar`}
              fill
              className="rounded-lg object-cover ring-2 ring-accent/20"
              priority
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {profile.name}
            </h1>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-mono text-sm"
            >
              @{profile.username}
            </a>
          </div>

          {profile.bio && (
            <p className="text-muted text-sm leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
            <MetricCard
              label="Followers"
              sublabel="Community Reach"
              value={profile.followers.toLocaleString()}
              tooltip="Number of users following this profile"
            />
            <MetricCard
              label="Following"
              value={profile.following.toLocaleString()}
            />
            <MetricCard
              label="Repositories"
              sublabel="Public Work"
              value={profile.publicRepos.toLocaleString()}
              tooltip="Publicly visible repositories"
            />
            <MetricCard
              label="Member Since"
              value={profile.accountAge}
              tooltip="Account age and experience"
            />
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted">
            {profile.location && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>{profile.company}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Joined {profile.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  tooltip?: string;
}

function MetricCard({ label, value, sublabel, tooltip }: MetricCardProps) {
  return (
    <div className="space-y-1">
      <div className="text-2xl font-mono font-bold text-foreground">
        {value}
      </div>
      <div className="flex items-center gap-1">
        <div className="text-xs text-muted uppercase tracking-wider">
          {sublabel || label}
        </div>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
    </div>
  );
}
