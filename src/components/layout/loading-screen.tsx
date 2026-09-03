import Image from "next/image";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-white dark:bg-zinc-950">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-500" />
        <Image
          src="/sipatan-logo.png"
          alt="SIPATAN"
          width={140}
          height={140}
          priority
          className="h-14 w-auto object-contain"
        />
      </div>
    </div>
  );
}
