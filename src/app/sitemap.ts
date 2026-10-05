import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dokumen, bidangList] = await Promise.all([
    prisma.dokumenPublikasi.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.bidang.findMany({ select: { noUrut: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/dokumen`, changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/data-nominatif`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${appUrl}/sop`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${appUrl}/pengumuman`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${appUrl}/sanggahan/baru`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/sanggahan/lacak`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const dokumenRoutes: MetadataRoute.Sitemap = dokumen.map((d) => ({
    url: `${appUrl}/dokumen/${d.id}`,
    lastModified: d.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const bidangRoutes: MetadataRoute.Sitemap = bidangList.map((b) => ({
    url: `${appUrl}/data-nominatif/${b.noUrut}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...dokumenRoutes, ...bidangRoutes];
}
