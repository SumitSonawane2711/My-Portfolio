import type { TablerIcon } from '@tabler/icons-react'
import {
    IconApi,
    IconBrandCss3,
    IconBrandHtml5,
    IconBrandJavascript,
    IconBrandMongodb,
    IconBrandMysql,
    IconBrandNextjs,
    IconBrandNodejs,
    IconBrandReact,
    IconBrandTailwind,
    IconBrandTypescript,
    IconBrandWordpress,
    IconDatabase,
    IconShoppingBag,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type TechMeta = {
    icon: TablerIcon
    color: string
}

const techIcons: Record<string, TechMeta> = {
    'adonis.js': { icon: IconApi, color: '#5A45FF' },
    'css': { icon: IconBrandCss3, color: '#1572B6' },
    'express.js': { icon: IconApi, color: '#6B7280' },
    'html': { icon: IconBrandHtml5, color: '#E34F26' },
    'javascript': { icon: IconBrandJavascript, color: '#F7DF1E' },
    'mongodb': { icon: IconBrandMongodb, color: '#47A248' },
    'mysql': { icon: IconBrandMysql, color: '#4479A1' },
    'next.js': { icon: IconBrandNextjs, color: '#e4e7ed' },
    'node.js': { icon: IconBrandNodejs, color: '#339933' },
    'postgresql': { icon: IconDatabase, color: '#4169E1' },
    'react': { icon: IconBrandReact, color: '#61DAFB' },
    'shopify': { icon: IconShoppingBag, color: '#7AB55C' },
    'tailwind css': { icon: IconBrandTailwind, color: '#06B6D4' },
    'typescript': { icon: IconBrandTypescript, color: '#3178C6' },
    'wordpress': { icon: IconBrandWordpress, color: '#21759B' },
}

export const getTechMeta = (technology: string) => techIcons[technology.toLowerCase()]

export const TechIcon = ({
    technology,
    className = 'h-4 w-4',
}: {
    technology: string
    className?: string
}) => {
    const tech = getTechMeta(technology)

    if (!tech) {
        return null
    }

    const Icon = tech.icon

    return (
        <Icon
            aria-hidden='true'
            className={className}
            stroke={1.8}
            style={{ color: tech.color }}
        />
    )
}

// Deterministic tilt/offset pattern so a "scattered" cluster looks organic
// without random values causing SSR/client hydration mismatches.
const SCATTER_PATTERN = [
    { rotate: -6, translateY: 0 },
    { rotate: 4, translateY: 6 },
    { rotate: -3, translateY: -4 },
    { rotate: 8, translateY: 2 },
    { rotate: -8, translateY: -6 },
    { rotate: 5, translateY: 4 },
    { rotate: -4, translateY: 0 },
    { rotate: 6, translateY: -3 },
]

export const TechIconGroup = ({
    technologies,
    iconClassName,
    itemClassName = 'inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
    scatter = false,
}: {
    technologies: string[]
    iconClassName?: string
    itemClassName?: string
    /** Loose, tilted cluster instead of a tidy wrapped grid — for decorative/background use */
    scatter?: boolean
}) => {
    return (
        <div className={cn('flex flex-wrap gap-2', scatter && 'justify-center gap-3 sm:gap-4')}>
            {technologies.map((technology, idx) => {
                const tech = getTechMeta(technology)

                if (!tech) {
                    return null
                }

                const pattern = SCATTER_PATTERN[idx % SCATTER_PATTERN.length]

                return (
                    <span
                        key={technology}
                        aria-label={technology}
                        title={technology}
                        className={itemClassName}
                        style={
                            scatter
                                ? {
                                      transform: `rotate(${pattern.rotate}deg) translateY(${pattern.translateY}px)`,
                                  }
                                : undefined
                        }
                    >
                        <TechIcon technology={technology} className={iconClassName} />
                    </span>
                )
            })}
        </div>
    )
}