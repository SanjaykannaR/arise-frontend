import React from "react";
import { Dumbbell, Heart } from "lucide-react";

const ChestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8c0 4 3 6 9 6s9-2 9-6" />
    <path d="M4 17c2-2 4-3 8-3s6 1 8 3" />
    <path d="M12 14v3" />
  </svg>
);

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v8" />
    <path d="M4 8c3-2 5-3 8-3s5 1 8 3" />
    <path d="M6 20c2-4 4-6 6-6s4 2 6 6" />
  </svg>
);

const LegIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v8" />
    <path d="M8 12c-2 1-4 3-4 6" />
    <path d="M16 12c2 1 4 3 4 6" />
    <path d="M8 18c0 2 3 3 4 3" />
    <path d="M16 18c0 2-3 3-4 3" />
  </svg>
);

const ShoulderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v6" />
    <path d="M3 10c3-2 6-3 9-3s6 1 9 3" />
    <path d="M5 16c2-2 4-3 7-3s5 1 7 3" />
  </svg>
);

const ArmIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v12c0 2 2 4 4 4" />
    <path d="M18 4v12c0 2-2 4-4 4" />
    <path d="M14 10c0 2-2 4-4 4" />
    <path d="M10 10c0 2 2 4 4 4" />
  </svg>
);

const CoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="4" width="8" height="16" rx="2" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
    <path d="M8 16h8" />
  </svg>
);

export function getExerciseIcon(exerciseName: string, className?: string): React.ReactNode {
  const n = exerciseName.toLowerCase();
  const cls = className || "w-5 h-5 text-primary";

  if (/chest|bench|fly|push.?up|pec|incline|decline|dumbbell.?press|barbell.?press/.test(n))
    return <ChestIcon className={cls} />;

  if (/back|pull.?up|row|pulldown|chin|lat|face.?pull|rear|delt.?row|t.?bar/.test(n))
    return <BackIcon className={cls} />;

  if (/leg|squat|lunge|deadlift|quad|hamstring|glute|hack|press|leg.?curl|leg.?extension|calve|bulgarian/.test(n))
    return <LegIcon className={cls} />;

  if (/shoulder|overhead|lateral|raise|deltoid|ohp|front.?raise|shrug|upright/.test(n))
    return <ShoulderIcon className={cls} />;

  if (/bicep|tricep|curl|arm|extension|hammer|skull|cable.?curl|pushdown|preacher/.test(n))
    return <ArmIcon className={cls} />;

  if (/core|abs|plank|crunch|sit.?up|leg.?raise|hanging|russian|torso|oblique|v.?up|hip.?thrust|bridge/.test(n))
    return <CoreIcon className={cls} />;

  if (/cardio|run|jump|bike|swim|rowing|hiit|burpee|jump.?rope|sprint|treadmill|elliptical|stair/.test(n))
    return <Heart className={cls} />;

  return <Dumbbell className={cls} />;
}
