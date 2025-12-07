'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface GlobalStatsData {
    total_diyas_lit: number;
    active_celebrations: number;
}

const COMMUNITY_GOAL = 100000;

export const GlobalStats: React.FC = () => {
    const [stats, setStats] = useState<GlobalStatsData | null>(null);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        fetchStats();

        // Poll every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_global_stats');

            if (error) {
                logger.error({ error }, 'Failed to fetch global stats');
                return;
            }

            if (data && data.length > 0) {
                setStats(data[0]);
            }
        } catch (err) {
            logger.error({ error: err }, 'Unexpected error fetching stats');
        }
    };

    if (!mounted || !stats) return null;

    const progress = Math.min((stats.total_diyas_lit / COMMUNITY_GOAL) * 100, 100);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 pointer-events-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Total Counter */}
                    <div className="text-center md:text-left">
                        <h3 className="text-gray-300 text-sm font-medium tracking-wider uppercase mb-1">
                            Global Participation
                        </h3>
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                            {stats.total_diyas_lit.toLocaleString()}
                        </div>
                        <p className="text-orange-300 text-sm">
                            Diyas lit worldwide across {stats.active_celebrations} celebrations
                        </p>
                    </div>

                    {/* Community Goal */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <h3 className="text-gray-300 text-sm font-medium tracking-wider uppercase">
                                Community Goal
                            </h3>
                            <span className="text-yellow-400 font-bold">
                                {progress.toFixed(1)}%
                            </span>
                        </div>

                        <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-1000 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                            <span>0</span>
                            <span>{COMMUNITY_GOAL.toLocaleString()} Lights</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
